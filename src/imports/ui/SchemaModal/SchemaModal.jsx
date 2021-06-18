import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { SchemaForm } from './SchemaForm';
import { SchemaCollection } from '../../api/schema';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    width: '500px',
  }
}))

const schemaValidationSchema = Yup.object().shape({});
export const SchemaModal = ({ show, handleClose }) => {
  const classes = useStyles();
  
  const initialValues = {
    name: "",
    description: "",
    fields: []
  };

  const createNewField = () => {
    setFields([...fields, {name: "", type: "", allowed: []}]); 
  }

  const handleFieldChange = (newField, index) => {
    const updated = fields.slice();
    updated[index] = newField;
    setFields(updated);
  }

  const handleSubmit = () => {
    const schemaObject = {};
    schemaObject.fields = [
      {
        name: "reference",
        type: "string",
        allowedValues: []
      },
      ...fields.map((field) => ({
        name: field.name.toLowerCase(),
        type: field.type.value,
        allowed: field.allowedValues.map((allowed) => allowed.value)
      }))
    ];
    console.log(JSON.stringify(schemaObject));
    SchemaCollection.insert(schemaObject);
    handleClose();
  }

  return(
    <Dialog 
      open={show}
      scroll="paper"
      onClose={handleClose}
    >
      <div className={classes.modal} >
        <DialogTitle>Create a new schema</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={schemaValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, dirty, values, setValues, setFieldValue }) => (
            <Form noValidate>
              <DialogContent>
                  <SchemaForm 
                    fields={[{name: "", type: "", allowed: []}]}
                    formValues={values}
                    setValues={setValues}
                    setFieldValue={setFieldValue}
                    createNewField={createNewField}
                    handleFieldChange={handleFieldChange}
                    editing={true}
                  />
              </DialogContent>
              <DialogActions>
                <Button 
                  variant="outlined" 
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>

    // <Modal show={show} onHide={handleClose} >
    //     <Modal.Header>
    //       <Modal.Title>Create a new schema</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       <SchemaForm
    //         name={name} 
    //         desc={desc}
    //         fields={fields}
    //         createNewField={createNewField}
    //         handleNameChange={handleNameChange}
    //         handleDescChange={handleDescChange}
    //         handleFieldChange={handleFieldChange}
    //         editing={false}
    //       />
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="secondary" onClick={handleClose}>Close</Button>
    //       <Button variant="success" onClick={handleSubmit}>Save Schema</Button>
    //     </Modal.Footer>
    // </Modal>
  )
};
