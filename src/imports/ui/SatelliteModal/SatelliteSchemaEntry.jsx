import React, { useState, useEffect } from "react";
// Imports
import { Field } from "formik";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";
import { decideVerifiedValidated } from "../utils/satelliteDataFuncs";

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
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`,
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
  validatedAdornment: {
    color: theme.palette.success.light,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`,
  },
  partiallyValidatedAdornment: {
    color: theme.palette.warning.light,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`,
  },
  notValidatedAdornment: {
    color: theme.palette.error.light,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`,
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
  width,
}) => {
  const classes = useStyles();

  const [helpers, setHelpers] = useState(null);

  const debounceOne = useDebouncedCallback(
    (event, validatedField, verifiedField) => {
      let obj = {};
      obj[`${event.target.name}`] = true;
      setTouched(obj);
      // Needed in order for errors to be properly set or cleared after Formik completes a check on the satellite data
      setFieldValue(event.target.name, event.target.value);
      // set validated to false if a field is modified and subsequently saved
      setFieldValue(validatedField, [
        {
          method: "",
          name: "",
          validated: false,
          validatedOn: "",
        },
      ]);
      setFieldValue(verifiedField, [
        {
          method: "",
          name: "",
          verified: false,
          verifiedOn: "",
        },
      ]);
    },
    300
  );

  const debouncTwo = useDebouncedCallback((event) => {
    setFieldValue(event.target.name, event.target.value);
  }, 200);

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
        autoComplete: "off",
      },
      InputLabelProps: {
        shrink: true,
      },
      defaultValue: entry[`${field.name}`] || "",
      onChange: (event) => {
        debounceOne(
          event,
          `${schema.name}.${entryIndex}.validated`,
          `${schema.name}.${entryIndex}.verified`
        );
        debouncTwo(event);
      },
      onInput: (event) => {
        debounceOne(
          event,
          `${schema.name}.${entryIndex}.validated`,
          `${schema.name}.${entryIndex}.verified`
        );
        debouncTwo(event);
      },
      error: filteredHelper(schema.name, entryIndex, fieldIndex) ? true : false,
      label: field.name,
      margin: "dense",
      required: field.required,
      fullWidth: true,
      variant: "outlined",
      multiline:
        field.stringMax &&
        !field.isUnique &&
        field.name !== "name" &&
        entry[field.name]?.length > 100,
      minRows: Math.ceil(entry[field.name]?.length / 100) || 3,
      maxRows: 10,
      component:
        editing || editingSchema
          ? TextField
          : (props) =>
              linkAdornment(
                props,
                entry[`${field.name}`],
                field.type,
                validated,
                verified
              ),

      type: field.type === "date" ? "datetime-local" : field.type,
      disabled: !editingSchema,
      autoComplete: "off",
    };
  };

  const linkAdornment = (props, field, type, validated, verified) => {
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
                  <span
                    style={
                      field.length > 300 && width < 1000
                        ? {
                            display: "flex",
                            flexDirection: "column",
                          }
                        : {
                            display: "flex",
                            flexDirection: "row",
                          }
                    }
                  >
                    <Tooltip
                      title={
                        decideVerifiedValidated(
                          verified,
                          true,
                          false,
                          true,
                          classes
                        )
                        // decideVerifiedValidated takes the following arguments
                        //    1. array of verification or validation objects
                        //    2. whether it is a verification (true) or validation (false)
                        //    3. whether it is a styling decision
                        //    4. whether it is an icon decision
                        //    5. the useStyles classes
                      }
                      placement="top"
                      arrow
                    >
                      <InputAdornment
                        className={decideVerifiedValidated(
                          verified,
                          true,
                          true,
                          false,
                          classes
                        )}
                        position="end"
                      >
                        {decideVerifiedValidated(
                          verified,
                          true,
                          false,
                          false,
                          classes
                        )}
                      </InputAdornment>
                    </Tooltip>
                    {field.length > 300 && width < 1000 ? (
                      <div style={{ marginTop: 40 }} />
                    ) : null}
                    <Tooltip
                      title={decideVerifiedValidated(
                        validated,
                        false,
                        false,
                        true,
                        classes
                      )}
                      placement={
                        field.length > 300 && width < 1000 ? "bottom" : "top"
                      }
                      arrow
                    >
                      <InputAdornment
                        className={decideVerifiedValidated(
                          validated,
                          false,
                          true,
                          false,
                          classes
                        )}
                        position="end"
                      >
                        {decideVerifiedValidated(
                          validated,
                          false,
                          false,
                          false,
                          classes
                        )}
                      </InputAdornment>
                    </Tooltip>
                  </span>
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
                        entry["validated"],
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
                          entry["validated"],
                          entry["verified"]
                        )}
                        select={editing || editingSchema ? true : false}
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
