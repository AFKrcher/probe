import React, { useState, useEffect } from "react";
// Imports
import { Field } from "formik";

// @material-ui
import {
  Grid,
  makeStyles,
  Paper,
  IconButton,
  TextField,
  Typography,
  FormControl,
  MenuItem,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

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
  helpersError: {
    marginLeft: 14,
    color: theme.palette.error.main,
  },
  lastBuffer: {
    marginTop: -10,
  },
}));

export const SatelliteSchemaEntry = ({
  index,
  schema,
  entry,
  deleteEntry,
  setFieldValue,
  editing,
  helpers,
  errors,
}) => {
  const classes = useStyles();

  const [filteredHelper, setFilteredHelper] = useState(null);

  const filterHelpers = () => {
    if (JSON.stringify(errors) !== "{}") {
      let correctEntryError = Object.keys(errors).find(string => string.includes(`**${index + 1}`))
      setFilteredHelper(correctEntryError ? correctEntryError : null)
    } else {
      setFilteredHelper(null);
    }
  };

  useEffect(() => {
    filterHelpers();
  }, [errors]);

  const onChange = async (event) => {
    setFieldValue(event.target.name, event.target.value);
    await setTimeout(() =>
      setFieldValue(event.target.name, event.target.value)
    );
    filterHelpers();
  };

  handleEntryDelete = (schemaName, index) => {
    deleteEntry(schemaName, index);
    setFilteredHelper(null);
  };

  return (
    <Grid item xs={12}>
      {console.log(errors, index)}
      <Paper className={classes.entryPaper}>
        <Grid container spacing={0}>
          <Grid item xs={editing ? 11 : 12} className={classes.allFields}>
            {schema.fields.map((field, fieldindex) => {
              return (
                <div key={fieldindex} className={classes.fieldContainer}>
                  {field.allowedValues.length < 1 ? (
                    <Field
                      className={classes.field}
                      inputProps={{
                        name: `${schema.name}.${index}.${field.name}`,
                        min: field.min,
                        max: field.max,
                        step: "any",
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={field.name === filteredHelper?.split("**")[0]}
                      value={entry[`${field.name}`]}
                      onChange={onChange}
                      onBlur={onChange}
                      label={field.name}
                      margin="dense"
                      required={field.required}
                      fullWidth
                      variant="outlined"
                      disabled={!editing}
                      component={TextField}
                      type={
                        field.type === "date" ? "datetime-local" : field.type
                      }
                    />
                  ) : (
                    <FormControl
                      className={classes.field}
                      error={field.name === filteredHelper?.split("**")[0]}
                      disabled={!editing}
                      variant="outlined"
                      margin="dense"
                      required
                      fullWidth
                    >
                      <Field
                        inputProps={{
                          name: `${schema.name}.${index}.${field.name}`,
                          min: field.min,
                          max: field.max,
                          step: "any",
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={entry[`${field.name}`] || ""}
                        onChange={onChange}
                        onBlur={onChange}
                        label={field.name}
                        margin="dense"
                        required={field.required}
                        fullWidth
                        select
                        variant="outlined"
                        disabled={!editing}
                        error={field.name === filteredHelper?.split("**")[0]}
                        component={TextField}
                        type={
                          field.type === "date" ? "datetime-local" : field.type
                        }
                      >
                        <MenuItem value="" disabled>
                          <em>Allowed Values</em>
                        </MenuItem>
                        {field.allowedValues.map((value, index) => {
                          return (
                            <MenuItem key={index} value={value}>
                              {value}
                            </MenuItem>
                          );
                        })}
                      </Field>
                    </FormControl>
                  )}
                  <Typography
                    variant="caption"
                    className={classes.helpersError}
                  >
                    {field.name === filteredHelper?.split("**")[0] ? errors[filteredHelper] : null}
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
                onClick={() => handleEntryDelete(schema.name, index)}
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
