import React, { useState, useEffect, useContext } from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { emptyDataRemover } from "../utils/satelliteDataFuncs";
import { satelliteValidatorShaper } from "/imports/validation/satelliteYupShape";
import ProtectedFunctionality from "../Helpers/ProtectedFunctionality.jsx";
import { Formik, Form } from "formik";
import { _ } from "meteor/underscore";

// Components
import { SatelliteForm } from "./SatelliteForm";
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";
import { Gallery } from "../DataDisplays/Gallery.jsx";

// @material-ui
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, makeStyles, Typography, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import VerifiedIcon from "@material-ui/icons/CheckBoxOutlined";
import ValidatedIcon from "@material-ui/icons/LibraryAddCheckOutlined";
import RestorePageIcon from "@material-ui/icons/RestorePage";

const useStyles = makeStyles(() => ({
  modal: {
    width: "auto",
    height: "auto"
  },
  gallery: {
    display: "flex",
    justifyContent: "center",
    marginTop: -10
  },
  titleText: {
    fontSize: "25px",
    display: "flex",
    justifyContent: "space-between"
  },
  content: {
    marginTop: 0,
    overflowY: "auto"
  },
  description: {
    marginTop: 25,
    marginBottom: 15,
    margin: 5
  },
  loadingDialog: {
    textAlign: "center",
    margin: 50,
    overflow: "hidden"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    margin: "5px 10px 5px 10px"
  },
  loadingSave: {
    textAlign: "center",
    overflow: "hidden"
  },
  closeIcon: {
    padding: "0px 7px 0px 7px"
  }
}));

// breakpoints based on device width / height
const actionsBreak = 600;
const deleteButtonTextBreak = 825;

export const SatelliteModal = ({ show, newSat, initValues, handleClose, width, height, admin, dashboard }) => {
  const classes = useStyles();
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } = useContext(HelpersContext);

  const [editing, setEditing] = useState(false);
  const [editingOne, setEditingOne] = useState(false);
  const [satSchema, setSatSchema] = useState(null);

  const [username, schemas, isLoadingSch, isLoadingSat] = useTracker(() => {
    const subSch = Meteor.subscribe("schemas");
    const subSat = Meteor.subscribe("satellites");
    const schemas = SchemaCollection.find({ isDeleted: false }).fetch();
    const username = Meteor.user({ fields: { username: 1 } })?.username;
    return [username, schemas, !subSch.ready(), !subSat.ready()];
  });

  useEffect(() => {
    setEditing(dashboard ? newSat : newSat || false); // ensures that Add Satellite always opens as a new instance in edit-mode
  }, [newSat, show]);

  useEffect(() => {
    setSatSchema(satelliteValidatorShaper(initValues, initValues)); // generate new validation schema based on schema changes and the satellite being edited
  }, [initValues, show, isLoadingSch]);

  const handleSubmit = (values, { setSubmitting }) => {
    emptyDataRemover(values); // remove schemas that were added by the user but contain no entries

    if (newSat) {
      Meteor.call("addNewSatellite", initValues, values, (err, res) => {
        if (res || err) {
          console.log(res || err);
        } else {
          setOpenSnack(false);
          setSnack(
            <span>
              <strong>{values.names ? values.names[0].name : "New Satellite"}</strong> saved!
            </span>
          );
          setOpenSnack(true);
          setTimeout(() => setOpenSnack(false), 2000);
          setEditing(false);
          handleClose();
        }
      });
    } else {
      Meteor.call("updateSatellite", initValues, values, (err, res) => {
        if (res || err) {
          console.log(res || err);
        } else {
          setOpenSnack(false);
          setSnack(
            <span>
              Changes on <strong>{values.names ? values.names[0].name : "New Satellite"}</strong> saved!
            </span>
          );
          setOpenSnack(true);
          setTimeout(() => setOpenSnack(false), 2000);
        }
      });
    }
    setSubmitting(false);
    setEditing(false);
  };

  const handleDelete = (values) => {
    if (!admin) {
      Meteor.call("deleteSatellite", values, (err, res) => {
        if (res || err) {
          console.log(res || err);
        } else {
          setOpenAlert(false);
          handleClose();
          setOpenSnack(false);
          setSnack(
            <span>
              Deleted <strong>{values.names ? values.names[0].name : "N/A"}</strong>!
            </span>
          );
          setOpenSnack(true);
          setTimeout(() => setOpenSnack(false), 2000);
        }
      });
    } else {
      Meteor.call("actuallyDeleteSatellite", values, (err, res) => {
        if (res || err) {
          console.log(res || err);
        } else {
          setOpenAlert(false);
          setOpenSnack(false);
          setSnack(
            <span>
              Deleted <strong>{values.names ? values.names[0].name : "New Satellite"}</strong> forever!
            </span>
          );
          handleClose();
          setOpenSnack(true);
          setTimeout(() => setOpenSnack(false), 2000);
        }
      });
    }
  };

  const handleDeleteDialog = (values) => {
    setAlert({
      title: (
        <span>
          Delete <strong>{values.names ? values.names[0].name : "New Satellite"}</strong>?
        </span>
      ),
      text: (
        <span>
          Are you sure you want to delete <strong>{values.names ? values.names[0].name : "New Satellite"}</strong> and all of its data?
        </span>
      ),
      actions: (
        <Button size="small" variant="contained" color="secondary" disableElevation onClick={() => handleDelete(values)}>
          Confirm
        </Button>
      ),
      closeAction: "Cancel"
    });
    setOpenAlert(true);
  };

  const handleToggleEdit = async (setValues, values, setErrors) => {
    await emptyDataRemover(values);
    if (editing && newSat) handleClose();
    if (editing && !newSat) await setValues(initValues);
    setEditing(!editing);
    if (setErrors) setErrors({});
  };

  const handleEdit = (setValues, dirty, touched, values, setErrors) => {
    if ((editing || editingOne) && dirty && !_.isEmpty(touched)) {
      setAlert({
        title: (
          <span>
            Delete Changes Made To <strong>{values.names ? values.names[0].name : "New Satellite"}</strong>?
          </span>
        ),
        text: (
          <span>
            Are you sure you want to delete the changes you have made to <strong>{values.names ? values.names[0].name : "New Satellite"}</strong>?
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
              handleToggleEdit(setValues, values, setErrors);
            }}>
            Confirm
          </Button>
        ),
        closeAction: "Cancel"
      });
      setOpenAlert(true);
    } else {
      handleToggleEdit(setValues, values, setErrors);
    }
  };

  const handleVerifyData = (values, setValues) => {
    if (admin) {
      Meteor.call("checkSatelliteData", values, "verify", "user", (err, res) => {
        if (err) {
          console.log(err);
        } else {
          setOpenAlert(false);
          setOpenSnack(false);
          setSnack(
            <span>
              Verified data for <strong>{values.names ? values.names[0].name : "N/A"}</strong>!
            </span>
          );
          setOpenSnack(true);
          setTimeout(() => setOpenSnack(false), 2000);
          setValues(res);
        }
      });
    }
  };

  const handleValidateData = (values, setValues) => {
    if (admin) {
      Meteor.call("checkSatelliteData", values, "validate", "user", (err, res) => {
        if (err) {
          console.log(err);
        } else {
          setOpenAlert(false);
          setOpenSnack(false);
          setSnack(
            <span>
              Validated data for <strong>{values.names ? values.names[0].name : "N/A"}</strong>!
            </span>
          );
          setOpenSnack(true);
          setTimeout(() => setOpenSnack(false), 2000);
          setValues(res);
        }
      });
    }
  };

  const handleRestore = (values) => {
    Meteor.call("restoreSatellite", initValues, (err, res) => {
      if (res || err) {
        console.log(res || err);
      } else {
        setOpenAlert(false);
        setOpenSnack(false);
        setSnack(
          <span>
            Restored <strong>{values?.names[0]?.name}</strong>!
          </span>
        );
        handleClose();
        setOpenSnack(true);
        setTimeout(() => setOpenSnack(false), 2000);
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
      <Dialog open={show} maxWidth="lg" fullWidth scroll="body">
        <div className={classes.modal}>
          <DialogTitle>
            <Typography className={classes.titleText}>
              <span>
                {newSat ? (
                  <React.Fragment>
                    Creating <strong>New Satellite</strong>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    Editing <strong>{initValues.names && initValues.names[0] ? initValues.names[0].name : "New Satellite"}</strong>
                  </React.Fragment>
                )}
              </span>
              <IconButton
                size="small"
                onClick={() => {
                  handleClose();
                  setTimeout(() => setEditingOne(false), 500);
                }}
                className={classes.closeIcon}>
                <CloseIcon />
              </IconButton>
            </Typography>
          </DialogTitle>
          <Formik initialValues={initValues} onSubmit={handleSubmit} validationSchema={satSchema}>
            {({ errors, setErrors, isSubmitting, isValid, isValidating, values, setValues, setFieldValue, dirty, touched, setTouched }) => (
              <Form>
                {isLoadingSch || isLoadingSat ? (
                  <DialogContent className={classes.loadingDialog}>
                    <CircularProgress size={75} />
                  </DialogContent>
                ) : (
                  <DialogContent className={classes.content} style={decideHeight()}>
                    <div className={classes.gallery}>
                      <Gallery initValues={initValues} width={width} modal={true} />
                    </div>
                    <Typography className={classes.description}>
                      Last change made by <strong>{`${values.modifiedBy || username}`}</strong> on{" "}
                      <strong>{values.modifiedOn ? `${values.modifiedOn}` : `${new Date()}`}</strong>
                    </Typography>
                    <SatelliteForm
                      setOpenSnack={setOpenSnack}
                      setSnack={setSnack}
                      editingOne={editingOne}
                      setEditingOne={setEditingOne}
                      errors={errors}
                      setErrors={setErrors}
                      values={values}
                      schemas={schemas}
                      setValues={setValues}
                      setFieldValue={setFieldValue}
                      editing={editing}
                      initValues={initValues}
                      setSatSchema={setSatSchema}
                      satelliteValidatorShaper={satelliteValidatorShaper}
                      setTouched={setTouched}
                      touched={touched}
                    />
                  </DialogContent>
                )}
                <DialogActions className={classes.actions}>
                  {!editing && !editingOne && (
                    <ProtectedFunctionality
                      component={() => {
                        return (
                          <React.Fragment>
                            <Button
                              size={width && width < actionsBreak ? "small" : "medium"}
                              variant="contained"
                              color="secondary"
                              startIcon={width && width < actionsBreak ? null : <DeleteIcon />}
                              onClick={() => handleDeleteDialog(values)}>
                              {admin && width > deleteButtonTextBreak ? "Delete Forever" : "Delete"}
                            </Button>
                            {admin && values.isDeleted ? (
                              <Button
                                size={width && width < actionsBreak ? "small" : "medium"}
                                variant="contained"
                                color="primary"
                                onClick={() => handleRestore(values)}
                                startIcon={width && width < actionsBreak ? null : <RestorePageIcon />}>
                                Restore
                              </Button>
                            ) : null}
                          </React.Fragment>
                        );
                      }}
                      loginRequired={true}
                    />
                  )}
                  {!editingOne && (
                    <ProtectedFunctionality
                      component={() => {
                        return (
                          <Button
                            size={width && width < actionsBreak ? "small" : "medium"}
                            variant="contained"
                            color={editing && dirty && !_.isEmpty(touched) ? "secondary" : "default"}
                            onClick={() => {
                              handleEdit(setValues, dirty, touched, values, setErrors);
                            }}
                            startIcon={
                              width && width < actionsBreak ? null : editing ? dirty && !_.isEmpty(touched) ? <DeleteIcon /> : null : <EditIcon />
                            }>
                            {editing ? "Cancel" : "Edit"}
                          </Button>
                        );
                      }}
                      loginRequired={true}
                    />
                  )}
                  {!editing && !editingOne && admin && !values.isDeleted && !values.adminCheck && (
                    <React.Fragment>
                      <Button
                        size={width && width < actionsBreak ? "small" : "medium"}
                        variant="contained"
                        color="primary"
                        onClick={() => handleVerifyData(values, setValues)}
                        startIcon={width && width < actionsBreak ? null : <VerifiedIcon />}>
                        Verify
                      </Button>
                      <Button
                        size={width && width < actionsBreak ? "small" : "medium"}
                        variant="contained"
                        color="primary"
                        onClick={() => handleValidateData(values, setValues)}
                        startIcon={width && width < actionsBreak ? null : <ValidatedIcon />}>
                        Validate
                      </Button>
                    </React.Fragment>
                  )}
                  {!editing && !editingOne && (
                    <Button
                      size={width && width < actionsBreak ? "small" : "medium"}
                      variant="contained"
                      onClick={() => {
                        handleClose();
                        setEditingOne(false);
                        setErrors({});
                      }}
                      startIcon={width && width < actionsBreak ? null : <CloseIcon />}>
                      Close
                    </Button>
                  )}
                  {editing && !editingOne && (
                    <Button
                      size={width && width < actionsBreak ? "small" : "medium"}
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={width && width < actionsBreak ? null : <SaveIcon />}
                      disabled={isValidating || isSubmitting || !isValid || _.isEmpty(touched) ? true : false}>
                      {isSubmitting || isValidating ? (
                        <CircularProgress size={25} className={classes.loadingSave} />
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

// Prop checking
SatelliteModal.propTypes = {
  show: PropTypes.bool,
  newSat: PropTypes.bool,
  initValues: PropTypes.object,
  handleClose: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  admin: PropTypes.bool,
  dashboard: PropTypes.bool
};
