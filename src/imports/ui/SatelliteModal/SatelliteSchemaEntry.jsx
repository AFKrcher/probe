import React, { useState, useEffect } from "react";
// Imports
import { Field, FieldArray } from "formik";

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
  },
  field: {
    marginBottom: 4,
  },
  inputAdornment: {
    cursor: "pointer",
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
  helpersError: {
    marginLeft: 14,
    color: theme.palette.error.main,
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
  errors,
  entries,
  setSatSchema,
  isUniqueList,
  schemas,
  schemaGenerator,
  setTouched
}) => {
  const classes = useStyles();

  const [helpers, setHelpers] = useState(null);

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

  const onChange = (event) => {
    let obj = {};
    obj[`${event.target.name}`] = true;
    setTouched(obj);

    setFieldValue(event.target.name, event.target.value);
    setTimeout(() => setFieldValue(event.target.name, event.target.value));
  };

  handleEntryDelete = async (schemaName, index) => {
    let newEntries = entries.map((entry) => entry);
    newEntries.splice(index, 1);
    await setFieldValue(schemaName, newEntries);
    setSatSchema(schemaGenerator(schemas, values, isUniqueList));
  };

  handleClick = (url) => {
    window.open(url, "_blank").focus();
  };

  const linkAdornment = (props, field, type) => {
    return (
      <TextField
        InputProps={
          type === "url"
            ? {
                endAdornment: (
                  <Tooltip
                    title={"Open URL in a new tab"}
                    arrow
                    placement="top-end"
                  >
                    <InputAdornment
                      className={classes.inputAdornment}
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
          <Grid item xs={editing ? 11 : 12} className={classes.allFields}>
            {schema.fields.map((field, fieldIndex) => {
              return (
                <div key={fieldIndex} className={classes.fieldContainer}>
                  <FieldArray
                    name={schema.name}
                    render={() => {
                      return field.allowedValues.length === 0 ? (
                        <Field
                          className={classes.field}
                          inputProps={{
                            name: `${schema.name}.${entryIndex}.${field.name}`,
                            min: field.min,
                            max: field.max,
                            step: "any",
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={entry[`${field.name}`] || ""}
                          onChange={onChange}
                          error={
                            filteredHelper(schema.name, entryIndex, fieldIndex)
                              ? true
                              : false
                          }
                          label={field.name}
                          margin="dense"
                          required={field.required}
                          fullWidth
                          variant="outlined"
                          disabled={!editing}
                          component={
                            editing
                              ? TextField
                              : (props) =>
                                  linkAdornment(
                                    props,
                                    entry[`${field.name}`],
                                    field.type
                                  )
                          }
                          type={
                            field.type === "date"
                              ? "datetime-local"
                              : field.type
                          }
                        />
                      ) : (
                        <FormControl
                          className={classes.field}
                          disabled={!editing}
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
                            inputProps={{
                              name: `${schema.name}.${entryIndex}.${field.name}`,
                              min: field.min,
                              max: field.max,
                              step: "any",
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={entry[`${field.name}`] || ""}
                            onChange={onChange}
                            error={
                              filteredHelper(
                                schema.name,
                                entryIndex,
                                fieldIndex
                              )
                                ? true
                                : false
                            }
                            label={field.name}
                            margin="dense"
                            required={field.required}
                            fullWidth
                            select={true}
                            variant="outlined"
                            disabled={!editing}
                            component={
                              editing
                                ? TextField
                                : (props) =>
                                    linkAdornment(
                                      props,
                                      entry[`${field.name}`],
                                      field.type
                                    )
                            }
                            type={
                              field.type === "date"
                                ? "datetime-local"
                                : field.type
                            }
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
                      );
                    }}
                  />
                  <Typography
                    variant="caption"
                    className={
                      !editing ? classes.helpers : classes.helpersError
                    }
                  >
                    {filteredHelper(schema.name, entryIndex, fieldIndex)}
                  </Typography>
                </div>
              );
            })}
            <div className={classes.lastBuffer} />
          </Grid>
          {editing && (
            <Grid container item xs={editing ? 1 : 0} alignContent="center">
              <IconButton
                aria-label="delete field"
                color="default"
                onClick={() => handleEntryDelete(schema.name, entryIndex)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
};
