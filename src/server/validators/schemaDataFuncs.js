/** 
 * PLEASE ENSURE THAT ANY CHANGES MADE HERE ARE REFLECTED IN CLIENT-SIDE UTILS
**/

import * as Yup from "yup";

const isUniqueList = (initValues, schemas) => {
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
        isUniqueList(initValues, schemas),
        (obj) => `The schema name, ${obj.value}, already exists `
      )
      .matches(
        /^[a-zA-Z0-9]*$/g,
        "Schema name must be spaceless, camelCase, and only contain letters and numbers"
      )
      .required("Required")
      .max(50, "Must not exceed 50 characters"),
    description: Yup.string()
      .required("Required")
      .max(500, "Must not exceed 500 characters"),
    fields: Yup.array().of(
      Yup.object()
        .shape({
          name: Yup.string()
            .required("Required")
            .max(50, "Must not exceed 50 characters"),
          type: Yup.mixed()
            .oneOf(
              ["string", "number", "date", "url", "changelog"],
              "Invalid input provided"
            )
            .required("Required"),
          allowedValues: Yup.array()
            .ensure()
            .max(100, "Must not exceed 100 elements"),
          min: Yup.number().nullable().notRequired(),
          max: Yup.number()
            .nullable()
            .when(["min"], (min, schema) => {
              return schema.min(min);
            }),
          required: Yup.boolean(),
          isUnique: Yup.boolean(),
          stringMax: Yup.number().max(
            20000,
            "Must not exceed 20,000 characters"
          ),
        })
        .notRequired()
    ),
    adminCheck: Yup.boolean().required(),
    modifiedOn: Yup.date().required(),
    modifiedBy: Yup.string().required(),
    createdOn: Yup.date().required(),
    createdBy: Yup.string().required(),
  });
};
