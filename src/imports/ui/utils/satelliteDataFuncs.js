import React from "react";
import VerifiedIcon from "@material-ui/icons/CheckBoxOutlined";
import ValidatedIcon from "@material-ui/icons/LibraryAddCheck";
import IndeterminateIcon from "@material-ui/icons/IndeterminateCheckBox";
import IndeterminateOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import NotReviewedIcon from "@material-ui/icons/Cancel";
import NotReviewedOutlinedIcon from "@material-ui/icons/CancelOutlined";

// Data display functions
export const getSatName = (satellite) => {
  return satellite && satellite.names && satellite.names.length > 0 ? satellite.names[0].name : "Name not found...";
};

export const getSatImage = (satellite) => {
  return satellite && satellite.images && satellite.images.length > 0 ? satellite.images[0].link || satellite.images[0].url : "/assets/sat-placeholder.jpg";
};

export const getSatImages = (satellite) => {
  return satellite && satellite.images && satellite.images.length > 0 ? satellite.images : "/assets/sat-placeholder.jpg";
};

export const getSatID = (satellite) => {
  return satellite && satellite.noradID ? satellite.noradID : "NORAD ID not found...";
};

export const getSatDesc = (satellite) => {
  return satellite && satellite.descriptionShort && satellite.descriptionShort.length > 0 ? satellite.descriptionShort[0].descriptionShort : "";
};

export const decideVerifiedValidatedAdornment = (
  // decides the rendering of the validated / verified items for each of the satellite's fields
  array,
  verified,
  style,
  tip,
  classes
) => {
  if (array) {
    let userChecking = array
      .filter((checker) => checker.method === "user" && (checker.verified || checker.validated))
      .map((checker) => {
        return {
          name: checker.name,
          date: checker.verifiedOn || checker.validatedOn
        };
      });
    let machineChecking = array
      .filter((checker) => checker.method === "machine" && (checker.verified || checker.validated))
      .map((checker) => {
        return {
          name: checker.name,
          date: checker.verifiedOn || checker.validatedOn
        };
      });

    let mostRecentUser = `${userChecking[userChecking.length - 1]?.name} on ${userChecking[userChecking.length - 1]?.date.toString().substr(0, 10)}`;
    let mostRecentMachine = `${machineChecking[machineChecking.length - 1]?.name} on ${machineChecking[machineChecking.length - 1]?.date.toString().substr(0, 10)}`;

    if (!style && !tip) {
      if (userChecking.length > 0 && machineChecking.length > 0) return verified ? <VerifiedIcon /> : <ValidatedIcon />;
      if ((userChecking.length > 0 && machineChecking.length === 0) || (userChecking.length === 0 && machineChecking.length > 0))
        return verified ? <IndeterminateOutlinedIcon /> : <IndeterminateIcon />;
      if (userChecking.length === 0 && machineChecking.length === 0) return verified ? <NotReviewedOutlinedIcon /> : <NotReviewedIcon />;
    } else if (!tip) {
      if (userChecking.length > 0 && machineChecking.length > 0) return classes.validatedAdornment;
      if ((userChecking.length > 0 && machineChecking.length === 0) || (userChecking.length === 0 && machineChecking.length > 0)) return classes.partiallyValidatedAdornment;
      if (userChecking.length === 0 && machineChecking.length === 0) return classes.notValidatedAdornment;
    } else {
      if (userChecking.length > 0 && machineChecking.length > 0)
        return verified
          ? `Verified by user: ${mostRecentUser} and machine: ${mostRecentMachine}`
          : `Validated across multiple sources by user: ${mostRecentUser} and machine: ${mostRecentMachine}`;
      if (userChecking.length > 0 && machineChecking.length === 0)
        return verified ? `Verified by user: ${mostRecentUser}` : `Validated across multiple sources by user: ${mostRecentUser}`;
      if (userChecking.length === 0 && machineChecking.length > 0)
        return verified ? `Verified by machine: ${mostRecentMachine}` : `Validated across multiple sources by machine: ${mostRecentMachine}`;
      if (userChecking.length === 0 && machineChecking.length === 0) return verified ? "Not verified by user nor machine" : "Not validated by user nor machine";
    }
  }
};

// Data entry functions
export const emptyDataRemover = (values) => {
  // removes schemas that are added to a satellite but contain no information
  let tempObj = {};
  let deleteEmptyArr = [];
  Object.entries(values).forEach((entryArr) => {
    return (tempObj[entryArr[0]] = JSON.stringify(entryArr[1]));
  });
  for (let key in tempObj) {
    if (tempObj[key] === "[]" || tempObj[key] === "{}" || tempObj[key] === "") {
      deleteEmptyArr.push(key);
    }
  }

  deleteEmptyArr.forEach((emptyEntry) => delete values[emptyEntry]);
  if (!values.names?.length > 0)
    // ensure that the names schema field is never empty
    values.names = [
      {
        reference: "https://www.placeholder.org/",
        name: "N/A",
        verified: [
          {
            method: "",
            name: "",
            verified: false,
            verifiedOn: ""
          }
        ],
        validated: [
          {
            method: "",
            name: "",
            validated: false,
            validatedOn: ""
          }
        ]
      }
    ];
  return values;
};
