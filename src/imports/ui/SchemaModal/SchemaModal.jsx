import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { Formik, Form } from "formik";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { schemaValidatorShaper } from "/imports/validation/schemaYupShape";
import useWindowSize from "../Hooks/useWindowSize.jsx";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CheckIcon from "@material-ui/icons/Check";
import RestorePageIcon from "@material-ui/icons/RestorePage";

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: 10,
    marginTop: 0,
  },
  titleText: {
    fontSize: "25px",
  },
  content: {
    marginTop: -15,
    overflowY: "auto",
  },
  description: {
    marginTop: -20,
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

// breakpoints based on device width / height
const actionsBreak = 600;
const deleteButtonTextBreak = 825;

export const SchemaModal = ({
  show,
  newSchema,
  initValues,
  handleClose,
  admin,
}) => {
  const classes = useStyles();

  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

  const [width, height] = useWindowSize();

  const [editing, setEditing] = useState(newSchema || false);

  const [user, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const user = Meteor.user();
    return [user, !sub.ready()];
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
                New <strong>{values.name}</strong> schema saved!
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
                Changes on <strong>{values.name}</strong> schema saved!
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
              Deleted <strong>{initValues.name}</strong> schema!
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
              Deleted <strong>{initValues.name}</strong> schema forever!
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
          Delete <strong>{initValues.name}</strong> Schema Forever?
        </span>
      ) : (
        <span>
          Delete <strong>{initValues.name}</strong> Schema?
        </span>
      ),
      text: admin ? (
        <span>
          Are you sure you want to delete the <strong>{initValues.name}</strong>{" "}
          schema forever?
        </span>
      ) : (
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

  const handleToggleEdit = async (setValues, setErrors) => {
    if (editing) await setValues(initValues);
    if (newSchema && editing) handleClose();
    setEditing(!editing);
    if (setErrors) setErrors({});
  };

  const handleEdit = (dirty, setValues, setErrors, values) => {
    if (editing && dirty) {
      console.log({
        title: (
          <span>
            Delete changes on <strong>{values.name || "new schema"}</strong>?
          </span>
        ),
        text: (
          <span>
            Are you sure you want to cancel all changes made to{" "}
            <strong>{values.name}</strong> schema and its fields?
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
            }}
          >
            Confirm
          </Button>
        ),
        closeAction: "Cancel",
      });
      console.log(true);
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
          console.log(false);
          setOpenSnack(false);
          setSnack(
            <span>
              Approved <strong>{initValues.name}</strong> schema changes!
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
        console.log(false);
        setOpenSnack(false);
        setSnack(
          <span>
            Restored <strong>{initValues.name}</strong> schema!
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
        <DialogTitle className={classes.title}>
          <Typography className={classes.titleText}>
            {newSchema ? (
              "Create New Schema"
            ) : (
              <React.Fragment>
                Editing <strong>{initValues.name || "N/A"}</strong>
              </React.Fragment>
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={initValues}
          validationSchema={schemaValidatorShaper(initValues.name)}
          onSubmit={handleSubmit}
        >
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
            dirty,
          }) => (
            <Form>
              {isLoading ? (
                <DialogContent className={classes.loadingDialog}>
                  <CircularProgress size={75} />
                </DialogContent>
              ) : (
                <DialogContent
                  className={classes.content}
                  style={decideHeight()}
                >
                  <Typography className={classes.description}>
                    {user ? (
                      <React.Fragment>
                        Last change made by{" "}
                        <strong>{`${
                          values.modifiedBy || user.username
                        }`}</strong>{" "}
                        on{" "}
                        <strong>
                          {values.modifiedOn
                            ? `${values.modifiedOn}`
                            : `${new Date()}`}
                        </strong>
                      </React.Fragment>
                    ) : null}
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
                                startIcon={
                                  width < actionsBreak ? null : <DeleteIcon />
                                }
                                onClick={handleDeleteDialog}
                              >
                                {admin && width > deleteButtonTextBreak
                                  ? "Delete Forever"
                                  : "Delete"}
                              </Button>
                              {admin && values.isDeleted ? (
                                <Button
                                  size={
                                    width < actionsBreak ? "small" : "medium"
                                  }
                                  variant="contained"
                                  color="primary"
                                  onClick={handleRestore}
                                  startIcon={
                                    width < actionsBreak ? null : (
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
                  </React.Fragment>
                )}
                <ProtectedFunctionality
                  component={() => {
                    return (
                      <Button
                        size={width < actionsBreak ? "small" : "medium"}
                        variant="contained"
                        color={editing && dirty ? "secondary" : "default"}
                        startIcon={
                          width < actionsBreak ? null : editing ? (
                            dirty ? (
                              <DeleteIcon />
                            ) : null
                          ) : (
                            <EditIcon />
                          )
                        }
                        onClick={() =>
                          handleEdit(dirty, setValues, setErrors, values)
                        }
                      >
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
                    startIcon={width < actionsBreak ? null : <CheckIcon />}
                  >
                    Approve
                  </Button>
                )}
                {!editing && (
                  <Button
                    size={width < actionsBreak ? "small" : "medium"}
                    variant="contained"
                    onClick={handleClose}
                    startIcon={width < actionsBreak ? null : <CloseIcon />}
                  >
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
                    disabled={
                      !_.isEmpty(errors) || !dirty || isValidating
                        ? true
                        : false
                    }
                  >
                    {isSubmitting || isValidating ? (
                      <CircularProgress
                        size={24}
                        className={classes.loadingSave}
                      />
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
  admin: PropTypes.bool,
};
