import React, { useState, useEffect, useContext } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";
import { SatelliteCollection } from "../../api/satellites";
import HelpersContext from "../helpers/HelpersContext.jsx";
import {
  emptyDataRemover,
  satelliteValidatorShaper,
} from "../utils/satelliteDataFuncs.js";

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

const useStyles = makeStyles(() => ({
  modal: {
    width: "auto",
    height: "auto"
  },
  titleText: {
    fontSize: "25px",
  },
  content: {
    height: "75vh",
    overflowY: "auto"
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

export const SatelliteModal = ({ show, newSat, initValues, handleClose }) => {
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

  const classes = useStyles();

  const [schemas, sats, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemas = SchemaCollection.find().fetch();
    const sats = SatelliteCollection.find().fetch();
    return [schemas, sats, !sub.ready()];
  });

  const [editing, setEditing] = useState(newSat || false);

  const isUniqueList = (path, field) => {
    let list = [];
    if (!path) {
      for (let sat in sats) {
        sats[sat][field] === initValues[field]
          ? null
          : list.push(sats[sat][field]);
      }
    } else {
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

  useEffect(() => {
    setEditing(newSat || false);
  }, [newSat, show]);

  const handleSubmit = async (values, { setSubmitting }) => {
    emptyDataRemover(values);
    window.sessionStorage.clear();

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

  const handleEdit = (setValues, dirty) => {
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
            validationSchema={satelliteValidatorShaper(schemas, isUniqueList)}
            onSubmit={handleSubmit}
            validateOnChange={true}
          >
            {({
              errors,
              isSubmitting,
              values,
              setValues,
              setFieldValue,
              dirty,
            }) => (
              <Form>
                {isLoading ? (
                  <DialogContent className={classes.loadingDialog}>
                    <CircularProgress size={75} />
                  </DialogContent>
                ) : (
                  <DialogContent className={classes.content}>
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
                    />
                  </DialogContent>
                )}
                <DialogActions className={classes.actions}>
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
                    color={editing ? "secondary" : ""}
                    onClick={() => handleEdit(setValues, dirty)}
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
                  {editing && (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!editing}
                      startIcon={<Save />}
                      disabled={
                        Object.entries(errors).length > 0 || !dirty
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
                </DialogActions>
              </Form>
            )}
          </Formik>
        </div>
      </Dialog>
    </>
  );
};
