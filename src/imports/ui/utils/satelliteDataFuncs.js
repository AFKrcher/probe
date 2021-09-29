/**
 * PLEASE ENSURE THAT ANY CHANGES MADE HERE ARE REFLECTED IN SERVER-SIDE VALIDATIONS
 **/

import * as Yup from "yup";

// Data display functions
export const getSatName = (satellite) => {
  return satellite && satellite.names && satellite.names.length > 0
    ? satellite.names[0].name
    : "Name not found...";
};

export const getSatImage = (satellite) => {
  return satellite && satellite.images && satellite.images.length > 0
    ? satellite.images[0].link || satellite.images[0].url
    : "/sat-placeholder.jpg";
};

export const getSatImages = (satellite) => {
  return satellite && satellite.images && satellite.images.length > 0
    ? satellite.images
    : "/sat-placeholder.jpg";
};

export const getSatID = (satellite) => {
  return satellite && satellite.noradID
    ? satellite.noradID
    : "NORAD ID not found...";
};

export const getSatDesc = (satellite) => {
  return satellite &&
    satellite.descriptionShort &&
    satellite.descriptionShort.length > 0
    ? satellite.descriptionShort[0].descriptionShort
    : "";
};

// Data entry functions
export const emptyDataRemover = (values) => {
  let tempObj = {};
  let deleteEmptyArr = [];
  Object.entries(values).forEach((entryArr) => {
    return (tempObj[entryArr[0]] = JSON.stringify(entryArr[1]));
  });
  for (let key in tempObj) {
    if (tempObj[key] === "[]" || tempObj[key] === "{}" || tempObj[key] === "") {
      deleteEmptyArr.push(key);
    }
  }

  deleteEmptyArr.forEach((emptyEntry) => delete values[emptyEntry]);
  values.names?.length > 0
    ? null
    : (values.names = [
        { reference: "https://www.placeholder.org/", name: "N/A" },
      ]);
  return values;
};

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

const initialYupShapeGenerator = (isUniqueList) => {
  return {
    // NORAD ID and _id are always a part of the yup shape
    _id: Yup.string().notOneOf(
      isUniqueList(null, "_id"),
      "Something went wrong while assigning _id"
    ),
    noradID: Yup.string()
      .required(`Required`)
      .matches(/^[0-9]+$/g, "Must be a positive number")
      .notOneOf(
        isUniqueList(null, "noradID"),
        (obj) =>
          `A satellite with noradID of ${obj.value} already exists in our records.`
      ),
  };
};

export const schemaGenerator = (schemas, values, isUniqueList) => {
  let yupShape = initialYupShapeGenerator(isUniqueList); // instantiation of base yupShape
  const cleanSchema = schemaCleaner(schemas, values); // generates a clean schema object for easier manipulation

  Yup.addMethod(Yup.mixed, "checkEachEntry", function (message) {
    let errObj = {}; // workaround object to push errors into Formik
    // test each entry in the array: Yup.object().shape({field.name: Yup.(field.type)[0].toUpperCase() + (field.type).substr(1).required(field.required).min(field.min).max(field.max).oneOf((field.allowedValues))})
    return this.test("checkEachEntry", message, function (value) {
      const { path, createError } = this; // path is the schema's name, and createError generates errors to be handled by Formik
      let entryCount = 0; // "entryCount" and "fieldCount" are used to provide the location of the error to the SatelliteModal for rendering underneath the correct entry in SatelliteSchemaEntry
      value?.forEach((entry) => {
        // "entry" is composed of multiple "fields", and is part of the submitted array, aka "value"
        let fieldObj = {};
        let fieldCount = 0;
        const schema = cleanSchema[path];
        for (let schemaField in schema) {
          // "schema" are the schemas seen on the SchemasTable, and "schemaField" are the fields to be filled-in in each schema
          const field = schema[schemaField];
          // the following must be modified whenever we decide to create:
          // a new "type" (e.g. number, string, date) or
          // a new "type constraint" (e.g. max number, min number, max string length)
          let tempFieldSchema =
            field.type !== "url" ? Yup[field.type]() : Yup["string"]();
          const baseFieldType = tempFieldSchema;
          // stores the yup fragments needed for each constraint
          const fieldSchemaMatrix = {
            required: field.required
              ? baseFieldType.required(
                  `${path}-${entryCount}-${fieldCount}_${
                    field.type === "url"
                      ? "URL"
                      : field.type[0].toUpperCase() +
                        field.type.substr(1) +
                        " Input"
                  } Required`
                )
              : false,
            url:
              field.type === "url"
                ? baseFieldType.url(
                    `${path}-${entryCount}-${fieldCount}_Must be a valid URL (e.g. https://en.wikipedia.org/wiki/Main_Page).`
                  )
                : false,
            allowedValues:
              field.allowedValues?.length > 0
                ? baseFieldType.oneOf(
                    [...field.allowedValues],
                    `${path}-${entryCount}-${fieldCount}_Must be one of the following: ${field.allowedValues.join(
                      ", "
                    )}`
                  )
                : false,
            isUnique: field.isUnique
              ? baseFieldType.notOneOf(
                  isUniqueList(path, schemaField),
                  `${path}-${entryCount}-${fieldCount}_A satellite with ${schemaField} of ${value[entryCount][schemaField]} already exists.`
                )
              : false,
            min:
              field.type === "number" && field.max
                ? baseFieldType.min(
                    field.min,
                    `${path}-${entryCount}-${fieldCount}_Must be no less than ${field.min}`
                  )
                : false,
            max:
              field.type === "number" && field.max
                ? baseFieldType.max(
                    field.max,
                    `${path}-${entryCount}-${fieldCount}_Must be no greater than ${field.max}`
                  )
                : false,
            stringMax:
              field.type === "string" && field.stringMax
                ? baseFieldType.max(
                    field.stringMax,
                    `${path}-${entryCount}-${fieldCount}_Must not exceed ${field.stringMax} characters.`
                  )
                : false,
          };
          // loop over the schema and concatenate all valid constraints to field's yup object
          for (let check in fieldSchemaMatrix) {
            if (fieldSchemaMatrix[check])
              tempFieldSchema = tempFieldSchema.concat(
                fieldSchemaMatrix[check]
              );
          }
          fieldObj[schemaField] = tempFieldSchema;
          fieldCount++;
        }
        let fieldValidator = Yup.object().shape(fieldObj);

        // Yup.addMethod's test must return a boolean, and/or generate errors as necessary, in order to complete the validation
        fieldValidator
          .validate(entry, { abortEarly: true })
          .then(() => {
            errObj = {}; // clear all errors on successful validation
          })
          .catch((err) => {
            errObj = {}; // clear old errors and repopulate error object upon failed validation
            err.path === undefined
              ? (err.message = "err is not defined")
              : null;
            return err.message !== "err is not defined"
              ? (errObj[err["path"]] = err.message)
              : null;
          });
        entryCount++;
      });

      // check error object to determine the success of the validation and the amount of errors that need to be generated for Formik to handle
      if (JSON.stringify(errObj) === "{}") {
        return true;
      } else {
        for (let errPath in errObj) {
          let errMessage = errObj[errPath];
          let cleanMessage = errMessage.substr(errMessage.indexOf("_") + 1);
          let cleanPath = errMessage.substr(0, errMessage.indexOf("_"));
          return createError({
            path: `${cleanPath}`,
            message: `${cleanMessage}`,
          });
        }
      }
    });
  });
  // building the final yup schema object, calling checkEachEntry for each entry in the satellite
  if (JSON.stringify(cleanSchema) !== "{}") {
    for (let schema in cleanSchema) {
      yupShape[schema] = Yup.array().checkEachEntry();
    }
  }

  return Yup.object().shape(yupShape);
};
