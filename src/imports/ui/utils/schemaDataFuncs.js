import * as Yup from "yup";

export const schemaValidatorShaper = (schemas) => {
  return Yup.object().shape({
    name: Yup.string()
      .notOneOf(schemas, "Schema name already exists")
      .required("Required"),
    description: Yup.string().required("Required"),
    fields: Yup.array().of(
      Yup.object()
        .shape({
          name: Yup.string().required("Required"),
          type: Yup.mixed()
            .oneOf(
              ["string", "number", "date", "url"],
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
        })
        .notRequired()
    ),
  });
};