import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { SchemaForm } from './SchemaForm';
import { SchemaCollection } from '../../api/schema';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    width: '600px',
  },
  title: {
    paddingBottom: '0px',
  }
}))

const schemaValidationSchema = Yup.object().shape({});
export const SchemaModal = ({ show, newSchema, initValues, handleClose }) => {
  const classes = useStyles();

  const [editing, setEditing] = useState((newSchema || false));
  useEffect(() => {
    setEditing(newSchema || false)
  }, [newSchema, show])

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
      <div className={classes.modal}>
        <DialogTitle className={classes.title}><strong>Create a new schema</strong></DialogTitle>
        <Formik
          initialValues={initValues}
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
                    formValues={values}
                    setValues={setValues}
                    setFieldValue={setFieldValue}
                    editing={editing}
                  />
              </DialogContent>
              <DialogActions>
                { !newSchema && (
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="secondary"
                    onClick={() => setEditing(!editing)}
                  >
                    {editing ? "Cancel editing" : "Edit schema"}
                  </Button>
                )
                }
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
