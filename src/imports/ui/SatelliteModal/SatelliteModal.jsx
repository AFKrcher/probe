// dependencies
import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schema";
import { SatelliteCollection } from "../../api/satellite";
import * as Yup from "yup";

// components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Formik, Form } from "formik";
import { SatelliteForm } from "./SatelliteForm";

const useStyles = makeStyles((theme) => ({
  modal: {},
  title: {
    paddingBottom: "0px",
  },
}));

const satValidationSchema = Yup.object().shape({});
export const SatelliteModal = ({ show, newSat, initValues, handleClose }) => {
  const classes = useStyles();

  const [schemas, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemas = SchemaCollection.find().fetch();
    return [schemas, !sub.ready()];
  });

  const [editing, setEditing] = useState(newSat || false);

  useEffect(() => {
    setEditing(newSat || false);
    console.log(initValues, "init values");
  }, [newSat, show]);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    if (newSat) {
      SatelliteCollection.insert(values);
    } else {
      SatelliteCollection.update({ _id: values._id }, values);
    }
    setSubmitting(false);
    handleClose();
  };

  const handleDelete = () => {
    SatelliteCollection.remove(initValues._id);
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
          {newSat ? (
            <strong>Create a new satellite</strong>
          ) : (
            <strong>{initValues.names[0].names}</strong>
          )}
        </DialogTitle>
        <Formik
          initialValues={initValues}
          validationSchema={satValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, dirty, values, setValues, setFieldValue }) => (
            <Form noValidate>
              <DialogContent>
                <SatelliteForm
                  formValues={values}
                  schemas={schemas}
                  setValues={setValues}
                  setFieldValue={setFieldValue}
                  editing={editing}
                />
              </DialogContent>
              <DialogActions>
                {!newSat && (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleDelete}
                      startIcon={<Delete />}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleToggleEdit(setValues)}
                    >
                      {editing ? "Cancel editing" : "Edit"}
                    </Button>
                  </>
                )}
                <Button variant="contained" onClick={handleClose}>
                  Close
                </Button>
                {editing && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!editing}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
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
