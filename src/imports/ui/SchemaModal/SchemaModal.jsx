import React, { useState, useEffect, useContext } from "react";
// Imports
import { Formik, Form } from "formik";
import HelpersContext from "../helpers/HelpersContext.jsx";
import { schemaValidatorShaper } from "../utils/schemaDataFuncs.js";

// Components
import { SchemaForm } from "./SchemaForm";
import { SchemaCollection } from "../../api/schemas";
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
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";

const useStyles = makeStyles(() => ({
  modal: {
    width: "auto",
    height: "100vh",
  },
  titleText: {
    fontSize: "25px",
  },
  content: {
    maxHeight: "75vh",
    overflowY: "auto",
  },
  description: {
    marginTop: -10,
    marginBottom: 15,
    margin: 5,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    margin: "5px 20px 5px 20px",
  },
}));

export const SchemaModal = ({ show, newSchema, initValues, handleClose }) => {
  const classes = useStyles();
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

  const [editing, setEditing] = useState(newSchema || false);
  useEffect(() => {
    setEditing(newSchema || false);
  }, [newSchema, show]);

  const handleSubmit = async (values, { setSubmitting }) => {
    window.sessionStorage.clear();

    if (values) {
      if (newSchema) {
        SchemaCollection.insert(values);
      } else {
        SchemaCollection.update({ _id: values._id }, values);
      }
      setSubmitting(false);
      setEditing(false);
      if (newSchema) {
        setOpenSnack(false);
        setSnack(
          <span>
            New <strong>{values.name}</strong> schema saved!
          </span>
        );
        setOpenSnack(true);
        await handleClose();
      } else {
        setOpenSnack(false);
        setSnack(
          <span>
            Changes on <strong>{values.name}</strong> schema saved!
          </span>
        );
        setOpenSnack(true);
      }
    }
  };

  // Refactor for modularity/ Import form yupFuncs. Currently, doesn't work asynchronously.
  const schemas = SchemaCollection.find()
    .fetch()
    .map((schema) =>
      editing
        ? initValues.name !== schema.name
          ? schema.name
          : null
        : schema.name
    );

  const handleDelete = () => {
    window.sessionStorage.clear();
    SchemaCollection.remove(initValues._id);
    setOpenAlert(false);
    handleClose();
    setOpenSnack(false);
    setSnack(
      <span>
        Deleted <strong>{initValues.name}</strong> schema!
      </span>
    );
    setOpenSnack(true);
  };

  const handleDeleteDialog = () => {
    setAlert({
      title: (
        <span>
          Delete <strong>{initValues.name}</strong> Schema?
        </span>
      ),
      text: (
        <span>
          Are you sure you want to delete the <strong>{initValues.name}</strong>{" "}
          schema and all of its fields?
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
    if (newSchema) {
      handleClose();
    }
    setEditing(!editing);
  };

  const handleEdit = (setValues, dirty) => {
    if (editing && dirty) {
      setAlert({
        title: (
          <span>
            Delete changes on <strong>{initValues.name || "new schema"}</strong>
            ?
          </span>
        ),
        text: (
          <span>
            Are you sure you want to cancel all changes made to{" "}
            <strong>{initValues.name}</strong> schema and its fields?
          </span>
        ),
        actions: (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            disableElevation
            onClick={() => {
              setOpenAlert(false);
              handleToggleEdit(setValues);
              handleClose();
            }}
          >
            Confirm
          </Button>
        ),
        closeAction: "Cancel",
      });
      setOpenAlert(true);
    } else {
      handleToggleEdit(setValues);
    }
  };

  return (
    <>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      <Dialog open={show} scroll="paper" maxWidth="md">
        <div className={classes.modal}>
          <DialogTitle>
            <strong className={classes.titleText}>{`${
              newSchema ? "Create New Schema" : "Edit Exisiting Schema"
            }`}</strong>
          </DialogTitle>
          <Formik
            initialValues={initValues}
            validationSchema={schemaValidatorShaper(schemas)}
            onSubmit={handleSubmit}
          >
            {({
              errors,
              isSubmitting,
              values,
              touched,
              setValues,
              setFieldValue,
              initValues,
              dirty,
            }) => (
              <Form>
                <DialogContent className={classes.content}>
                  <Typography className={classes.description}>
                    Each schema is built to store sets of data that characterize
                    a satellite. Data fields can be added, modified, or deleted
                    below.
                  </Typography>
                  <SchemaForm
                    touched={touched}
                    errors={errors}
                    formValues={values}
                    setValues={setValues}
                    setFieldValue={setFieldValue}
                    editing={editing}
                    initValues={initValues}
                  />
                </DialogContent>
                <DialogActions className={classes.actions}>
                  {!newSchema && (
                    <>
                      {!editing && (
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<Delete />}
                          onClick={handleDeleteDialog}
                        >
                          Delete
                        </Button>
                      )}
                    </>
                  )}
                  <Button
                    variant="contained"
                    color={editing ? "secondary" : "default"}
                    startIcon={editing ? <Delete /> : <Edit />}
                    onClick={() => handleEdit(setValues, dirty)}
                  >
                    {editing ? "Cancel" : "Edit"}
                  </Button>
                  {!editing && (
                    <Button
                      variant="contained"
                      onClick={handleClose}
                      startIcon={<Close />}
                    >
                      Close
                    </Button>
                  )}
                  {editing && (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      disabled={
                        Object.entries(errors).length > 0 || !dirty
                          ? true
                          : false
                      }
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} />
                      ) : newSchema ? (
                        "Save"
                      ) : (
                        "Save Changes"
                      )}
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
