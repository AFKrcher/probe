import React, { useState } from 'react';
import { SchemaFormField } from './SchemaFormField';
import { Divider, Grid, Button, makeStyles } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  form: {

  },
  alert: {
    width: '100%',
  }
}))

export const SchemaForm = ({fields, formValues, setValues, setFieldValue, handleFieldChange, editing}) => {
  const classes = useStyles();
  const [error, setError] = useState('');

  const onAddField = () => {
    console.log(formValues);
    const fields = [...formValues.fields, {name: "", type: "", allowed: []}];
    setValues({...formValues, fields})
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
              name="name"
              label="Schema name"
              margin="dense"
              required
              fullWidth
              variant="outlined"
              component={TextField}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="description"
              label="Schema description"
              margin="dense"
              required
              fullWidth
              variant="outlined"
              multiline
              color="primary"
              rows={4}
              component={TextField}
            />
          </Grid>
        </Grid>
        {
          formValues.fields.map((field, i) => (
            <React.Fragment key={`fragment-${i}`}>
              <Grid key={`divider-${i}`} item xs={12}><Divider /></Grid>
              <Grid key={`grid-${i}`} item container>
                <SchemaFormField 
                  key={`form-field-${i}`} 
                  index={i} 
                  editing={editing} 
                  field={field} 
                  setFieldValue={setFieldValue}
                  handleFieldChange={handleFieldChange} />
              </Grid>
            </React.Fragment>
          ))
        }
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onAddField}
          >
            Add field
          </Button>
        </Grid>
      </Grid>

    // <Form>
    //   <Form.Row>
    //     <Col>
    //       <Form.Control disabled={!editing} onChange={handleNameChange} value={name} placeholder="Schema name" />
    //     </Col>
    //   </Form.Row>
    //   <Form.Row className="mt-3">
    //     <Col>
    //       <Form.Control disabled={!editing} as="textarea" onChange={handleDescChange} value={desc} placeholder="Schema description" />
    //     </Col>
    //   </Form.Row>
    //   {fields.map((field, index) => {
    //     return (
    //       <SchemaFormField editing={editing} key={`field-${index}`} className="mt-3" index={index} field={field} handleFieldChange={handleFieldChange}/>
    //     )
    //   })}
    //   {editing && <Button className="mt-3" variant="outline-dark" onClick={createNewField}>Add new field</Button>}
    // </Form>
  )
};
