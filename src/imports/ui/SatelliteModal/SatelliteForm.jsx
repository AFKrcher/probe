import React, { useState } from 'react';
// import { SchemaFormField } from './SchemaFormField';
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

export const SatelliteForm = ({formValues, setValues, setFieldValue, editing}) => {
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
        
      </Grid>
  )
};
