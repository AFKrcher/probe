import * as Yup from "yup";

export const schemaValidatorShaper = (schemas) => {
  return Yup.object().shape({
    name: Yup.string()
      .notOneOf(schemas, "Schema name already exists")
      .matches(/^[a-zA-Z0-9]*$/g, "Schema name be spaceless, camelCase, and only contain letters and numbers")
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