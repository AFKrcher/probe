import React, { useState, useEffect, useContext } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";
import { SatelliteCollection } from "../../api/satellites";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import {
  emptyDataRemover,
  satelliteValidatorShaper,
} from "../utils/satelliteDataFuncs.js";
import ProtectedFunctionality from "../utils/ProtectedFunctionality.jsx";

// Components
import { Formik, Form } from "formik";
import { SatelliteForm } from "./SatelliteForm";
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";
import { Gallery } from "../DataDisplays/Gallery.jsx";

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
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import RestorePageIcon from "@material-ui/icons/RestorePage";

const useStyles = makeStyles(() => ({
  modal: {
    width: "auto",
    height: "auto",
  },
  gallery: {
    display: "flex",
    justifyContent: "center",
    marginTop: -15,
  },
  title: {
    marginBottom: -5,
    marginTop: -5,
  },
  titleText: {
    fontSize: "25px",
  },
  content: {
    marginTop: -15,
    overflowY: "auto",
    marginTop: 0,
  },
  description: {
    marginTop: 25,
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
    margin: "5px 10px 5px 10px",
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
  height,
  admin,
  path,
}) => {
  const classes = useStyles();
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

  const [editing, setEditing] = useState(false);
  const [editingOne, setEditingOne] = useState(false);
  const [satSchema, setSatSchema] = useState(null);

  const [user, schemas, sats, isLoadingSch, isLoadingSat] = useTracker(() => {
    const subSch = Meteor.subscribe("schemas");
    const subSat = Meteor.subscribe("satellites");
    const schemas = SchemaCollection.find().fetch();
    const sats = SatelliteCollection.find().fetch();
    const user = Meteor.user();
    return [user, schemas, sats, !subSch.ready(), !subSat.ready()];
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
          (initValues[path].length > 0 ? initValues[path][entry][field] : false)
            ? null
            : list.push(satEntries[entry][field]);
        }
      }
    }
    return list;
  };

  useEffect(() => {
    setEditing(path ? true : newSat || false); // ensures that Add Satellite always opens as a new instance in edit-mode
  }, [newSat, show]);

  useEffect(() => {
    setSatSchema(satelliteValidatorShaper(schemas, initValues, isUniqueList)); // generate new validation schema based on schema changes and the satellite being edited
  }, [initValues, show, isLoadingSch]);

  const handleSubmit = (values, { setSubmitting }) => {
    emptyDataRemover(values); // remove schemas that were added by the user but contain no entries

    if (newSat) {
      Meteor.call("addNewSatellite", values, initValues, (err, res) => {
        if (res || err) {
          console.log(res || err);
        } else {
          setOpenSnack(false);
          setSnack(
            <span>
              <strong>{values.names[0].name}</strong> saved!
            </span>
          );
          setOpenSnack(true);
          setEditing(false);
          handleClose();
        }
      });
    } else {
      Meteor.call("updateSatellite", values, initValues, (err, res) => {
        if (res || err) {
          console.log(res || err);
        } else {
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
      });
    }
    setSubmitting(false);
    setEditing(false);
  };

  const handleDelete = () => {
    if (!admin) {
      Meteor.call("deleteSatellite", initValues, (err, res) => {
        if (res || err) {
          console.log(res || err);
        } else {
          setOpenAlert(false);
          handleClose();
          setOpenSnack(false);
          setSnack(
            <span>
              Deleted{" "}
              <strong>
                {initValues.names ? initValues.names[0].name : "N/A"}
              </strong>
              !
            </span>
          );
          setOpenSnack(true);
        }
      });
    } else {
      Meteor.call("actuallyDeleteSatellite", initValues, (err, res) => {
        if (res || err) {
          console.log(res || err);
        } else {
          setOpenAlert(false);
          setOpenSnack(false);
          setSnack(
            <span>
              Deleted{" "}
              <strong>
                {initValues.names ? initValues.names[0].name : "N/A"}
              </strong>{" "}
              forever!
            </span>
          );
          handleClose();
          setOpenSnack(true);
        }
      });
    }
  };

  const handleDeleteDialog = () => {
    setAlert({
      title: (
        <span>
          Delete{" "}
          <strong>{initValues.names ? initValues.names[0].name : "N/A"}</strong>
          ?
        </span>
      ),
      text: (
        <span>
          Are you sure you want to delete{" "}
          <strong>{initValues.names ? initValues.names[0].name : "N/A"}</strong>{" "}
          and all of its data?
        </span>
      ),
      actions: (
        <Button
          size="small"
          variant="contained"
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

  const handleToggleEdit = (setValues, values) => {
    emptyDataRemover(values);
    if (editing) setValues(initValues);
    if (newSat && editing) handleClose();
    setEditing(!editing);
  };

  const handleEdit = (setValues, dirty, touched, values) => {
    if (editing && dirty && Object.keys(touched).length) {
      setAlert({
        title: initValues.names ? (
          <span>
            Delete changes on{" "}
            <strong>
              {initValues.names ? initValues.names[0].name : "N/A"}
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
              {initValues.names ? initValues.names[0].name : "N/A"}
            </strong>{" "}
            and its data?
          </span>
        ) : (
          <span>
            Are you sure you want to delete all the changes made to this new
            satellite?
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
              handleToggleEdit(setValues, values);
            }}
          >
            Confirm
          </Button>
        ),
        closeAction: "Cancel",
      });
      setOpenAlert(true);
    } else {
      handleToggleEdit(setValues, values);
    }
  };

  const handleApprove = () => {
    if (admin) {
      Meteor.call("adminCheckSatellite", initValues, (err, res) => {
        if (res || err) {
          console.log(res || err);
        } else {
          setOpenAlert(false);
          setOpenSnack(false);
          setSnack(
            <span>
              Approved changes to{" "}
              <strong>
                {initValues.names ? initValues.names[0].name : "N/A"}
              </strong>
              !
            </span>
          );
          handleClose();
          setOpenSnack(true);
        }
      });
    }
  };

  const handleRestore = () => {
    Meteor.call("restoreSatellite", initValues, (err, res) => {
      if (res || err) {
        console.log(res || err);
      } else {
        setOpenAlert(false);
        setOpenSnack(false);
        setSnack(
          <span>
            Restored <strong>{initValues.name}</strong> schema!
          </span>
        );
        handleClose();
        setOpenSnack(true);
      }
    });
  };

  const decideHeight = () => {
    let decidedHeight = `${0.043 * height + 36}vh`;
    if (height > 1000) decidedHeight = "80vh";
    return { height: decidedHeight };
  };

  return (
    <React.Fragment>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      <Dialog open={show} scroll="paper" maxWidth="md">
        <div className={classes.modal}>
          <DialogTitle className={classes.title}>
            <Typography className={classes.titleText}>
              {newSat || path ? (
                <React.Fragment>
                  Creating <strong>New Satellite</strong>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  Editing{" "}
                  <strong>
                    {initValues.names && initValues.names[0]
                      ? initValues.names[0].name
                      : "N/A"}
                  </strong>
                </React.Fragment>
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={initValues}
            onSubmit={handleSubmit}
            validationSchema={satSchema}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({
              errors,
              isSubmitting,
              values,
              setValues,
              setFieldValue,
              dirty,
              touched,
              setTouched,
            }) => (
              <Form>
                {isLoadingSch || isLoadingSat ? (
                  <DialogContent className={classes.loadingDialog}>
                    <CircularProgress size={75} />
                  </DialogContent>
                ) : (
                  <DialogContent
                    className={classes.content}
                    style={decideHeight()}
                  >
                    <div className={classes.gallery}>
                      <Gallery initValues={initValues} />
                    </div>
                    <Typography className={classes.description}>
                      Last change made by{" "}
                      <strong>{`${values.modifiedBy || user.username}`}</strong>{" "}
                      on{" "}
                      <strong>
                        {values.modifiedOn
                          ? `${values.modifiedOn}`
                          : `${new Date()}`}
                      </strong>
                    </Typography>
                    <SatelliteForm
                      setOpenSnack={setOpenSnack}
                      setSnack={setSnack}
                      editingOne={editingOne}
                      setEditingOne={setEditingOne}
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
                      satelliteValidatorShaper={satelliteValidatorShaper}
                      setTouched={setTouched}
                      dirty={dirty}
                      newSat={newSat}
                    />
                  </DialogContent>
                )}
                <DialogActions className={classes.actions}>
                  {editing || editingOne ? null : (
                    <ProtectedFunctionality
                      component={() => {
                        return (
                          <React.Fragment>
                            <Button
                              size={width && width < 500 ? "small" : "medium"}
                              variant="contained"
                              color="secondary"
                              startIcon={
                                width && width < 500 ? null : <DeleteIcon />
                              }
                              onClick={handleDeleteDialog}
                            >
                              {admin && width > 825
                                ? "Delete Forever"
                                : "Delete"}
                            </Button>
                            {admin ? (
                              <Button
                                size={width && width < 500 ? "small" : "medium"}
                                variant="contained"
                                color="primary"
                                onClick={handleRestore}
                                startIcon={
                                  width && width < 500 ? null : (
                                    <RestorePageIcon />
                                  )
                                }
                              >
                                Restore
                              </Button>
                            ) : null}
                          </React.Fragment>
                        );
                      }}
                      loginRequired={true}
                    />
                  )}
                  {!editingOne ? (
                    <ProtectedFunctionality
                      component={() => {
                        return (
                          <Button
                            size={width && width < 500 ? "small" : "medium"}
                            variant="contained"
                            color={
                              editing && dirty && Object.keys(touched).length
                                ? "secondary"
                                : "default"
                            }
                            onClick={() =>
                              handleEdit(setValues, dirty, touched, values)
                            }
                            startIcon={
                              width && width < 500 ? null : editing ? (
                                dirty && Object.keys(touched).length ? (
                                  <DeleteIcon />
                                ) : null
                              ) : (
                                <EditIcon />
                              )
                            }
                          >
                            {editing ? "Cancel" : "Edit"}
                          </Button>
                        );
                      }}
                      loginRequired={true}
                    />
                  ) : null}
                  {!editing && admin && !values.isDeleted && (
                    <Button
                      size={width && width < 500 ? "small" : "medium"}
                      variant="contained"
                      color="primary"
                      onClick={handleApprove}
                      startIcon={width && width < 500 ? null : <CheckIcon />}
                    >
                      Approve
                    </Button>
                  )}
                  {editing ? null : (
                    <Button
                      size={width && width < 500 ? "small" : "medium"}
                      variant="contained"
                      onClick={handleClose}
                      startIcon={width && width < 500 ? null : <CloseIcon />}
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
                      startIcon={width && width < 500 ? null : <SaveIcon />}
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
                </DialogActions>
              </Form>
            )}
          </Formik>
        </div>
      </Dialog>
    </React.Fragment>
  );
};
