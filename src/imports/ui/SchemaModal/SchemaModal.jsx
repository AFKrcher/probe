import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { Formik, Form } from "formik";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { schemaValidatorShaper } from "/imports/validation/schemaYupShape";
import useWindowSize from "../hooks/useWindowSize.jsx";
import ProtectedFunctionality from "../Helpers/ProtectedFunctionality.jsx";
import { _ } from "meteor/underscore";

// Components
import { SchemaForm } from "./SchemaForm";
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
  Typography,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CheckIcon from "@material-ui/icons/Check";
import RestorePageIcon from "@material-ui/icons/RestorePage";

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: 10
  },
  title: {
    fontSize: "25px",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: -5
  },
  modifiedOn: {
    color: theme.palette.text.disabled
  },
  content: {
    marginTop: -15,
    overflowY: "auto"
  },
  description: {
    marginTop: -20,
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
  }
}));

// breakpoints based on device width / height
const actionsBreak = 600;
const deleteButtonTextBreak = 825;

export const SchemaModal = ({ show, newSchema, initValues, handleClose, admin }) => {
  const classes = useStyles();

  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } = useContext(HelpersContext);

  const [width, height] = useWindowSize();

  const [editing, setEditing] = useState(newSchema || false);

  const [username, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const username = Meteor.user({ fields: { username: 1 } })?.username;
    return [username, !sub.ready()];
  });

  useEffect(() => {
    setEditing(newSchema || false);
  }, [newSchema, show]);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (values) {
      if (newSchema) {
        handleClose();
        Meteor.call("addNewSchema", initValues, values, (err, res) => {
          if (res || err) {
            console.log(res?.toString() || err?.reason);
          } else {
            setOpenSnack(false);
            setSnack(
              <span>
                New <b>{values.name}</b> schema saved!
              </span>
            );
            setOpenSnack(true);
            setTimeout(() => setOpenSnack(false), 2000);
          }
        });
      } else {
        Meteor.call("updateSchema", initValues, values, (err, res) => {
          if (res || err) {
            console.log(res?.toString() || err?.reason);
          } else {
            setOpenSnack(false);
            setSnack(
              <span>
                Changes on <b>{values.name}</b> schema saved!
              </span>
            );
            setOpenSnack(true);
            setTimeout(() => setOpenSnack(false), 2000);
          }
        });
      }
      setTimeout(() => {
        setSubmitting(false);
        setEditing(false);
      });
    }
  };

  const handleDelete = () => {
    if (!admin) {
      Meteor.call("deleteSchema", initValues, (err, res) => {
        if (res || err) {
          console.log(res?.toString() || err?.reason);
        } else {
          setOpenAlert(false);
          setOpenSnack(false);
          setSnack(
            <span>
              Deleted <b>{initValues.name}</b> schema!
            </span>
          );
          handleClose();
          setOpenSnack(true);
          setTimeout(() => setOpenSnack(false), 2000);
        }
      });
    } else {
      Meteor.call("actuallyDeleteSchema", initValues, (err, res) => {
        if (res || err) {
          console.log(res?.toString() || err?.reason);
        } else {
          setOpenAlert(false);
          setOpenSnack(false);
          setSnack(
            <span>
              Deleted <b>{initValues.name}</b> schema forever!
            </span>
          );
          handleClose();
          setOpenSnack(true);
          setTimeout(() => setOpenSnack(false), 2000);
        }
      });
    }
  };

  const handleDeleteDialog = () => {
    setAlert({
      title: admin ? (
        <span>
          Delete <b>{initValues.name}</b> Schema Forever?
        </span>
      ) : (
        <span>
          Delete <b>{initValues.name}</b> Schema?
        </span>
      ),
      text: admin ? (
        <span>
          Are you sure you want to delete the <b>{initValues.name}</b> schema forever?
        </span>
      ) : (
        <span>
          Are you sure you want to delete the <b>{initValues.name}</b> schema and all of its fields?
        </span>
      ),
      actions: (
        <Button variant="contained" size="small" color="secondary" disableElevation onClick={handleDelete}>
          Confirm
        </Button>
      ),
      closeAction: "Cancel"
    });
    setOpenAlert(true);
  };

  const handleToggleEdit = async (setValues, setErrors) => {
    if (editing) await setValues(initValues);
    if (newSchema && editing) handleClose();
    setEditing(!editing);
    if (setErrors) setErrors({});
  };

  const handleEdit = (dirty, setValues, setErrors, values) => {
    if (editing && dirty) {
      setAlert({
        title: (
          <span>
            Delete changes on <b>{values.name || "new schema"}</b>?
          </span>
        ),
        text: (
          <span>
            Are you sure you want to cancel all changes made to <b>{values.name}</b> schema and its fields?
          </span>
        ),
        actions: (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            disableElevation
            onClick={() => {
              handleToggleEdit(setValues, setErrors);
              setOpenAlert(false);
            }}>
            Confirm
          </Button>
        ),
        closeAction: "Cancel"
      });
      setOpenAlert(true);
    } else {
      handleToggleEdit(setValues);
    }
  };

  const handleApprove = () => {
    if (admin) {
      Meteor.call("adminCheckSchema", initValues, (err, res) => {
        if (res || err) {
          console.log(res?.toString() || err?.reason);
        } else {
          setOpenSnack(false);
          setSnack(
            <span>
              Approved <b>{initValues.name}</b> schema changes!
            </span>
          );
          handleClose();
          setOpenSnack(true);
          setTimeout(() => setOpenSnack(false), 2000);
        }
      });
    }
  };

  const handleRestore = () => {
    Meteor.call("restoreSchema", initValues, (err, res) => {
      if (res || err) {
        console.log(res?.toString() || err?.reason);
      } else {
        setOpenSnack(false);
        setSnack(
          <span>
            Restored <b>{initValues.name}</b> schema!
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
      <Dialog open={show} maxWidth="md" fullWidth scroll="body">
        <Formik
          initialValues={initValues}
          validationSchema={schemaValidatorShaper(initValues.name)}
          onSubmit={handleSubmit}>
          {({
            errors,
            setErrors,
            isSubmitting,
            isValidating,
            values,
            touched,
            setValues,
            setFieldValue,
            initValues,
            dirty
          }) => (
            <Form>
              <DialogTitle className={classes.header}>
                <Typography className={classes.title}>
                  <span>
                    <React.Fragment>
                      Editing <b>{values?.name || "New Schema"}</b>
                    </React.Fragment>
                  </span>
                  <IconButton size="small" onClick={handleClose} className={classes.closeIcon}>
                    <CloseIcon />
                  </IconButton>
                </Typography>
                <Typography variant="caption" className={classes.modifiedOn}>
                  Last change made by <b>{`${values.modifiedBy || username}`}</b> on{" "}
                  <b>{values.modifiedOn ? `${values.modifiedOn}` : `${new Date()}`}</b>
                </Typography>
              </DialogTitle>
              {isLoading ? (
                <DialogContent className={classes.loadingDialog}>
                  <CircularProgress size={75} />
                </DialogContent>
              ) : (
                <DialogContent className={classes.content} style={decideHeight()}>
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
              )}
              <DialogActions className={classes.actions}>
                {!newSchema && (
                  <React.Fragment>
                    {!editing && (
                      <ProtectedFunctionality
                        component={() => {
                          return (
                            <React.Fragment>
                              <Button
                                size={width < actionsBreak ? "small" : "medium"}
                                variant="contained"
                                color="secondary"
                                startIcon={width < actionsBreak ? null : <DeleteIcon />}
                                onClick={handleDeleteDialog}>
                                {admin && width > deleteButtonTextBreak ? "Delete Forever" : "Delete"}
                              </Button>
                              {admin && values.isDeleted ? (
                                <Button
                                  size={width < actionsBreak ? "small" : "medium"}
                                  variant="contained"
                                  color="primary"
                                  onClick={handleRestore}
                                  startIcon={width < actionsBreak ? null : <RestorePageIcon />}>
                                  Restore
                                </Button>
                              ) : null}
                            </React.Fragment>
                          );
                        }}
                        loginRequired={true}
                      />
                    )}
                  </React.Fragment>
                )}
                <ProtectedFunctionality
                  component={() => {
                    return (
                      <Button
                        size={width < actionsBreak ? "small" : "medium"}
                        variant="contained"
                        color={editing && dirty ? "secondary" : "default"}
                        startIcon={width < actionsBreak ? null : editing ? dirty ? <DeleteIcon /> : null : <EditIcon />}
                        onClick={() => handleEdit(dirty, setValues, setErrors, values)}>
                        {editing ? "Cancel" : "Edit"}
                      </Button>
                    );
                  }}
                  loginRequired={true}
                />

                {!editing && admin && !values.isDeleted && (
                  <Button
                    size={width < actionsBreak ? "small" : "medium"}
                    variant="contained"
                    color="primary"
                    onClick={handleApprove}
                    startIcon={width < actionsBreak ? null : <CheckIcon />}>
                    Approve
                  </Button>
                )}
                {!editing && (
                  <Button
                    size={width < actionsBreak ? "small" : "medium"}
                    variant="contained"
                    onClick={handleClose}
                    startIcon={width < actionsBreak ? null : <CloseIcon />}>
                    Close
                  </Button>
                )}
                {editing && (
                  <Button
                    size={width < actionsBreak ? "small" : "medium"}
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={width < actionsBreak ? null : <SaveIcon />}
                    disabled={!_.isEmpty(errors) || !dirty || isValidating ? true : false}>
                    {isSubmitting || isValidating ? (
                      <CircularProgress size={24} className={classes.loadingSave} />
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
      </Dialog>
    </React.Fragment>
  );
};

// Prop checking
SchemaModal.propTypes = {
  show: PropTypes.bool,
  newSchema: PropTypes.bool,
  initValues: PropTypes.object,
  handleClose: PropTypes.func,
  admin: PropTypes.bool
};
