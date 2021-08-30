import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
// Imports
import { Formik, Form } from "formik";
import HelpersContext from "../helpers/HelpersContext.jsx";

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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
  modal: {
    width: "auto",
  },
  title: {
    paddingBottom: "0px",
  },
  actions: {
    marginTop: 10,
  },
}));

export const SchemaModal = ({ show, newSchema, initValues, handleClose, dirty }) => {
  const classes = useStyles();
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

  const [editing, setEditing] = useState(newSchema || false);
  useEffect(() => {
    setEditing(newSchema || false);
  }, [newSchema, show]);

  const handleSubmit = async (values, { setSubmitting }) => {
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

  const schemaValidator = Yup.object().shape({
    name: Yup.string()
      .notOneOf(schemas, "Schema name already exists")
      .required("Required"),
    description: Yup.string().required("Required"),
    fields: Yup.array().of(
      Yup.object()
        .shape({
          name: Yup.string().required("Required"),
          type: Yup.mixed()
            .oneOf(["string", "number", "date"])
            .required("Required"),
          allowedValues: Yup.array().ensure(),
          min: Yup.number().nullable().notRequired(),
          max: Yup.number()
            .nullable()
            .when(["min"], (min, schema) => {
              return schema.min(min);
            }),
          required: Yup.boolean(),
        })
        .notRequired()
    ),
  });

  const handleDelete = () => {
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

    newSchema ? handleClose() : setEditing(!editing);
  };

  const handleEdit = (setValues) => {
    if (editing) {
      setAlert({
        title: (
          <span>
            Delete Changes on <strong>{initValues.name}</strong>?
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
      <Dialog open={show} scroll="paper" onClose={handleClose} maxWidth="md">
        <div className={classes.modal}>
          <DialogTitle className={classes.title}>
            <strong>{`${
              newSchema ? "Create New Schema" : "Edit Exisiting Schema"
            }`}</strong>
          </DialogTitle>
          <Formik
            initialValues={initValues}
            validationSchema={schemaValidator}
            onSubmit={handleSubmit}
            validateOnBlur={true}
            validateOnChange={true}
          >
            {({
              errors,
              isSubmitting,
              values,
              touched,
              setValues,
              setFieldValue,
              initValues,
              dirty
            }) => (
              <Form>
                <DialogContent>
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
                  {editing && (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      disabled={
                        Object.entries(errors).length > 0 || !dirty ? true : false
                      }
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Save Changes"
                      )}
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
                          onClick={handleDeleteDialog}
                        >
                          Delete
                        </Button>
                      )}
                    </>
                  )}
                  <Button
                    variant="contained"
                    color={editing ? "secondary" : "primary"}
                    disableElevation
                    startIcon={editing ? <Delete /> : <Edit />}
                    onClick={() => handleEdit(setValues)}
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
                </DialogActions>
              </Form>
            )}
          </Formik>
        </div>
      </Dialog>
    </>
  );
};
