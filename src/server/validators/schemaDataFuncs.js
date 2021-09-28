/** 
 * PLEASE ENSURE THAT ANY CHANGES MADE HERE ARE REFLECTED IN SERVER-SIDE VALIDATIONS
**/

import * as Yup from "yup";

const uniqueNames = (initValues, schemas) => {
  return schemas.map((schema) => {
    if (initValues.name !== schema.name) {
      return schema.name;
    }
  });
};

export const schemaValidatorShaper = (initValues, schemas) => {
  return Yup.object().shape({
    _id: Yup.string(),
    name: Yup.string()
      .notOneOf(
        uniqueNames(initValues, schemas),
        (obj) => `The schema name, ${obj.value}, already exists `
      )
      .matches(
        /^[a-zA-Z0-9]*$/g,
        "Schema name must be spaceless, camelCase, and only contain letters and numbers"
      )
      .required("Required"),
    description: Yup.string().required("Required"),
    fields: Yup.array().of(
      Yup.object()
        .shape({
          name: Yup.string().required("Required"),
          type: Yup.mixed()
            .oneOf(
              ["string", "number", "date", "url", "changelog"],
              "Invalid input provided"
            )
            .required("Required"),
          allowedValues: Yup.array().ensure(),
          min: Yup.number().nullable().notRequired(),
          max: Yup.number()
            .nullable()
            .when(["min"], (min, schema) => {
              return schema.min(min);
            }),
          required: Yup.boolean(),
          isUnique: Yup.boolean(),
        })
        .notRequired()
    ),
  });
};
