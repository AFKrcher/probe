import React, { useState } from 'react';
import { SatelliteSchemaAccordion } from './SatelliteSchemaAccordion';
import { Divider, Grid, Button, IconButton, makeStyles } from '@material-ui/core';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import DeleteIcon from '@material-ui/icons/Delete'
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  alert: {
    width: '100%',
  }
}))

export const SatelliteForm = ({formValues, schemas, setValues, setFieldValue, editing}) => {
  const classes = useStyles();
  const [error, setError] = useState('');

  const onAddField = () => {
    const fields = [...formValues.fields, {name: "", type: "", allowedValues: []}];
    setValues({...formValues, fields});
  }

  const handleFieldDelete = (index) => {
    const fields = [...formValues.fields]
    fields.splice(index, 1);
    setValues({...formValues, fields});
  }

  return (
    <Grid container spacing={1}>
      <Grid container item>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" className={classes.alert}>
              {error}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Field
            name="noradID"
            label="NORAD ID"
            margin="dense"
            required
            fullWidth
            variant="outlined"
            disabled={!editing}
            component={TextField}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {schemas.map((schema, index) => (
          <SatelliteSchemaAccordion
            key={index}
            schema={schema}
            entries={formValues[`${schema.name}`]}
            setFieldValue={setFieldValue}
            editing={true}
          />
        ))}
      </Grid>
    </Grid>
  )
};
