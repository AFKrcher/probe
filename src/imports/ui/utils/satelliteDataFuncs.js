import * as Yup from "yup";

export const getSatName = (satellite) => {
  return satellite && satellite.names && satellite.names.length > 0
    ? satellite.names[0].name
    : "Name not found...";
};

export const getSatImage = (satellite) => {
  return satellite && satellite.images && satellite.images.length > 0
    ? satellite.images[0].link
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

export const satelliteValidatorShaper = (schemas, noradIDList) => {
  // dynamically generate an object that stores all possible schemas and their constraints
  // provides easier access and manipulation of schema data

  let schemaObj = {}; // object: {schema.name: {field.name: {field.type: string/number/date, field.allowedValues: [], required: field.required, min: field.min, max: field.max}}}
  schemas?.forEach((schema) => {
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

  Yup.addMethod(Yup.array, "checkEachEntry", function (message) {
    let errObj = {}; // workaround object to generate populate errors object in Formik
    // test each entry in the array: Yup.object().shape({field.name: Yup.(fieldRequirements.type)[0].toUpperCase() + (fieldRequirements.type).substr(1).required(field.required).min(field.min).max(field.max).oneOf((field.allowedValues))})
    return this.test("checkEachEntry", message, function (value) {
      const { path, createError } = this;
      let entryCount = 0; // "entryCount" and "fieldCount" are used to provide the location of the error to the SatelliteModal for rendering underneath the correct entry in SatelliteSchemaEntry
      value?.forEach((entry) => {
        // "entry" is composed of multiple "fields", and is part of the submitted array, aka "value"
        entryCount++;
        let fieldCount = 0;
        let fieldObj = {};
        let schema = schemaObj[path];
        for (let schemaField in schema) {
          fieldCount++;
          // "schema" are the schemas seen on the SchemasTable, and "schemaField" are the fields to be filled-in in each schema
          let fieldRequirements = schema[schemaField];
          // the following switch statements must be modified whenever we decide to create:
          // a new "type" (e.g. number, string, date) or
          // "type constraint" (e.g. max number, min number, max string length)
          // this isn't the most elegant solution, but this was the only way we know how to implement dynamic yupJS validation shapes
          // yupJS does not like reading string literals in its shape (e.g. `Yup.${fieldRequirements.type}.required()` does not work)
          switch (fieldRequirements.type) {
            case "string":
              switch (fieldRequirements.required) {
                case true:
                  switch (fieldRequirements.allowedValues.length > 0) {
                    case true:
                      switch (typeof fieldRequirements.stringMax === "string") {
                        case true:
                          fieldObj[schemaField] = Yup.string()
                            .required(
                              `${path}.${entryCount}.${fieldCount}*${
                                fieldRequirements.type[0].toUpperCase() +
                                fieldRequirements.type.substr(1)
                              } Required`
                            )
                            .max(
                              parseInt(fieldRequirements.stringMax),
                              `${path}.${entryCount}.${fieldCount}*Must not exceed ${fieldRequirements.stringMax} characters.`
                            )
                            .oneOf(
                              fieldRequirements.allowedValues,
                              `${path}.${entryCount}.${fieldCount}*Must be one of the following: ${fieldRequirements.allowedValues.join(
                                ", "
                              )}`
                            );
                          break;
                        default:
                          fieldObj[schemaField] = Yup.string()
                            .required(
                              `${path}.${entryCount}.${fieldCount}*${
                                fieldRequirements.type[0].toUpperCase() +
                                fieldRequirements.type.substr(1)
                              } Required`
                            )
                            .oneOf(
                              fieldRequirements.allowedValues,
                              `${path}.${entryCount}.${fieldCount}*Must be one of the following: ${fieldRequirements.allowedValues.join(
                                ", "
                              )}`
                            );
                      }
                      break;
                    default:
                      switch (schemaField === "reference") {
                        case true:
                          // yup's built-in URL checker is too strict, and will exclude valid urls like https://en.wikipedia.org/wiki/Main_Page
                          // workaround was to generate a more general regex matcher for url
                          // please note that there is no universal url regex that can check for all possible urls
                          fieldObj[schemaField] = Yup.string()
                            .matches(
                              /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g,
                              `${path}.${entryCount}.${fieldCount}*Must be a valid URL (e.g. https://en.wikipedia.org/wiki/Main_Page).`
                            )
                            .required();
                          break;
                        default:
                          fieldObj[schemaField] = Yup.string().required(
                            `${path}.${entryCount}.${fieldCount}*${
                              fieldRequirements.type[0].toUpperCase() +
                              fieldRequirements.type.substr(1)
                            } Required`
                          );
                      }
                  }
                  break;
                default:
                  switch (fieldRequirements.allowedValues.length === 0) {
                    case true:
                      switch (typeof fieldRequirements.stringMax === "string") {
                        case true:
                          fieldObj[schemaField] = Yup.string().max(
                            parseInt(fieldRequirements.stringMax),
                            `${path}.${entryCount}.${fieldCount}*Must not exceed ${fieldRequirements.stringMax} characters.`
                          );
                          break;
                        default:
                          fieldObj[schemaField] = Yup.string();
                      }
                      break;
                    default:
                      fieldObj[schemaField] = Yup.string().oneOf(
                        fieldRequirements.allowedValues,
                        `${path}.${entryCount}.${fieldCount}*Must be one of the following: ${fieldRequirements.allowedValues.join(
                          ", "
                        )}`
                      );
                  }
              }
              break;
            case "number":
              switch (fieldRequirements.required) {
                case true:
                  switch (
                    fieldRequirements.min && fieldRequirements.max
                      ? true
                      : false
                  ) {
                    case true:
                      fieldObj[schemaField] = Yup.number()
                        .required(
                          `${path}.${entryCount}.${fieldCount}*${
                            fieldRequirements.type[0].toUpperCase() +
                            fieldRequirements.type.substr(1)
                          } Required`
                        )
                        .min(
                          parseInt(fieldRequirements.min),
                          `${path}.${entryCount}.${fieldCount}*Must be between the values of ${fieldRequirements.min} and ${fieldRequirements.max}`
                        )
                        .max(
                          parseInt(fieldRequirements.max),
                          `${path}.${entryCount}.${fieldCount}*Must be between the values of ${fieldRequirements.min} and ${fieldRequirements.max}`
                        );
                      break;
                    default:
                      switch (typeof fieldRequirements.min === "string") {
                        case true:
                          fieldObj[schemaField] = Yup.number()
                            .required(
                              `${path}.${entryCount}.${fieldCount}*${
                                fieldRequirements.type[0].toUpperCase() +
                                fieldRequirements.type.substr(1)
                              } Required`
                            )
                            .min(
                              parseInt(fieldRequirements.min),
                              `${path}.${entryCount}.${fieldCount}*Must be equal or greater than ${fieldRequirements.min}`
                            );
                          break;
                        default:
                          switch (typeof fieldRequirements.max === "string") {
                            case true:
                              fieldObj[schemaField] = Yup.number()
                                .required(
                                  `${path}.${entryCount}.${fieldCount}*${
                                    fieldRequirements.type[0].toUpperCase() +
                                    fieldRequirements.type.substr(1)
                                  } Required`
                                )
                                .max(
                                  parseInt(fieldRequirements.max),
                                  `${path}.${entryCount}.${fieldCount}*Must be equal to or less than ${fieldRequirements.max}`
                                );
                              break;
                            default:
                              fieldObj[schemaField] = Yup.number().required(
                                `${path}.${entryCount}.${fieldCount}*${
                                  fieldRequirements.type[0].toUpperCase() +
                                  fieldRequirements.type.substr(1)
                                } Required`
                              );
                          }
                      }
                  }
                  break;
                default:
                  switch (
                    fieldRequirements.min && fieldRequirements.max
                      ? true
                      : false
                  ) {
                    case true:
                      fieldObj[schemaField] = Yup.number()
                        .min(
                          parseInt(fieldRequirements.min),
                          `${path}.${entryCount}.${fieldCount}*Must be between the values of ${fieldRequirements.min} and ${fieldRequirements.max}`
                        )
                        .max(
                          parseInt(fieldRequirements.max),
                          `${path}.${entryCount}.${fieldCount}*Must be between the values of ${fieldRequirements.min} and ${fieldRequirements.max}`
                        );
                      break;
                    default:
                      switch (typeof fieldRequirements.min === "string") {
                        case true:
                          fieldObj[schemaField] = Yup.number().min(
                            parseInt(fieldRequirements.min),
                            `${path}.${entryCount}.${fieldCount}*Must be equal to or greater than ${fieldRequirements.min}`
                          );
                          break;
                        default:
                          switch (typeof fieldRequirements.max === "string") {
                            case true:
                              fieldObj[schemaField] = Yup.number().max(
                                parseInt(fieldRequirements.max),
                                `${path}.${entryCount}.${fieldCount}*Must be equal to or less than ${fieldRequirements.max}`
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
              switch (fieldRequirements.required) {
                case true:
                  fieldObj[schemaField] = Yup.date().required(
                    `${path}.${entryCount}.${fieldCount}*${
                      fieldRequirements.type[0].toUpperCase() +
                      fieldRequirements.type.substr(1)
                    } Required`
                  );
                  break;
                default:
                  fieldObj[schemaField] = Yup.date();
              }
              break;
            case "url":
              switch (fieldRequirements.required) {
                case true:
                  fieldObj[schemaField] = Yup.string()
                    .matches(
                      /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g,
                      `${path}.${entryCount}.${fieldCount}*Must be a valid URL (e.g. https://en.wikipedia.org/wiki/Main_Page).`
                    )
                    .required(`${path}.${entryCount}.${fieldCount}*${
                      fieldRequirements.type[0].toUpperCase() +
                      fieldRequirements.type.substr(1)
                    } Required`);
                  break;
                default:
                  fieldObj[schemaField] = Yup.string().matches(
                    /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g,
                    `${path}.${entryCount}.${fieldCount}*Must be a valid URL (e.g. https://en.wikipedia.org/wiki/Main_Page).`
                  );
                  break;
              }
            default:
              break;
          }
        }

        let fieldValidator = Yup.object().shape(fieldObj);
        // Yup.addMethod's test must return a boolean, and generate errors as necessary, in order to complete the validation step

        fieldValidator
          .validate(entry, { abortEarly: true })
          .then((result) => {
            errObj = {};
          })
          .catch((err) => {
            err.path === undefined
              ? (err.message = "err is not defined")
              : null;
            return err.message !== "err is not defined"
              ? (errObj[err["path"]] = err.message)
              : null;
          });
      });
      if (JSON.stringify(errObj) === "{}") {
        return true;
      } else {
        for (let errPath in errObj) {
          let errMessage = errObj[errPath];
          let entryNum = errMessage.split(".")[1]
          let cleanedMessage = errMessage.split("*")[1]
          return createError({ path: `${errPath}**${entryNum}`, message: cleanedMessage });
        }
      }
    });
  });

  let yupShape = {
    // NORAD ID is always a part of the yup shape
    noradID: Yup.string()
      .required(`Required`)
      .matches(/^[0-9]+$/g, "Must be a positive number")
      .notOneOf(
        noradIDList(),
        "A satellite with that NORAD ID already exists in our records."
      ),
  };

  // if the schemaObj is complete, begin building the final yup schema object
  if (JSON.stringify(schemaObj) !== "{}") {
    for (let schema in schemaObj) {
      yupShape[schema] = Yup.array().checkEachEntry();
    }
  }

  return Yup.object().shape(yupShape);
};
