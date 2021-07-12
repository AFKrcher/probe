import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Chip, InputLabel, Grid, makeStyles, Paper, MenuItem, IconButton, Select, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete'
import { Field } from 'formik';

const useStyles = makeStyles((theme) => ({
  entrypaper: {
    padding: "15px"
  },
  marginright: {
    paddingRight: "10px"
  }
}))

export const SatelliteSchemaEntry = ( {index, schema, entry, deleteEntry, setFieldValue, editing} ) => {
  const classes = useStyles();

  const onChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  }

  handleEntryDelete = (index) => {
    console.log("test", schema);
    deleteEntry(schema.name, index);
  }

  return (
    <Grid item xs={12}>
      <Paper className={classes.entrypaper}>
        <Grid container spacing={0}>
          <Grid item xs={11} className={classes.marginright}>
            {schema.fields.map((field, index) => (
              <Field
                key={index}
                inputProps={{
                  name: `${schema.name}.${index}.${field.name}`
                }}
                value={entry[`${field.name}`]}
                onChange={onChange}
                label={field.name}
                margin="dense"
                required
                fullWidth
                variant="outlined"
                disabled={!editing}
                component={TextField}
              />
            ))}
          </Grid>
          <Grid container item xs={1} alignContent="center">
            <IconButton aria-label="delete field" onClick={() => handleEntryDelete(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
};
