import * as Yup from "yup";

export const schemaValidator = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  fields: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Required"),
      type: Yup.mixed()
        .oneOf(["string", "number", "date"])
        .required("Required"),
      allowedValues: Yup.array().ensure(),
      min: Yup.number(),
      max: Yup.number().when(["min"], (min, schema) => {
        return schema.min(min);
      }),
      required: Yup.boolean(),
    })
  ),
});

export const satelliteValidator = Yup.object().shape({});
