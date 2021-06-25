import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { SchemaForm } from './SatelliteForm';
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

const satValidationSchema = Yup.object().shape({});
export const SatelliteModal = ({ show, newSat, initValues, handleClose }) => {
  const classes = useStyles();

  const [editing, setEditing] = useState((newSat || false));
  useEffect(() => {
    setEditing(newSat || false)
    console.log(initValues);
  }, [newSat, show])

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    if (newSat) {
      SchemaCollection.insert(values);
    } else {
      SchemaCollection.update({_id: values._id}, values);
    }
    setSubmitting(false);
    handleClose();
  }

  const handleDelete = () => {
    SchemaCollection.remove(initValues._id);
    handleClose();
  }

  const handleToggleEdit = (setValues) => {
    if (editing) setValues(initValues);
    setEditing(!editing);
  }

  return(
    <Dialog 
      open={show}
      scroll="paper"
      onClose={handleClose}
    >
      <div className={classes.modal}>
        <DialogTitle className={classes.title}><strong>Create a new satellite</strong></DialogTitle>
        <Formik
          initialValues={initValues}
          validationSchema={satValidationSchema}
          onSubmit={handleSubmit}
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
                { !newSat && (
                    <>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        onClick={handleDelete}
                      >
                        Delete Schema
                      </Button>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={() => handleToggleEdit(setValues)}
                      >
                        {editing ? "Cancel editing" : "Edit schema"}
                      </Button>
                    </>
                  )
                }
                <Button 
                  variant="outlined" 
                  onClick={handleClose}
                >
                  Close
                </Button>
                { editing && (
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={!editing}
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
                    </Button>
                  )
                }
              </DialogActions>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  )
};
