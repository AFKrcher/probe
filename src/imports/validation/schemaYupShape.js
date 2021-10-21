/**
 * PLEASE ENSURE THAT ANY CHANGES MADE HERE ARE REFLECTED IN SERVER-SIDE VALIDATIONS
 **/

import * as Yup from "yup";
import { SchemaCollection } from "/imports/api/schemas";

export const schemaValidatorShaper = (initialName) => {
  return Yup.object().shape({
    _id: Yup.string(),
    name: Yup.string()
      .test(
        "uniqueName",
        (obj) =>
          obj.value
            ? `The schema name, "${obj.value}", already exists`
            : "Required",
        (value) =>
          SchemaCollection.findOne({ name: value })?.name !== initialName
            ? SchemaCollection.find({ name: value }).count() === 0
            : true
      )
      .matches(
        /^[a-zA-Z0-9]*$/g,
        "Schema name must only contain letters and numbers"
      )
      .test("camelCase", "Schema name must be camelCase", (value) => {
        return value
          ? (value !== value.toLowerCase() &&
              value !== value.toUpperCase() &&
              value.substr(0, 1) !== value.substr(0, 1).toUpperCase()) ||
              (/[a-z]/.test(value) &&
                value.substr(0, 1) !== value.substr(0, 1).toUpperCase())
          : /[a-z]/.test(value);
      })
      .required("Required")
      .max(50, "Must not exceed 50 characters"),
    description: Yup.string()
      .required("Required")
      .max(500, "Must not exceed 500 characters"),
    fields: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string()
            .required("Required")
            .max(50, "Must not exceed 50 characters")
            .matches(
              /^[a-zA-Z0-9]*$/g,
              "Name must only contain letters and numbers"
            )
            .test("camelCase", "Name must be camelCase", (value) => {
              return value
                ? (value !== value.toLowerCase() &&
                    value !== value.toUpperCase() &&
                    value.substr(0, 1) !== value.substr(0, 1).toUpperCase()) ||
                    (/[a-z]/.test(value) &&
                      value.substr(0, 1) !== value.substr(0, 1).toUpperCase())
                : /[a-z]/.test(value);
            }),
          type: Yup.mixed()
            .oneOf(
              [
                "string",
                "number",
                "date",
                "url",
                "changelog",
                "verified",
                "validated",
              ],
              "Invalid input provided"
            )
            .required("Required"),
          min: Yup.number().nullable(),
          max: Yup.number()
            .nullable()
            .when(["min"], (min, schema) => {
              return schema.min(min);
            }),
          required: Yup.boolean().nullable(),
          isUnique: Yup.boolean().nullable(),
          stringMax: Yup.number()
            .max(20000, "Must not exceed 20,000 characters")
            .nullable(),
          allowedValues: Yup.array()
            .ensure()
            .max(100, "Must not exceed 100 elements")
            .when(["stringMax"], (stringMax, schema) => {
              return schema.test(
                "maximum-length",
                `Options must not exceed ${stringMax} characters`,
                (value) => {
                  const testArr = value.filter(
                    (option) => option.length > stringMax
                  );
                  return testArr.length === 0 || !stringMax ? true : false;
                }
              );
            }),
        })
      )
      .min(4),
  });
};
