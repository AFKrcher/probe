import * as Yup from "yup";
import { SchemaCollection } from "../../api/schemas";

// Does not work in SchemaModal.jsx
// const schemas = SchemaCollection.find()
//   .fetch()
//   .map((schema) => schema.name);
// export const schemaValidator = Yup.object().shape({
//   name: Yup.string()
//     .notOneOf(schemas, "Schema name already exists")
//     .required("Required"),
//   description: Yup.string().required("Required"),
//   fields: Yup.array().of(
//     Yup.object()
//       .shape({
//         name: Yup.string().required("Required"),
//         type: Yup.mixed()
//           .oneOf(["string", "number", "date"])
//           .required("Required"),
//         allowedValues: Yup.array().ensure(),
//         min: Yup.number().nullable().notRequired(),
//         max: Yup.number()
//           .nullable()
//           .when(["min"], (min, schema) => {
//             return schema.min(min);
//           }),
//         required: Yup.boolean(),
//       })
//       .notRequired()
//   ),
// });

export const satelliteValidator = Yup.object().shape({
  noradID: Yup.string()
    .required("Required")
    .length(5, "Must be a positive, 5-digit number")
    .matches(/^[0-9]+$/g, "Must be a positive, 5-digit number"),
});
