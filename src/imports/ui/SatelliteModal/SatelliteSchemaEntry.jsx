import React, { useState, useEffect } from "react";
// Imports
import { Field } from "formik";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

// @material-ui
import {
  Grid,
  makeStyles,
  Paper,
  IconButton,
  TextField,
  FormControl,
  MenuItem,
  InputAdornment,
  Tooltip,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import LinkIcon from "@material-ui/icons/Link";
import CheckBoxIcon from "@material-ui/icons/CheckBoxOutlined";
import ReportIcon from "@material-ui/icons/ReportOutlined";

const useStyles = makeStyles((theme) => ({
  entryPaper: {
    padding: "15px",
  },
  allFields: {
    paddingRight: "10px",
  },
  fieldContainer: {
    marginBottom: "10px",
    resize: "both",
  },
  field: {
    marginBottom: 4,
    resize: "both",
  },
  urlAdornment: {
    cursor: "pointer",
    color: theme.palette.text.primary,
    filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))",
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
  verifiedAdornment: {
    color: theme.palette.success.main,
    filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))",
  },
  notVerifiedAdornment: {
    color: theme.palette.warning.main,
    filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))",
  },
  helpersError: {
    marginLeft: 14,
    color: theme.palette.error.main,
  },
  helpers: {
    marginLeft: 14,
    color: theme.palette.text.disabled,
  },
  lastBuffer: {
    marginTop: -10,
  },
}));

export const SatelliteSchemaEntry = ({
  entryIndex,
  schema,
  entry,
  setFieldValue,
  editing,
  editingSchema,
  errors,
  entries,
  setSatSchema,
  isUniqueList,
  schemas,
  satelliteValidatorShaper,
  setTouched,
  values,
}) => {
  const classes = useStyles();

  const [helpers, setHelpers] = useState(null);
  const debounced = useDebouncedCallback((event, verifiedField) => {
    let obj = {};
    obj[`${event.target.name}`] = true;
    setTouched(obj);

    setFieldValue(event.target.name, event.target.value);
    // set verified to false if a field is modified and subsequently saved
    setFieldValue(verifiedField, false);
  }, 300);

  const preliminaryDebounced = useDebouncedCallback((event) => {
    // Needed in order for errors to be properly set or cleared after Formik completes a check on the satellite data
    setFieldValue(event.target.name, event.target.value);
  }, 800);

  const refreshHelpers = () => {
    if (JSON.stringify(errors) !== "{}") {
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
      return errors
        ? (helper = errors[`${name}-${entryIndex}-${fieldIndex}`])
        : null;
    }
    return helper;
  };

  const helper = (field) => {
    let helper = null;
    if (field.min || field.max) {
      if (field.min && field.max)
        helper = `Minimum Value: ${field.min}, Maximum Value: ${field.max}`;
      if (field.min && !field.max)
        helper = `Minimum Value: ${field.min}, Maximum Value: N/A`;
      if (!field.min && field.max)
        helper = `Minimum Value: N/A, Maximum Value: ${field.max}`;
    }
    if (field.stringMax) {
      helper = `${entry[`${field.name}`]?.length || 0} / ${field.stringMax}`;
    }
    return helper;
  };

  const handleEntryDelete = async (event, schemaName, index) => {
    let obj = {};
    obj[`${event.target.name}`] = true;
    setTouched(obj);

    let newEntries = entries.map((entry) => entry);
    newEntries.splice(index, 1);
    await setFieldValue(schemaName, newEntries);
    setSatSchema(satelliteValidatorShaper(schemas, values, isUniqueList)); // generate new validation schema based on added entry
  };

  const handleClick = (url) => {
    window.open(url, "_blank").focus();
  };

  const fieldProps = (classes, field, fieldIndex, verified) => {
    return {
      className: classes.field,
      inputProps: {
        name: `${schema.name}.${entryIndex}.${field.name}`,
        min: field.min,
        max: field.max,
        maxLength: field.stringMax,
        step: "any",
        spellCheck: true,
        autoComplete: "off",
      },
      InputLabelProps: {
        shrink: true,
      },
      defaultValue: entry[`${field.name}`] || "",
      onChange: (event) => {
        preliminaryDebounced(event);
        debounced(event, `${schema.name}.${entryIndex}.verified`);
      },
      onBlur: (event) => {
        preliminaryDebounced(event);
        debounced(event, `${schema.name}.${entryIndex}.verified`);
      },
      onInput: (event) => {
        preliminaryDebounced(event);
        debounced(event, `${schema.name}.${entryIndex}.verified`);
      },
      error: filteredHelper(schema.name, entryIndex, fieldIndex) ? true : false,
      label: field.name,
      margin: "dense",
      required: field.required,
      fullWidth: true,
      variant: "outlined",
      multiline: field.stringMax > 255,
      rows:
        (!field.stringMax && field.type !== "url") || field.stringMax > 255
          ? 5
          : 1,
      component:
        editing || editingSchema
          ? TextField
          : (props) =>
              linkAdornment(
                props,
                entry[`${field.name}`],
                field.type,
                verified
              ),

      type: field.type === "date" ? "datetime-local" : field.type,
      disabled: !editingSchema,
      autoComplete: "off",
    };
  };

  const linkAdornment = (props, field, type, verified) => {
    return (
      <TextField
        InputProps={
          type === "url" // adornment for URLs
            ? {
                endAdornment: (
                  <Tooltip
                    title="Open URL in a new tab"
                    arrow
                    placement="top-end"
                  >
                    <InputAdornment
                      className={classes.urlAdornment}
                      position="end"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(field);
                      }}
                    >
                      <LinkIcon />
                    </InputAdornment>
                  </Tooltip>
                ),
              }
            : field && field.length > 0 // only have verification adornment if there is data
            ? {
                endAdornment: (
                  <Tooltip
                    title={verified ? "Verified" : "Unverified"}
                    placement="top"
                  >
                    <InputAdornment
                      className={
                        verified
                          ? classes.verifiedAdornment
                          : classes.notVerifiedAdornment
                      }
                      position="end"
                    >
                      {verified ? <CheckBoxIcon /> : <ReportIcon />}
                    </InputAdornment>
                  </Tooltip>
                ),
              }
            : null
        }
        {...props}
      />
    );
  };

  return (
    <Grid item xs={12}>
      <Paper className={classes.entryPaper}>
        <Grid container spacing={0}>
          <Grid item xs={editingSchema ? 11 : 12} className={classes.allFields}>
            {schema.fields.map((field, fieldIndex) => {
              return !field.hidden || field.name === "reference" ? (
                <div key={fieldIndex} className={classes.fieldContainer}>
                  {field.allowedValues?.length === 0 ? (
                    <Field
                      {...fieldProps(
                        classes,
                        field,
                        fieldIndex,
                        entry["verified"]
                      )}
                    />
                  ) : (
                    <FormControl
                      className={classes.field}
                      disabled={!editingSchema}
                      variant="outlined"
                      margin="dense"
                      required
                      fullWidth
                      error={
                        filteredHelper(schema.name, entryIndex, fieldIndex)
                          ? true
                          : false
                      }
                    >
                      <Field
                        {...fieldProps(
                          classes,
                          field,
                          fieldIndex,
                          entry["verified"]
                        )}
                        select
                      >
                        <MenuItem value="" disabled>
                          <em>Allowed Values</em>
                        </MenuItem>
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
                    <Typography
                      variant="caption"
                      className={classes.helpersError}
                    >
                      {filteredHelper(schema.name, entryIndex, fieldIndex)}
                    </Typography>
                  ) : editingSchema ? (
                    <Typography variant="caption" className={classes.helpers}>
                      {helper(field)}
                    </Typography>
                  ) : null}
                </div>
              ) : null;
            })}
            <div className={classes.lastBuffer} />
          </Grid>
          {editing || editingSchema ? (
            <Grid
              container
              item
              xs={editingSchema ? 1 : 0}
              alignContent="center"
            >
              <IconButton
                aria-label="delete field"
                color="default"
                onClick={(event) =>
                  handleEntryDelete(event, schema.name, entryIndex)
                }
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          ) : null}
        </Grid>
      </Paper>
    </Grid>
  );
};
