export const userHasVerifiedData = (values, name) => {
  console.log("User verified data", name);
  // values.adminCheck = true;
  for (let key in values) {
    if (
      typeof values[key] === "object" &&
      key !== "modifiedOn" &&
      key !== "createdOn"
    ) {
      values[key].forEach((entry, entryIndex) =>
        entry.verified.forEach((verification, verificationIndex) => {
          if (verification.method === "user")
            values[key][entryIndex].verified[verificationIndex] = {
              method: "user",
              name: name,
              verified: "true",
              verifiedOn: new Date(),
            };
        })
      );
    }
  }
  return values;
};

export const machineHasVerifiedData = (values, name) => {
  console.log("Machine verified data", name);
  return values;
};
