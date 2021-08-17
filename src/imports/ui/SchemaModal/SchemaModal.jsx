import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SchemaForm } from "./SchemaForm";
import { SchemaCollection } from "../../api/schema";
import { makeStyles } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
  modal: {
    width: "550px",
  },
  title: {
    paddingBottom: "0px",
  },
  actions: {
    marginTop: 10,
  },
}));

const schemaValidationSchema = Yup.object().shape({});
export const SchemaModal = ({ show, newSchema, initValues, handleClose }) => {
  const classes = useStyles();

  const [editing, setEditing] = useState(newSchema || false);
  useEffect(() => {
    setEditing(newSchema || false);
    console.log(initValues);
  }, [newSchema, show]);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    if (newSchema) {
      SchemaCollection.insert(values);
    } else {
      SchemaCollection.update({ _id: values._id }, values);
    }
    setSubmitting(false);
    setEditing(false);
  };

  const handleDelete = () => {
    SchemaCollection.remove(initValues._id);
    handleClose();
  };

  const handleToggleEdit = (setValues) => {
    if (editing) setValues(initValues);
    setEditing(!editing);
  };

  return (
    <Dialog open={show} scroll="paper" onClose={handleClose}>
      <div className={classes.modal}>
        <DialogTitle className={classes.title}>
          <strong>{`${
            newSchema ? "Create New Schema" : "Edit Exisiting Schema"
          }`}</strong>
        </DialogTitle>
        <Formik
          initialValues={initValues}
          validationSchema={schemaValidationSchema}
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
              <DialogActions className={classes.actions}>
                {editing && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    disabled={!editing}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Save"}
                  </Button>
                )}
                {!newSchema && (
                  <>
                    {!editing && (
                      <Button
                        variant="contained"
                        color="secondary"
                        disableElevation
                        startIcon={<Delete />}
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color={editing ? "secondary" : "primary"}
                      disableElevation
                      startIcon={editing ? <Delete /> : <Edit />}
                      onClick={() => handleToggleEdit(setValues)}
                    >
                      {editing ? "Cancel Changes" : "Edit"}
                    </Button>
                  </>
                )}
                {!editing && (
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    startIcon={<Close />}
                  >
                    Close
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
};
