import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";
import { SatelliteCollection } from "../../api/satellites";

import HelpersContext from "../helpers/HelpersContext.jsx";
import { emptyDataRemover } from "../util/satelliteDataFuncs.js";

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
  Typography,
} from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";
import Close from "@material-ui/icons/Close";
import { fieldToSelect } from "formik-material-ui";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: "0px",
    marginBottom: -5,
  },
  titleText: {
    fontSize: "30px",
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
    emptyDataRemover(values);
    console.log(values);

    if (newSat) {
      SatelliteCollection.insert(values);
      setOpenSnack(false);
      setSnack(
        <span>
          <strong>{values.names[0].name}</strong> saved!
        </span>
      );
      setOpenSnack(true);
      await handleClose();
    } else {
      SatelliteCollection.update({ _id: values._id }, values);
      setOpenSnack(false);
      setSnack(
        <span>
          Changes on{" "}
          <strong>
            {initValues.names[0].names || initValues.names[0].name}
          </strong>{" "}
          saved!
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
        Deleted{" "}
        <strong>{initValues.names[0].names || initValues.names[0].name}</strong>
        !
      </span>
    );
    setOpenSnack(true);
  };

  const handleDeleteDialog = () => {
    setAlert({
      title: (
        <span>
          Delete{" "}
          <strong>
            {initValues.names[0].names || initValues.names[0].name}
          </strong>{" "}
          Schema?
        </span>
      ),
      text: (
        <span>
          Are you sure you want to delete{" "}
          <strong>
            {initValues.names[0].names || initValues.names[0].name}
          </strong>{" "}
          and all of its data?
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
    initValues.names ? setEditing(!editing) : handleClose();
  };

  const handleEdit = (setValues) => {
    if (editing) {
      setAlert({
        title: initValues.names ? (
          <span>
            Delete changes on{" "}
            <strong>
              {initValues.names[0].names || initValues.names[0].name}
            </strong>
            ?
          </span>
        ) : (
          <span>Delete changes on new satellite?</span>
        ),
        text: initValues.names ? (
          <span>
            Are you sure you want to cancel all changes made to{" "}
            <strong>
              {initValues.names[0].names || initValues.names[0].name}
            </strong>{" "}
            and its data?
          </span>
        ) : (
          <span>
            Are you sure you want to delete all the changes you've made to this
            new satellite?
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

  const schemaValidatorShaper = () => {
    let obj = {}; // {schema.name: {field.name: {field.type: string/number/date, field.allowedValues: [], required: field.required, min: field.min, max: field.max}}}
    schemas?.forEach((schema) => {
      // Step 1: map over schemas and assign each schema name as a key in the object
      obj[schema.name] = {};

      // Step 2: map over each schema and assign an object containing all field names as keys in that object
      return schema.fields.forEach((field) => {
        obj[schema.name][field.name] = {};

        // Step 3:  map over each field and assign an object containing all of the field's attributes (type, allowedValues, min, max, required)
        for (let attribute in field) {
          if (attribute !== "name" && attribute !== "description") {
            // Step 3.5: Take each attribute's value and assign it to the attribute in the object
            obj[schema.name][field.name][attribute] = field[attribute];
          }
        }
      });
    });

    console.log("our objects ", obj);

    // Yup.addMethod(Yup.array, "checkEachEntry", function (args) => {
    //   const {message, predicate} = args
    //   return this.test("checkEachEntry", message, function)
    // })

    let yupShape = {
      // NORAD ID is always a part of the yup shape

      noradID: Yup.string()
        .required("Required")
        .length(5, "Must be a positive, 5-digit number")
        .matches(/^[0-9]+$/g, "Must be a positive, 5-digit number"),
    }; // {schema.name: Yup.array().of(Yup.object().shape({field.name: Yup.(field.type).required(field.required).min(field.min).max(field.max).oneOf((field.allowedValues))}))}

    return yupShape;
  };

  const satelliteValidator = Yup.object().shape(schemaValidatorShaper());

  return (
    <>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      <Dialog open={show} scroll="paper" onClose={handleClose} maxWidth="md">
        <div className={classes.modal}>
          <DialogTitle className={classes.title}>
            <Typography className={classes.titleText}>
              {newSat ? (
                <strong>Create a new satellite</strong>
              ) : (
                <strong>
                  {initValues.names[0].names || initValues.names[0].name}
                </strong>
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={initValues}
            validationSchema={satelliteValidator}
            onSubmit={handleSubmit}
            validateOnBlur={true}
            validateOnChange={true}
          >
            {({ errors, isSubmitting, values, setValues, setFieldValue }) => (
              <Form>
                <DialogContent>
                  <SatelliteForm
                    errors={errors}
                    formValues={values}
                    schemas={schemas}
                    setValues={setValues}
                    setFieldValue={setFieldValue}
                    editing={editing}
                    initValues={initValues}
                    newSat={newSat}
                  />
                </DialogContent>
                <DialogActions>
                  <>
                    {editing && (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!editing}
                        startIcon={<Save />}
                        disabled={
                          Object.entries(errors).length > 0 ? true : false
                        }
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} />
                        ) : newSat ? (
                          "Save"
                        ) : (
                          "Save Changes"
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
                  </>

                  <Button
                    variant="contained"
                    color={editing ? "secondary" : "primary"}
                    onClick={() => handleEdit(setValues)}
                    startIcon={editing ? <Delete /> : <Edit />}
                  >
                    {editing ? "Cancel" : "Edit"}
                  </Button>
                  {editing ? null : (
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
