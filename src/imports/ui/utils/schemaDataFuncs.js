import React from "react";
// @material-ui
import { MenuItem, FormHelperText } from "@material-ui/core";

export const dataTypeOptions = () => {
  const options = ["string", "number", "date", "url", "changelog", "verified", "validated"];
  const hidden = ["changelog", "verified", "validated"]; // options that are not production-ready or are hidden metadata

  return options.map((option, index) => {
    if (hidden.includes(option)) {
      return (
        <MenuItem value={option} key={index} style={{ display: "none" }}>
          {option}
        </MenuItem>
      );
    } else {
      return (
        <MenuItem value={option} key={index}>
          {option}
        </MenuItem>
      );
    }
  });
};

export const maxErrorMessage = (editing, errors, classes, index) => {
  let contents = null;
  if (editing && errors["fields"]) {
    if (editing && errors.fields[index]) {
      if (errors.fields[index].max) {
        let err = errors.fields[index].max;
        const toIndex = err.indexOf("to ");
        const to = err.substr(toIndex);
        const numberIndex = to.indexOf(" ");
        const number = to.substr(numberIndex);
        const message = `Maximum Value must be greater than the Minimum Value of ${number}`;
        contents = <FormHelperText className={classes.helpersError}>{message}</FormHelperText>;
      }
    } else {
      contents = <FormHelperText className={classes.helpers}>OPTIONAL: Provide a minimum and/or maximum value for the number</FormHelperText>;
    }
  } else {
    contents = <FormHelperText className={classes.helpers}>OPTIONAL: Provide a minimum and/or maximum value for the number</FormHelperText>;
  }
  return contents;
};

export const errorDetermination = (errors, index, field) => {
  let determination = false;
  if (errors.fields) {
    if (errors.fields[index]) {
      if (errors.fields[index][field]) {
        determination = errors.fields[index][field];
      }
    }
  }
  return determination;
};
