import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Imports
import { Field } from "formik";
import { linkAdornment } from "../utils/satelliteDataFuncs";
import { _ } from "meteor/underscore";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

// @material-ui
import { makeStyles, TextField, FormControl, MenuItem, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  fieldContainer: {
    marginBottom: "10px",
    resize: "both"
  },
  field: {
    marginBottom: 4,
    resize: "both"
  },
  urlAdornment: {
    cursor: "pointer",
    color: theme.palette.text.primary,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`,
    "&:hover": {
      color: theme.palette.info.main
    }
  },
  helpersError: {
    marginLeft: 14,
    color: theme.palette.error.main
  },
  helpers: {
    marginLeft: 14,
    color: theme.palette.text.disabled
  },
  validatedAdornment: {
    color: theme.palette.success.light,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`
  },
  partiallyValidatedAdornment: {
    color: theme.palette.warning.light,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`
  },
  notValidatedAdornment: {
    color: theme.palette.error.light,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`
  }
}));

// breakpoints based on device width / height
const adornmentBreak = 1000;

export const SatelliteEntryField = ({
  schema,
  field,
  fieldIndex,
  setFieldValue,
  editing,
  entry,
  entryIndex,
  errors,
  setTouched,
  setDisabled,
  width,
  setValidating
}) => {
  const classes = useStyles();

  const [tempValue, setTempValue] = useState(entry[field.name] || "");
  const [helpers, setHelpers] = useState(null);

  useEffect(() => {
    setTempValue(entry[field.name]);
  }, [entry]);

  const handleChange = (event, validatedField, verifiedField) => {
    setTempValue(event.target.value);
    setDisabled(true);

    const name = event.target.name;
    setValidating(true);
    debouncedSet(name, validatedField, verifiedField);
    debouncedValidate(name);
  };

  const debouncedSet = useDebouncedCallback((name, validatedField, verifiedField) => {
    setFieldValue(name, tempValue);
    setFieldValue(validatedField, [
      {
        method: null,
        name: null,
        validated: false,
        validatedOn: null
      }
    ]);
    setFieldValue(verifiedField, [
      {
        method: null,
        name: null,
        verified: false,
        verifiedOn: null
      }
    ]);

    let obj = {};
    obj[name] = true;
    setTouched(obj);
    setDisabled(false);
  }, 500);

  const debouncedValidate = useDebouncedCallback((name) => {
    setFieldValue(name, typeof tempValue === "string" ? tempValue.trim() : tempValue);
    setValidating(false);
  }, 600);

  const handleClick = (url) => {
    window.open(url, "_blank").focus();
  };

  const refreshHelpers = () => {
    if (!_.isEmpty(errors)) {
      setHelpers(Object.keys(errors));
    } else {
      setHelpers(null);
    }
  };

  useEffect(() => {
    refreshHelpers();
  }, [errors]);

  const filteredHelper = (name, entryIndex, fieldIndex) => {
    let helper = null;
    if (helpers?.includes(`${name}-${entryIndex}-${fieldIndex}`)) {
      return errors ? (helper = errors[`${name}-${entryIndex}-${fieldIndex}`]) : null;
    }
    return helper;
  };

  const helper = (field) => {
    let helper = null;
    if (field.min || field.max) {
      if (field.min && field.max) helper = `Minimum Value: ${field.min}, Maximum Value: ${field.max}`;
      if (field.min && !field.max) helper = `Minimum Value: ${field.min}, Maximum Value: N/A`;
      if (!field.min && field.max) helper = `Minimum Value: N/A, Maximum Value: ${field.max}`;
    }
    if (field.stringMax) {
      helper = `${tempValue?.length || 0} / ${field.stringMax}`;
    }
    return helper;
  };

  const fieldProps = (classes, field, fieldIndex, validated, verified) => {
    return {
      className: classes.field,
      inputProps: {
        name: `${schema.name}.${entryIndex}.${field.name}`,
        min: field.min,
        max: field.max,
        maxLength: field.stringMax,
        step: "any",
        spellCheck: field.type === "string",
        autoComplete: "off"
      },
      InputLabelProps: {
        shrink: true
      },
      value: tempValue,
      onChange: (event) => handleChange(event, `${schema.name}.${entryIndex}.validated`, `${schema.name}.${entryIndex}.verified`),
      error: filteredHelper(schema.name, entryIndex, fieldIndex) ? true : false,
      label: field.name,
      margin: "dense",
      required: field.required,
      fullWidth: true,
      variant: "outlined",
      multiline: field.stringMax && !field.isUnique && field.name !== "name" && entry[field.name]?.length > 100,
      minRows: Math.ceil(entry[field.name]?.length / 120) || 3,
      maxRows: 10,
      component: editing
        ? TextField
        : (props) => linkAdornment(width, classes, handleClick, adornmentBreak, props, entry[`${field.name}`], field.type, validated, verified),

      type: field.type === "date" ? "datetime-local" : field.type,
      disabled: !editing,
      autoComplete: "off"
    };
  };

  return (
    <div key={fieldIndex} className={classes.fieldContainer}>
      {field.allowedValues?.length === 0 ? (
        <Field {...fieldProps(classes, field, fieldIndex, entry["validated"], entry["verified"])} />
      ) : (
        <FormControl
          className={classes.field}
          variant="outlined"
          margin="dense"
          required
          fullWidth
          error={filteredHelper(schema.name, entryIndex, fieldIndex) ? true : false}>
          <Field {...fieldProps(classes, field, fieldIndex, entry["validated"], entry["verified"])} select={editing}>
            <MenuItem value={undefined}>N/A</MenuItem>
            {field.allowedValues.map((value, valueIndex) => {
              return (
                <MenuItem key={valueIndex} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </Field>
        </FormControl>
      )}
      {filteredHelper(schema.name, entryIndex, fieldIndex) ? (
        <Typography variant="caption" className={classes.helpersError}>
          {filteredHelper(schema.name, entryIndex, fieldIndex)}
        </Typography>
      ) : editing ? (
        <Typography variant="caption" className={classes.helpers}>
          {helper(field, fieldIndex)}
        </Typography>
      ) : null}
    </div>
  );
};

// Prop checking
SatelliteEntryField.propTypes = {
  schema: PropTypes.object,
  entry: PropTypes.object,
  entryIndex: PropTypes.number,
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
  setFieldValue: PropTypes.func,
  editing: PropTypes.bool,
  filteredHelper: PropTypes.func,
  setSatSchema: PropTypes.func,
  errors: PropTypes.object,
  setTouched: PropTypes.func,
  setDisabled: PropTypes.func,
  width: PropTypes.number,
  setValidating: PropTypes.func
};
