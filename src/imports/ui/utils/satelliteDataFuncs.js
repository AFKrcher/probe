import * as Yup from "yup";
import { transformAll } from "@demvsystems/yup-ast";

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
      isUniqueList(null, "nullid"),
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
    let errObj = {}; // workaround object to generate populate errors object in Formik
    // test each entry in the array: Yup.object().shape({field.name: Yup.(field.type)[0].toUpperCase() + (field.type).substr(1).required(field.required).min(field.min).max(field.max).oneOf((field.allowedValues))})
    return this.test("checkEachEntry", message, function (value) {
      const { path, createError } = this;

      let entryCount = 0; // "entryCount" and "fieldCount" are used to provide the location of the error to the SatelliteModal for rendering underneath the correct entry in SatelliteSchemaEntry

      value?.forEach((entry) => {
        // "entry" is composed of multiple "fields", and is part of the submitted array, aka "value"
        let fieldObj = {};
        let fieldCount = 0;
        let schema = cleanSchema[path];
        for (let schemaField in schema) {
          // "schema" are the schemas seen on the SchemasTable, and "schemaField" are the fields to be filled-in in each schema
          let field = schema[schemaField];
          // the following switch statements must be modified whenever we decide to create:
          // a new "type" (e.g. number, string, date) or
          // "type constraint" (e.g. max number, min number, max string length)
          // this isn't the most elegant solution, but this was the only way we know how to implement dynamic yupJS validation shapes
          // yupJS does not like reading string literals in its shape (e.g. `Yup-${field.type}.required()` does not work)
          switch (field.type) {
            case "string":
              switch (field.required) {
                case true:
                  switch (field.allowedValues.length > 0) {
                    case true:
                      switch (typeof field.stringMax === "string") {
                        case true:
                          fieldObj[schemaField] = Yup.string()
                            .required(
                              `${path}-${entryCount}-${fieldCount}_${
                                field.type[0].toUpperCase() +
                                field.type.substr(1)
                              } Required`
                            )
                            .max(
                              parseInt(field.stringMax),
                              `${path}-${entryCount}-${fieldCount}_Must not exceed ${field.stringMax} characters.`
                            )
                            .oneOf(
                              field.allowedValues,
                              `${path}-${entryCount}-${fieldCount}_Must be one of the following: ${field.allowedValues.join(
                                ", "
                              )}`
                            );
                          break;
                        default:
                          fieldObj[schemaField] = Yup.string()
                            .required(
                              `${path}-${entryCount}-${fieldCount}_${
                                field.type[0].toUpperCase() +
                                field.type.substr(1)
                              } Required`
                            )
                            .oneOf(
                              field.allowedValues,
                              `${path}-${entryCount}-${fieldCount}_Must be one of the following: ${field.allowedValues.join(
                                ", "
                              )}`
                            );
                      }
                      break;
                    default:
                      switch (field.isUnique) {
                        case true:
                          fieldObj[schemaField] = Yup.string()
                            .required(
                              `${path}-${entryCount}-${fieldCount}_${
                                field.type[0].toUpperCase() +
                                field.type.substr(1)
                              } Required`
                            )
                            .notOneOf(
                              isUniqueList(path, schemaField),
                              `${path}-${entryCount}-${fieldCount}_A satellite with ${schemaField} of ${value[entryCount][schemaField]} already exists.`
                            );
                          break;
                        default:
                          fieldObj[schemaField] = Yup.string().required(
                            `${path}-${entryCount}-${fieldCount}_${
                              field.type[0].toUpperCase() + field.type.substr(1)
                            } Required`
                          );
                      }
                  }
                  break;
                default:
                  switch (field.allowedValues.length === 0) {
                    case true:
                      switch (typeof field.stringMax === "string") {
                        case true:
                          switch (field.isUnique) {
                            case true:
                              fieldObj[schemaField] = Yup.string()
                                .max(
                                  parseInt(field.stringMax),
                                  `${path}-${entryCount}-${fieldCount}_Must not exceed ${field.stringMax} characters.`
                                )
                                .notOneOf(
                                  isUniqueList(path, schemaField),
                                  `${path}-${entryCount}-${fieldCount}_A satellite with ${schemaField} of ${value[entryCount][schemaField]} already exists.`
                                );
                              break;
                            default:
                              fieldObj[schemaField] = Yup.string().max(
                                parseInt(field.stringMax),
                                `${path}-${entryCount}-${fieldCount}_Must not exceed ${field.stringMax} characters.`
                              );
                              break;
                          }
                          break;
                        default:
                          switch (field.isUnique) {
                            case true:
                              fieldObj[schemaField] = Yup.string().notOneOf(
                                isUniqueList(path, schemaField),
                                `${path}-${entryCount}-${fieldCount}_A satellite with ${schemaField} of ${value[entryCount][schemaField]} already exists.`
                              );
                              break;
                            default:
                              fieldObj[schemaField] = Yup.string();
                              break;
                          }
                      }
                      break;
                    default:
                      fieldObj[schemaField] = Yup.string().oneOf(
                        field.allowedValues,
                        `${path}-${entryCount}-${fieldCount}_Must be one of the following: ${field.allowedValues.join(
                          ", "
                        )}`
                      );
                  }
              }
              break;
            case "number":
              switch (field.required) {
                case true:
                  switch (field.min && field.max ? true : false) {
                    case true:
                      fieldObj[schemaField] = Yup.number()
                        .required(
                          `${path}-${entryCount}-${fieldCount}_${
                            field.type[0].toUpperCase() + field.type.substr(1)
                          } Required`
                        )
                        .min(
                          parseInt(field.min),
                          `${path}-${entryCount}-${fieldCount}_Must be between the values of ${field.min} and ${field.max}`
                        )
                        .max(
                          parseInt(field.max),
                          `${path}-${entryCount}-${fieldCount}_Must be between the values of ${field.min} and ${field.max}`
                        );
                      break;
                    default:
                      switch (typeof field.min === "string") {
                        case true:
                          fieldObj[schemaField] = Yup.number()
                            .required(
                              `${path}-${entryCount}-${fieldCount}_${
                                field.type[0].toUpperCase() +
                                field.type.substr(1)
                              } Required`
                            )
                            .min(
                              parseInt(field.min),
                              `${path}-${entryCount}-${fieldCount}_Must be equal or greater than ${field.min}`
                            );
                          break;
                        default:
                          switch (typeof field.max === "string") {
                            case true:
                              fieldObj[schemaField] = Yup.number()
                                .required(
                                  `${path}-${entryCount}-${fieldCount}_${
                                    field.type[0].toUpperCase() +
                                    field.type.substr(1)
                                  } Required`
                                )
                                .max(
                                  parseInt(field.max),
                                  `${path}-${entryCount}-${fieldCount}_Must be equal to or less than ${field.max}`
                                );
                              break;
                            default:
                              fieldObj[schemaField] = Yup.number().required(
                                `${path}-${entryCount}-${fieldCount}_${
                                  field.type[0].toUpperCase() +
                                  field.type.substr(1)
                                } Required`
                              );
                          }
                      }
                  }
                  break;
                default:
                  switch (field.min && field.max ? true : false) {
                    case true:
                      fieldObj[schemaField] = Yup.number()
                        .min(
                          parseInt(field.min),
                          `${path}-${entryCount}-${fieldCount}_Must be between the values of ${field.min} and ${field.max}`
                        )
                        .max(
                          parseInt(field.max),
                          `${path}-${entryCount}-${fieldCount}_Must be between the values of ${field.min} and ${field.max}`
                        );
                      break;
                    default:
                      switch (typeof field.min === "string") {
                        case true:
                          fieldObj[schemaField] = Yup.number().min(
                            parseInt(field.min),
                            `${path}-${entryCount}-${fieldCount}_Must be equal to or greater than ${field.min}`
                          );
                          break;
                        default:
                          switch (typeof field.max === "string") {
                            case true:
                              fieldObj[schemaField] = Yup.number().max(
                                parseInt(field.max),
                                `${path}-${entryCount}-${fieldCount}_Must be equal to or less than ${field.max}`
                              );
                              break;
                            default:
                              fieldObj[schemaField] = Yup.number();
                          }
                      }
                  }
              }
              break;
            case "date":
              switch (field.required) {
                case true:
                  fieldObj[schemaField] = Yup.date().required(
                    `${path}-${entryCount}-${fieldCount}_${
                      field.type[0].toUpperCase() + field.type.substr(1)
                    } Required`
                  );
                  break;
                default:
                  fieldObj[schemaField] = Yup.date();
              }
              break;
            case "url":
              switch (field.required) {
                case true:
                  fieldObj[schemaField] = Yup.string()
                    .matches(
                      /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g,
                      `${path}-${entryCount}-${fieldCount}_Must be a valid URL (e.g. https://en.wikipedia.org/wiki/Main_Page).`
                    )
                    .required(
                      `${path}-${entryCount}-${fieldCount}_${field.type.toUpperCase()} Required`
                    );
                  break;
                default:
                  fieldObj[schemaField] = Yup.string().matches(
                    /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g,
                    `${path}-${entryCount}-${fieldCount}_Must be a valid URL (e.g. https://en.wikipedia.org/wiki/Main_Page).`
                  );
                  break;
              }
            default:
              break;
          }
          fieldCount++;
        }
        let fieldValidator = Yup.object().shape(fieldObj);
        // Yup.addMethod's test must return a boolean, and generate errors as necessary, in order to complete the validation step
        fieldValidator
          .validate(entry, { abortEarly: true })
          .then(() => {
            errObj = {};
          })
          .catch((err) => {
            errObj = {};
            err.path === undefined
              ? (err.message = "err is not defined")
              : null;
            return err.message !== "err is not defined"
              ? (errObj[err["path"]] = err.message)
              : null;
          });
        entryCount++;
      });

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
  // if the cleanSchema is complete, begin building the final yup schema object
  if (JSON.stringify(cleanSchema) !== "{}") {
    for (let schema in cleanSchema) {
      yupShape[schema] = Yup.array().checkEachEntry();
    }
  }
  return Yup.object().shape(yupShape);
};
