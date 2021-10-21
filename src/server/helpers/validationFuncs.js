export const userHasValidatedData = (values, name) => {
  values.adminCheck = true;
  for (let key in values) {
    if (
      typeof values[key] === "object" &&
      key !== "modifiedOn" &&
      key !== "createdOn"
    ) {
      values[key].forEach((entry, entryIndex) =>
        entry.validated.forEach((validation, validationIndex) => {
          if (validation.method === "user") {
            values[key][entryIndex].validated[validationIndex] = {
              method: "user",
              name: name,
              validated: "true",
              validatedOn: new Date(),
            };
          } else if (!validation.method) {
            values[key][entryIndex].validated[validationIndex] = {
              method: "user",
              name: name,
              validated: "true",
              validatedOn: new Date(),
            };
          }
        })
      );
    }
  }
  return values;
};

export const machineHasValidatedData = (values, name) => {
  values.machineCheck = true;
  for (let key in values) {
    if (
      typeof values[key] === "object" &&
      key !== "modifiedOn" &&
      key !== "createdOn"
    ) {
      values[key].forEach((entry, entryIndex) =>
        entry.validated.forEach((validation, validationIndex) => {
          if (validation.method === "machine") {
            values[key][entryIndex].validated[validationIndex] = {
              method: "machine",
              name: name,
              validated: "true",
              validatedOn: new Date(),
            };
          } else if (!validation.method) {
            values[key][entryIndex].validated[validationIndex] = {
              method: "machine",
              name: name,
              validated: "true",
              validatedOn: new Date(),
            };
          }
        })
      );
    }
  }
  return values;
};
