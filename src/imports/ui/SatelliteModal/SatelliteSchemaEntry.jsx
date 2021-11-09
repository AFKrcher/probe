import React from "react";
import PropTypes from "prop-types";

// Components
import { SatelliteEntryField } from "./SatelliteEntryField";

// @material-ui
import { Grid, makeStyles, Paper, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(() => ({
  entryPaper: {
    padding: "15px"
  },
  allFields: {
    paddingRight: "10px"
  },
  lastBuffer: {
    marginTop: -10
  }
}));

export const SatelliteSchemaEntry = ({
  entryIndex,
  schema,
  setFieldValue,
  editing,
  errors,
  entry,
  handleDeleteEntry,
  setTouched,
  disabled,
  setDisabled,
  width,
  setValidating
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper className={classes.entryPaper}>
        <Grid container spacing={0}>
          <Grid item xs={editing ? 11 : 12} className={classes.allFields} justifyContent="center">
            {schema.fields.map((field, fieldIndex) => {
              return (
                (!field.hidden || field.name === "reference") && (
                  <SatelliteEntryField
                    key={fieldIndex}
                    schema={schema}
                    field={field}
                    fieldIndex={fieldIndex}
                    setFieldValue={setFieldValue}
                    editing={editing}
                    entry={entry}
                    entryIndex={entryIndex}
                    errors={errors}
                    setTouched={setTouched}
                    setDisabled={setDisabled}
                    width={width}
                    setValidating={setValidating}
                  />
                )
              );
            })}
            <div className={classes.lastBuffer} />
          </Grid>
          {editing && (
            <Grid container item xs={1} justifyContent="center">
              <IconButton
                tabIndex={1000}
                aria-label="delete field"
                color="default"
                disabled={disabled}
                onClick={() => handleDeleteEntry(schema, entryIndex)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
};

// Prop checking
SatelliteSchemaEntry.propTypes = {
  entryIndex: PropTypes.number,
  schema: PropTypes.object,
  entry: PropTypes.object,
  setFieldValue: PropTypes.func,
  editing: PropTypes.bool,
  editingSchema: PropTypes.bool,
  errors: PropTypes.object,
  entries: PropTypes.array,
  setTouched: PropTypes.func,
  disabled: PropTypes.bool,
  setDisabled: PropTypes.func,
  handleDeleteEntry: PropTypes.func,
  width: PropTypes.number,
  setValidating: PropTypes.func
};
