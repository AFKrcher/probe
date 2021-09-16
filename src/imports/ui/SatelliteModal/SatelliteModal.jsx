import React, { useState, useEffect, useContext } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";
import { SatelliteCollection } from "../../api/satellites";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import {
  emptyDataRemover,
  schemaGenerator,
} from "../utils/satelliteDataFuncs.js";

// Components
import { Formik, Form } from "formik";
import { SatelliteForm } from "./SatelliteForm";
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";

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

const useStyles = makeStyles(() => ({
  modal: {
    width: "auto",
    height: "auto",
  },
  titleText: {
    fontSize: "25px",
  },
  content: {
    overflowY: "auto",
  },
  description: {
    marginTop: -10,
    marginBottom: 15,
    margin: 5,
  },
  loadingDialog: {
    textAlign: "center",
    margin: 50,
    overflow: "hidden",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    margin: "5px 20px 5px 20px",
  },
  loadingSave: {
    textAlign: "center",
    overflow: "hidden",
  },
}));

export const SatelliteModal = ({
  show,
  newSat,
  initValues,
  handleClose,
  width,
}) => {
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

  const classes = useStyles();

  const [schemas, sats, isLoadingSch, isLoadingSat] = useTracker(() => {
    const subSch = Meteor.subscribe("schemas");
    const subSat = Meteor.subscribe("satellites");
    const schemas = SchemaCollection.find().fetch();
    const sats = SatelliteCollection.find().fetch();
    return [schemas, sats, !subSch.ready(), !subSat.ready()];
  });

  const isUniqueList = (path, field) => {
    let list = [];
    if (!path) {
      for (let sat in sats) {
        sats[sat][field] === initValues[field]
          ? null
          : list.push(sats[sat][field]);
      }
    } else if (initValues[path]) {
      for (let sat in sats) {
        let satEntries = sats[sat][path];
        for (let entry in satEntries) {
          satEntries[entry][field] ===
          (initValues[path].length > 0 ? initValues[path][entry][field] : null)
            ? null
            : list.push(satEntries[entry][field]);
        }
      }
    }
    return list;
  };

  const [editing, setEditing] = useState(newSat || false);
  const [satSchema, setSatSchema] = useState(null);

  useEffect(() => {
    setEditing(newSat || false);
  }, [newSat, show]);

  useEffect(() => {
    setSatSchema(schemaGenerator(schemas, initValues, isUniqueList));
  }, [initValues, show, isLoadingSch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    emptyDataRemover(values); // remove schemas that were added by the user but contain no entries

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
            {values.names && values.names[0] ? values.names[0].name : "N/A"}
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
        <strong>
          {initValues.names && initValues.names[0]
            ? initValues.names[0].name
            : "N/A"}
        </strong>
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
            {initValues.name && initValues.names[0]
              ? initValues.names[0].name
              : "N/A"}
          </strong>{" "}
          Schema?
        </span>
      ),
      text: (
        <span>
          Are you sure you want to delete{" "}
          <strong>
            {initValues.name && initValues.names[0]
              ? initValues.names[0].name
              : "N/A"}
          </strong>{" "}
          and all of its data?
        </span>
      ),
      actions: (
        <Button
          size={width && width < 500 ? "small" : "medium"}
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
    if (newSat) handleClose();
    setEditing(!editing);
  };

  const handleEdit = (setValues, dirty, values) => {
    if (editing && dirty) {
      setAlert({
        title: initValues.names ? (
          <span>
            Delete changes on{" "}
            <strong>
              {initValues.names && initValues.names[0]
                ? initValues.names[0].name
                : "N/A"}
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
              {initValues.names && initValues.names[0]
                ? initValues.names[0].name
                : "N/A"}
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
            size={width && width < 500 ? "small" : "medium"}
            variant="contained"
            size="small"
            color="secondary"
            disableElevation
            onClick={() => {
              setOpenAlert(false);
              emptyDataRemover(values);
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
      emptyDataRemover(values);
      handleToggleEdit(setValues);
    }
  };

  return (
    <>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      <Dialog open={show} scroll="paper" maxWidth="md">
        <div className={classes.modal}>
          <DialogTitle className={classes.title}>
            <Typography className={classes.titleText}>
              {newSat ? (
                <>
                  Creating <strong>New Satellite</strong>
                </>
              ) : (
                <>
                  Editing{" "}
                  <strong>
                    {initValues.names && initValues.names[0]
                      ? initValues.names[0].name
                      : "N/A"}
                  </strong>
                </>
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={initValues}
            onSubmit={handleSubmit}
            validationSchema={satSchema}
          >
            {({
              errors,
              isSubmitting,
              values,
              setValues,
              setFieldValue,
              dirty,
              touched,
              setTouched
            }) => (
              <Form>
                {isLoadingSch || isLoadingSat ? (
                  <DialogContent className={classes.loadingDialog}>
                    <CircularProgress size={75} />
                  </DialogContent>
                ) : (
                  <DialogContent
                    className={classes.content}
                    style={
                      width < 500
                        ? width < 350
                          ? { height: "50vh" }
                          : { height: "60vh" }
                        : { height: "75vh" }
                    }
                  >
                    <Typography className={classes.description}>
                      Each satellite in the catalogue contains a number of
                      fields based on schemas. Schemas can be added, deleted,
                      and modified below.
                    </Typography>
                    <SatelliteForm
                      errors={errors}
                      values={values}
                      schemas={schemas}
                      setValues={setValues}
                      setFieldValue={setFieldValue}
                      editing={editing}
                      initValues={initValues}
                      newSat={newSat}
                      setSatSchema={setSatSchema}
                      isUniqueList={isUniqueList}
                      schemaGenerator={schemaGenerator}
                      setTouched={setTouched}
                    />
                  </DialogContent>
                )}
                <DialogActions className={classes.actions}>
                  {Meteor.userId() ? (
                    <>
                      {editing ? (
                        ""
                      ) : (
                        // Deletes the entire satellite and all its data
                        <Button
                          size={width && width < 500 ? "small" : "medium"}
                          variant="contained"
                          color="secondary"
                          onClick={handleDeleteDialog}
                          startIcon={width && width < 500 ? null : <Delete />}
                        >
                          Delete
                        </Button>
                      )}
                      {/* Conditionally renders edit button and changes to a Cancel button that deletes changes made to editing the satellite */}
                      <Button
                        size={width && width < 500 ? "small" : "medium"}
                        variant="contained"
                        color={editing && dirty ? "secondary" : "default"}
                        onClick={() => handleEdit(setValues, dirty, values)}
                        startIcon={
                          width && width < 500 ? null : editing ? (
                            dirty ? (
                              <Delete />
                            ) : null
                          ) : (
                            <Edit />
                          )
                        }
                      >
                        {editing ? "Cancel" : "Edit"}
                      </Button>
                      {editing ? null : (
                        <Button
                          size={width && width < 500 ? "small" : "medium"}
                          variant="contained"
                          onClick={handleClose}
                          startIcon={width && width < 500 ? null : <Close />}
                        >
                          Close
                        </Button>
                      )}
                      {editing && (
                        <Button
                          size={width && width < 500 ? "small" : "medium"}
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={!editing}
                          startIcon={width && width < 500 ? null : <Save />}
                          disabled={
                            Object.entries(errors).length > 0 ||
                            !dirty ||
                            Object.entries(touched).length === 0
                              ? true
                              : false
                          }
                        >
                          {isSubmitting ? (
                            <CircularProgress
                              size={25}
                              className={classes.loadingSave}
                            />
                          ) : newSat ? (
                            "Save"
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      size={width && width < 500 ? "small" : "medium"}
                      variant="contained"
                      onClick={handleClose}
                      startIcon={width && width < 500 ? null : <Close />}
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
