import React from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  InputLabel,
  Grid,
  makeStyles,
  Paper,
  MenuItem,
  IconButton,
  Select,
  TextField,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field } from "formik";

const useStyles = makeStyles((theme) => ({
  entrypaper: {
    padding: "15px",
  },
  marginright: {
    paddingRight: "10px",
  },
}));

export const SatelliteSchemaEntry = ({
  index,
  schema,
  entry,
  deleteEntry,
  setFieldValue,
  editing,
}) => {
  const classes = useStyles();

  const onChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  handleEntryDelete = (schemaName, index) => {
    deleteEntry(schemaName, index);
  };

  return (
    <Grid item xs={12}>
      <Paper className={classes.entrypaper}>
        <Grid container spacing={0}>
          <Grid item xs={11} className={classes.marginright}>
            {schema.fields.map((field, fieldindex) => (
              <Field
                key={fieldindex}
                inputProps={{
                  name: `${schema.name}.${index}.${field.name}`,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={
                  field.name === "name"
                    ? entry.names || entry.name
                    : entry[`${field.name}`]
                }
                onChange={onChange}
                label={field.name}
                margin="dense"
                required={field.required}
                fullWidth
                variant="outlined"
                disabled={!editing}
                component={TextField}
                type={field.type === "date" ? "datetime-local" : ""}
              />
            ))}
          </Grid>
          <Grid container item xs={1} alignContent="center">
            <IconButton
              aria-label="delete field"
              onClick={() => handleEntryDelete(schema.name, index)}
            >
              <DeleteIcon fontSize="default" />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
