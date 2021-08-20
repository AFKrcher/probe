import React, { useState, useEffect, useContext } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schema";
import { SatelliteCollection } from "../../api/satellite";
import { satelliteValidator } from "../util/yupFuncs.js";
import HelpersContext from "../helpers/HelpersContext.jsx";

// Components
import { Formik, Form } from "formik";
import { SatelliteForm } from "./SatelliteForm";
import AlertDialog from "../helpers/AlertDialog.jsx";
import SnackBar from "../helpers/SnackBar.jsx";

// @material-ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";
import Close from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  modal: {},
  title: {
    paddingBottom: "0px",
  },
}));

export const SatelliteModal = ({ show, newSat, initValues, handleClose }) => {
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);
  const classes = useStyles();

  const [schemas, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemas = SchemaCollection.find().fetch();
    return [schemas, !sub.ready()];
  });

  const [editing, setEditing] = useState(newSat || false);

  useEffect(() => {
    setEditing(newSat || false);
  }, [newSat, show]);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (newSat) {
      SatelliteCollection.insert(values);
      setOpenSnack(false);
      setSnack(
        <span>
          <strong>{initValues.names[0].names}</strong> satellite saved!
        </span>
      );
      setOpenSnack(true);
      await handleClose();
    } else {
      SatelliteCollection.update({ _id: values._id }, values);
      setOpenSnack(false);
      setSnack(
        <span>
          Changes on <strong>{initValues.names[0].names}</strong> saved!
        </span>
      );
      setOpenSnack(true);
    }
    setSubmitting(false);
    setEditing(false);
  };

  const handleDelete = () => {
    SatelliteCollection.remove(initValues._id);
    setOpenAlert(false);
    handleClose();
    setOpenSnack(false);
    setSnack(
      <span>
        Deleted <strong>{initValues.name}</strong>!
      </span>
    );
    setOpenSnack(true);
  };

  const handleDeleteDialog = () => {
    setAlert({
      title: (
        <span>
          Delete <strong>{initValues.names[0].names}</strong> Schema?
        </span>
      ),
      text: (
        <span>
          Are you sure you want to delete{" "}
          <strong>{initValues.names[0].names}</strong> and all of its data?
        </span>
      ),
      actions: (
        <Button
          variant="contained"
          size="small"
          color="secondary"
          disableElevation
          onClick={handleDelete}
        >
          Confirm
        </Button>
      ),
      closeAction: "Cancel",
    });
    setOpenAlert(true);
  };

  const handleToggleEdit = (setValues) => {
    if (editing) setValues(initValues);
    setEditing(!editing);
  };

  return (
    <>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
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
            validationSchema={satelliteValidator}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setValues, setFieldValue }) => (
              <Form>
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
                      {editing && (
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={!editing}
                          startIcon={<Save />}
                        >
                          {isSubmitting ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Save"
                          )}
                        </Button>
                      )}
                      {editing ? (
                        ""
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleDeleteDialog}
                          startIcon={<Delete />}
                        >
                          Delete
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color={editing ? "secondary" : "primary"}
                        onClick={() => handleToggleEdit(setValues)}
                        startIcon={editing ? <Delete /> : <Edit />}
                      >
                        {editing ? "Cancel Changes" : "Edit"}
                      </Button>
                    </>
                  )}
                  {editing ? (
                    ""
                  ) : (
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
    </>
  );
};
