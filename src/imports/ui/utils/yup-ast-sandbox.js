import * as Yup from "yup";
import { transformAll } from "@demvsystems/yup-ast";

const shapeGenerator = (schemas, values, isUniqueList) => {
  let yupShape = initialYupShapeGenerator(isUniqueList); // instantiation of base yupShape
  const cleanSchema = schemaCleaner(schemas, values); // generates a clean schema object for easier manipulation

  for (let schema in cleanSchema) {
    let entries = cleanSchema[schema];
    let shapeObj = {}; // stores the object of checks for the current entry
    for (let entry in entries) {
      let field = entries[entry]; // an input inside of each entry
      let fieldArr = []; //stores the

      // filters any non-standard Yup types and replaces them with custom yup syntax trees
      // url filter
      field.type === "url"
        ? fieldArr.push(
            ["yup.string", "URL required"],
            ["yup.url", "Invalid URL"]
          )
        : fieldArr.push([
            `yup.${field.type}`,
            `${field.type[0].toUpperCase() + field.type.substr(1)} Required`,
          ]);
      // string trimming filter
      if (field.type === "string") fieldArr.push(["yup.trim"]);
      //changelog filter
      // COMING SOON

      // required checking
      if (field.required) fieldArr.push(["yup.required", "Required"]);

      // allowedValues checking
      if (field.allowedValues.length !== 0)
        fieldArr.push([
          "yup.oneOf",
          field.allowedValues,
          `Must be one of the following: ${field.allowedValues.join(", ")}`,
        ]);

      // number min and max checking
      // both min and max
      if (field.min && field.max)
        fieldArr.push(
          [
            "yup.min",
            parseInt(field.min),
            `Values must be in the range of ${field.min} - ${field.max}`,
          ],
          [
            "yup.max",
            parseInt(field.max),
            `Values must be in the range of ${field.min} - ${field.max}`,
          ]
        );
      // only max
      if (!field.min && field.max)
        fieldArr.push([
          "yup.max",
          parseInt(field.max),
          `Values must be less than or equal to ${field.max}`,
        ]);
      //only min
      if (!field.max && field.min)
        fieldArr.push([
          "yup.min",
          parseInt(field.min),
          `Values must be less than or equal to ${field.min}`,
        ]);

      // stringMax checking
      if (field.stringMax)
        fieldArr.push([
          "yup.max",
          field.stringMax,
          `String must be no longer than ${field.stringMax} characters`,
        ]);

      // isUnique checking
      if (field.isUnique) {
        fieldArr.push([
          "yup.notOneOf",
          isUniqueList(schema, entry),
          `The provided ${entry} already exists in our records`,
        ]);
      }
      // insert entry schema into yup shape
      shapeObj[entry] = fieldArr;
    }
    yupShape[schema] = transformAll([
      ["yup.array"],
      ["yup.required"],
      ["yup.of", [["yup.object"], ["yup.shape", shapeObj]]],
    ]);
  }

  return { yupShape, cleanSchema };
};