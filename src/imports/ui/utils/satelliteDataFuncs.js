import React from "react";
import VerifiedIcon from "@material-ui/icons/CheckBoxOutlined";
import ValidatedIcon from "@material-ui/icons/LibraryAddCheck";
import IndeterminateIcon from "@material-ui/icons/IndeterminateCheckBox";
import IndeterminateOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import NotReviewedIcon from "@material-ui/icons/Cancel";
import NotReviewedOutlinedIcon from "@material-ui/icons/CancelOutlined";
import LinkIcon from "@material-ui/icons/Link";
import { TextField, Tooltip, InputAdornment } from "@material-ui/core";
import { _ } from "meteor/underscore";

// Data display functions
export const getSatName = (satellite) => {
  return satellite && satellite.names && satellite.names.length > 0 ? satellite.names[0].name : "New Satellite";
};

export const getSatImage = (satellite) => {
  return satellite && satellite.images && satellite.images.length > 0
    ? satellite.images[0].link || satellite.images[0].url
    : "/assets/sat-placeholder.jpg";
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

const decideVerifiedValidatedAdornment = (
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
    let mostRecentMachine = `${machineChecking[machineChecking.length - 1]?.name} on ${machineChecking[machineChecking.length - 1]?.date
      .toString()
      .substr(0, 10)}`;

    if (!style && !tip) {
      if (userChecking.length > 0 && machineChecking.length > 0) return verified ? <VerifiedIcon /> : <ValidatedIcon />;
      if ((userChecking.length > 0 && machineChecking.length === 0) || (userChecking.length === 0 && machineChecking.length > 0))
        return verified ? <IndeterminateOutlinedIcon /> : <IndeterminateIcon />;
      if (userChecking.length === 0 && machineChecking.length === 0) return verified ? <NotReviewedOutlinedIcon /> : <NotReviewedIcon />;
    } else if (!tip) {
      if (userChecking.length > 0 && machineChecking.length > 0) return classes.validatedAdornment;
      if ((userChecking.length > 0 && machineChecking.length === 0) || (userChecking.length === 0 && machineChecking.length > 0))
        return classes.partiallyValidatedAdornment;
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
      if (userChecking.length === 0 && machineChecking.length === 0)
        return verified ? "Not verified by user nor machine" : "Not validated by user nor machine";
    }
  }
};

// Data entry functions
export const emptyDataRemover = (values) => {
  // removes schemas that are added to a satellite but contain no information
  for (let key in values) {
    if (_.isEmpty(values[key])) {
      delete values[key];
    }
  }
  return values;
};

export const linkAdornment = (width, classes, handleClick, adornmentBreak, props, field, type, validated, verified) => {
  return (
    <TextField
      InputProps={
        type === "url" // adornment for URLs
          ? {
              endAdornment: (
                <Tooltip title="Open URL in a new tab" arrow placement="top-end">
                  <InputAdornment
                    className={classes.urlAdornment}
                    position="end"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(field);
                    }}>
                    <LinkIcon />
                  </InputAdornment>
                </Tooltip>
              )
            }
          : field && field.length > 0 // only have verification adornment if there is data
          ? {
              endAdornment: (
                <span
                  style={
                    field.length > 300 && width < adornmentBreak
                      ? {
                          display: "flex",
                          flexDirection: "column"
                        }
                      : {
                          display: "flex",
                          flexDirection: "row"
                        }
                  }>
                  <Tooltip
                    title={decideVerifiedValidatedAdornment(
                      // decideVerifiedValidatedAdornment takes the following arguments
                      verified, // 1. array of verification or validation objects
                      true, // 2. whether it is a verification (true) or validation (false)
                      false, // 3. whether it is a styling decision
                      true, // 4. whether it is an icon decision
                      classes // 5. the useStyles classes
                    )}
                    placement="top"
                    arrow>
                    <InputAdornment className={decideVerifiedValidatedAdornment(verified, true, true, false, classes)} position="end">
                      {decideVerifiedValidatedAdornment(verified, true, false, false, classes)}
                    </InputAdornment>
                  </Tooltip>
                  {field.length > 300 && width < adornmentBreak ? (
                    <div
                      style={{
                        marginTop: 40
                      }}
                    />
                  ) : null}
                  <Tooltip
                    title={decideVerifiedValidatedAdornment(validated, false, false, true, classes)}
                    placement={field.length > 300 && width < adornmentBreak ? "bottom" : "top"}
                    arrow>
                    <InputAdornment className={decideVerifiedValidatedAdornment(validated, false, true, false, classes)} position="end">
                      {decideVerifiedValidatedAdornment(validated, false, false, false, classes)}
                    </InputAdornment>
                  </Tooltip>
                </span>
              )
            }
          : null
      }
      {...props}
    />
  );
};
