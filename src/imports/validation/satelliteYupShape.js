import * as Yup from "yup";
import { _ } from "meteor/underscore";
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";

const schemaCleaner = (schemas, values) => {
  let schemaObj = {}; // object: {schema.name: {field.name: {field.type: string/number/date, field.allowedValues: [], required: field.required, min: field.min, max: field.max}}}

  let cleanSchemas = []; // stores only the schemas applicable to the current satellite values
  for (let value in values) {
    for (let schema in schemas) {
      if (schemas[schema].name === value) cleanSchemas.push(schemas[schema]);
    }
  }

  cleanSchemas?.forEach((schema) => {
    // step 1: map over schemas and assign each schema name as a key in the object
    schemaObj[schema.name] = {};
    // step 2: map over each schema and assign an object containing all field names as keys in that object
    return schema.fields.forEach((field) => {
      schemaObj[schema.name][field.name] = {};
      // step 3: map over each field and assign an object containing all of the field's attributes (type, allowedValues, min, max, required)
      for (let attribute in field) {
        if (attribute !== "name" && attribute !== "description") {
          // step 4: Take each attribute's value and assign it to the attribute in the object
          schemaObj[schema.name][field.name][attribute] = field[attribute];
        }
      }
    });
  });
  return schemaObj;
};

const initialYupShapeGenerator = (initValues) => {
  return {
    // NORAD ID and _id are always a part of the yup shape
    _id: Yup.string().test(
      "uniqueID",
      (obj) => `The _id, "${obj?.value}", already exists in our database`,
      (value) =>
        SatelliteCollection.findOne({ _id: value })?._id !== initValues._id && value ? SatelliteCollection.find({ _id: value }).count() === 0 : true
    ),
    noradID: Yup.string()
      .required(`Required`)
      .matches(/^[0-9]+$/g, "Must be a positive number")
      .test(
        "uniqueNORADID",
        (obj) => `The NORAD ID, "${obj?.value}", already exists in our database`,
        (value) =>
          SatelliteCollection.findOne({ noradID: value })?.noradID !== initValues.noradID && value
            ? SatelliteCollection.find({ noradID: value }).count() === 0
            : true
      ),
    adminCheck: Yup.boolean().nullable(),
    machineCheck: Yup.boolean().nullable(),
    modifiedOn: Yup.date().nullable(),
    modifiedBy: Yup.string().nullable(),
    createdOn: Yup.date().nullable(),
    createdBy: Yup.string().nullable()
  };
};

export const satelliteValidatorShaper = (values, initValues) => {
  const schemas = SchemaCollection.find().fetch();
  let yupShape = initialYupShapeGenerator(initValues); // instantiation of base yupShape
  const cleanSchema = schemaCleaner(schemas, values); // generates a clean schema object for easier manipulation

  Yup.addMethod(Yup.mixed, "checkEachEntry", function (message) {
    let errObj = {}; // workaround object to push errors into Formik
    return this.test("checkEachEntry", message, function (value) {
      const { path, createError } = this; // path is the schema's name, and createError generates errors to be handled by Formik
      let entryCount = 0; // "entryCount" and "fieldCount" are used to provide the location of the error to the SatelliteModal for rendering underneath the correct entry in SatelliteSchemaEntry
      value?.forEach((entry) => {
        // "entry" is composed of multiple "fields", and is part of the submitted array, aka "value"
        let fieldObj = {};
        let fieldCount = 0; // index for error tracking
        const schema = cleanSchema[path];
        for (let schemaField in schema) {
          // "schema" are the schemas seen on the SchemasTable, and "schemaField" are the fields to be filled-in in each schema
          const field = schema[schemaField];
          // the following must be modified whenever we decide to create:
          // a new "type" (e.g. number, string, date) or
          // a new "type constraint" (e.g. max number, min number, max string length)
          let baseFieldSchema; // initialize vairable to store sub-schema constraints
          switch (field.type) {
            case "string":
              baseFieldSchema = Yup.string().trim();
              break;
            case "url":
              baseFieldSchema = Yup.string().url(
                `${path}-${entryCount}-${fieldCount}_Must be a valid URL (e.g. https://en.wikipedia.org/wiki/Main_Page)`
              );
              break;
            case "validated":
              baseFieldSchema = Yup.array()
                .required()
                .of(
                  Yup.object().shape({
                    validated: Yup.boolean(),
                    method: Yup.string().when("validated", {
                      is: true,
                      then: Yup.string().oneOf(["user", "machine"]).required(),
                      otherwise: Yup.string().nullable()
                    }),
                    name: Yup.string().when("validated", {
                      is: true,
                      then: Yup.string().required(),
                      otherwise: Yup.string().nullable()
                    }),
                    validatedOn: Yup.date().when("validated", {
                      is: true,
                      then: Yup.date().required(),
                      otherwise: Yup.date().nullable()
                    })
                  })
                );
              break;
            case "verified":
              baseFieldSchema = Yup.array()
                .required()
                .of(
                  Yup.object().shape({
                    verified: Yup.boolean(),
                    method: Yup.string().when("verified", {
                      is: true,
                      then: Yup.string().oneOf(["user", "machine"]).required(),
                      otherwise: Yup.string().nullable()
                    }),
                    name: Yup.string().when("verified", {
                      is: true,
                      then: Yup.string().required(),
                      otherwise: Yup.string().nullable()
                    }),
                    verifiedOn: Yup.date().when("verified", {
                      is: true,
                      then: Yup.date().required(),
                      otherwise: Yup.date().nullable()
                    })
                  })
                );
              break;
            case "changelog":
              baseFieldSchema = Yup.array();
              break;
            case "date":
              baseFieldSchema = Yup.date();
              break;
            default:
              baseFieldSchema = Yup[`${field.type}`]();
              break;
          }
          const baseFieldType = baseFieldSchema; // initialize vairable to store sub-schema type
          const fieldSchemaMatrix = {
            // stores the yup fragments needed for each constraint
            min:
              field.type === "number" && field.min
                ? baseFieldType.min(field.min, `${path}-${entryCount}-${fieldCount}_Must be no less than ${field.min}`)
                : false,
            max:
              field.type === "number" && field.max
                ? baseFieldType.max(field.max, `${path}-${entryCount}-${fieldCount}_Must be no greater than ${field.max}`)
                : false,
            allowedValues:
              field.allowedValues?.length > 0
                ? baseFieldType.oneOf([...field.allowedValues], `${path}-${entryCount}-${fieldCount}_Please select an option from the list`)
                : false,
            stringMax:
              field.type === "string" && field.stringMax
                ? baseFieldType.max(field.stringMax, `${path}-${entryCount}-${fieldCount}_Must not exceed ${field.stringMax} characters`)
                : false,
            required: field.required
              ? baseFieldType.required(
                  `${path}-${entryCount}-${fieldCount}_${
                    field.type === "url" ? "URL" : field.type[0].toUpperCase() + field.type.substr(1) + " Input"
                  } Required`
                )
              : false,
            isUnique:
              field.type === "string" && field.isUnique
                ? baseFieldType.test(
                    "isUnique",
                    value[entryCount][schemaField]
                      ? `${path}-${entryCount}-${fieldCount}_A satellite with ${schemaField} of ${value[entryCount][schemaField]} already exists`
                      : `${path}-${entryCount}-${fieldCount}_Required`,
                    (value) => {
                      let or = [];
                      if (initValues[path]) {
                        initValues[path].forEach((entry, index) => {
                          let tempObj = {};
                          tempObj[`${path}.${schemaField}`] = initValues[path][index][schemaField];
                          or.push(tempObj);
                        });
                      }
                      let selector = or.length > 0 ? { $or: or } : {};
                      let sat = SatelliteCollection.findOne(selector);
                      if (sat) {
                        selector = {};
                        selector[`${path}.${schemaField}`] = value;
                        return sat[path].find((entry) => entry[schemaField] === value) ? true : SatelliteCollection.find(selector).count() === 0;
                      }
                    }
                  )
                : false
          };
          for (let check in fieldSchemaMatrix) {
            if (fieldSchemaMatrix[check]) {
              baseFieldSchema = baseFieldSchema.concat(fieldSchemaMatrix[check]);
            }
          }
          fieldObj[schemaField] = baseFieldSchema; // add sub-schema constraints to the overall schema
          fieldCount++;
        }
        let fieldValidator = Yup.object().shape(fieldObj);

        // Yup.addMethod's test must return a boolean, and/or generate errors as necessary, in order to complete the validation
        fieldValidator
          .validate(entry)
          .then((result) => {
            // result values spit out by Yup after successful validation
            let resolved = `${path}-`; // provides an identifier to delete the correct error upon successful validation
            let tempArr = [];

            for (let i = 0; i < value.length; i++) {
              let object = value[i];
              for (let key in object) {
                // transforms to ensure  "result" object will be matched with the original tested "value", to avoid stale errors
                if (
                  (result[key] && Yup.date().isValidSync(result[key]) && typeof result[key] !== "number") ||
                  key === "verified" ||
                  key === "validated"
                ) {
                  // Yup transforms date strings into date objects; solution is to transform result values back to original values
                  result[key] = object[key];
                } else if (parseInt(object[key]) && object[key]) {
                  // The original values that are integers are sent as strings; solution is to transform the values back to numbers
                  object[key] = parseInt(object[key]);
                } else if (result[key] === undefined) {
                  // the original value may contain undefined values; solution is to delete any undefined values and their associated keys from the original value object
                  delete object[key];
                  delete result[key];
                }
              }
              tempArr.push(_.isEqual(object, result));
            }
            resolved = `${resolved}${tempArr.indexOf(true).toString()}-`;
            let key = Object.keys(errObj)[0];
            if (!errObj[key]) {
              // if the errObj contains the key and has the resolved error, clear the stale error
              errObj = {};
            }
            if (errObj[key].includes(resolved)) {
              delete errObj[key];
            }
          })
          .catch((err) => {
            for (let error in errObj) {
              if (err.path !== error) {
                // delete stale errors
                delete errObj[error];
              }
            }
            if (err.message !== "err is not defined" && err.path !== undefined) errObj[err["path"]] = err.message;
          });
        entryCount++;
      });

      if (_.isEmpty(errObj)) {
        return true;
      } else {
        for (let errPath in errObj) {
          let errMessage = errObj[errPath];
          let cleanMessage = errMessage.substr(errMessage.indexOf("_") + 1);
          let cleanPath = errMessage.substr(0, errMessage.indexOf("_"));
          return createError({
            path: `${cleanPath}`,
            message: `${cleanMessage}`
          });
        }
      }
    });
  });

  if (JSON.stringify(cleanSchema) !== "{}") {
    for (let schema in cleanSchema) {
      yupShape[schema] = Yup.array().checkEachEntry();
    }
  }

  return Yup.object().shape(yupShape);
};
