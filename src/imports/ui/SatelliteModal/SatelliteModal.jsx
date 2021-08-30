import React, { useState, useEffect, useContext, useMemo } from "react";
// Imports
import * as Yup from "yup";
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";
import { SatelliteCollection } from "../../api/satellites";
import HelpersContext from "../helpers/HelpersContext.jsx";
import { emptyDataRemover } from "../utils/satelliteDataFuncs.js";

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
      setSnack( // initValues.names[0].names is a depracated structure but necessary for old seed files to run during development. initValues.names[0].name is correct.
        <span>
          Changes on{" "}
          <strong>
            {initValues.name ? initValues.names[0].names || initValues.names[0].name : "N/A"} 
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
        <strong>{initValues.name ? initValues.names[0].names || initValues.names[0].name : "N/A"}</strong>
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
            {initValues.name ? initValues.names[0].names || initValues.names[0].name : "N/A"}
          </strong>{" "}
          Schema?
        </span>
      ),
      text: (
        <span>
          Are you sure you want to delete{" "}
          <strong>
            {initValues.name ? initValues.names[0].names || initValues.names[0].name : "N/A"}
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
              {initValues.name ? initValues.names[0].names || initValues.names[0].name : "N/A"}
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
              {initValues.name ? initValues.names[0].names || initValues.names[0].name : "N/A"}
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
    let schemaObj = {}; // {schema.name: {field.name: {field.type: string/number/date, field.allowedValues: [], required: field.required, min: field.min, max: field.max}}}
    schemas?.forEach((schema) => {
      // Step 1: map over schemas and assign each schema name as a key in the object
      schemaObj[schema.name] = {};
      // Step 2: map over each schema and assign an object containing all field names as keys in that object
      return schema.fields.forEach((field) => {
        schemaObj[schema.name][field.name] = {};
        // Step 3:  map over each field and assign an object containing all of the field's attributes (type, allowedValues, min, max, required)
        for (let attribute in field) {
          if (attribute !== "name" && attribute !== "description") {
            // Step 3.5: Take each attribute's value and assign it to the attribute in the object
            schemaObj[schema.name][field.name][attribute] = field[attribute];
          }
        }
      });
    });
    
    Yup.addMethod(Yup.array, "checkEachEntry", function (message) {
      let errObj = {}
      // test each entry in the array: Yup.object().shape({field.name: Yup.(field.type).required(field.required).min(field.min).max(field.max).oneOf((field.allowedValues))})
      return this.test("checkEachEntry", message, function (value) {
        const { path, createError } = this;
        value?.forEach((entry) => {
          // "entry" is composed of multiple "fields", and is part of the submitted array, aka "value"
          let fieldObj = {};
          let schema = schemaObj[path];
          for (let schemaField in schema) {
            // "schema" are the schemas seen on the SchemasTable, and "schemaField" are the fields to be filled-in in each schema
            let fieldRequirements = schema[schemaField];
            switch (fieldRequirements.type) {
              case "string":
                switch (fieldRequirements.required) {
                  case true:
                    switch (fieldRequirements.allowedValues.length > 0) {
                      case true:
                        fieldObj[schemaField] = Yup.string()
                          .required("Required")
                          .oneOf(
                            fieldRequirements.allowedValues,
                            `Must be one of the following: ${fieldRequirements.allowedValues.toString(
                              ", "
                            )}`
                          );
                        break;
                      default:
                        fieldObj[schemaField] =
                          Yup.string().required("Required");
                    }
                    break;
                  default:
                    switch (fieldRequirements.allowedValues.length > 0) {
                      case true:
                        fieldObj[schemaField] = Yup.string().oneOf(
                          fieldRequirements.allowedValues,
                          `Must be one of the following: ${fieldRequirements.allowedValues.toString(
                            ", "
                          )}`
                        );
                        break;
                      default:
                        fieldObj[schemaField] = Yup.string();
                    }
                }
                break;
              case "number":
                switch (fieldRequirements.required) {
                  case true:
                    switch (
                      fieldRequirements.min && fieldRequirements.max
                        ? true
                        : false
                    ) {
                      case true:
                        fieldObj[schemaField] = Yup.number()
                          .required("Required")
                          .min(
                            fieldRequirements.min,
                            `Must be between the values of ${fieldRequirements.min} and ${fieldRequirements.max}`
                          )
                          .max(
                            fieldRequirements.max,
                            `Must be between the values of ${fieldRequirements.min} and ${fieldRequirements.max}`
                          );
                        break;
                      default:
                        fieldObj[schemaField] =
                          Yup.number().required("Required");
                    }
                    break;
                  default:
                    switch (fieldRequirements.min && fieldRequirements.max) {
                      case true:
                        fieldObj[schemaField] = Yup.number()
                          .min(
                            fieldRequirements.min,
                            `Must be between the values of ${fieldRequirements.min} and ${fieldRequirements.max}`
                          )
                          .max(
                            fieldRequirements.max,
                            `Must be between the values of ${fieldRequirements.min} and ${fieldRequirements.max}`
                          );
                        break;
                      default:
                        fieldObj[schemaField] = Yup.number();
                    }
                }
                break;
              case "date":
                switch (fieldRequirements.required) {
                  case true:
                    fieldObj[schemaField] = Yup.date().required("Required");
                    break;
                  default:
                    fieldObj[schemaField] = Yup.date();
                }
                break;
              default:
                console.error("Unknown field type");
            }
          }
          let fieldValidator = Yup.object().shape(fieldObj);

          fieldValidator
            .validate(entry)
            .then((result) => {
              console.log(result)
              delete errObj[path]
            })
            .catch((err) => {
              err.path === undefined ? err.message = "err is not defined" : null
              return err.message !== "err is not defined" ? errObj[path] = err.message : null
            });
        });
        if (JSON.stringify(errObj) === "{}") {
          return true
        } else {
          for (let errPath in errObj) {
            return errPath ? createError({errPath, message: errObj[errPath]}) : true
          }
        }
      });
    });

    let yupShape = {
      // NORAD ID is always a part of the yup shape
      noradID: Yup.string()
        .required("Required")
        .length(5, "Must be a positive, 5-digit number")
        .matches(/^[0-9]+$/g, "Must be a positive, 5-digit number"),
    };

    if (JSON.stringify(schemaObj) !== "{}") {
      for (let schema in schemaObj) {
        yupShape[schema] = Yup.array().checkEachEntry();
      }
    }
    return yupShape
  };
  
  let satelliteValidator = Yup.object().shape(schemaValidatorShaper());

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
                  {initValues.name ? initValues.names[0].names || initValues.names[0].name : "N/A"}
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
            validateOnMount={true}
          >
            {({ errors, isSubmitting, values, setValues, setFieldValue, dirty }) => (
              <Form>
                {console.log(errors, dirty)}
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
                          Object.entries(errors).length > 0 || !dirty ? true : false
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
