import React, { useState, useEffect, useContext } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { Formik, Form } from "formik";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { schemaValidatorShaper } from "../utils/schemaDataFuncs.js";
import useWindowSize from "../Hooks/useWindowSize.jsx";
import ProtectedFunctionality from "../utils/ProtectedFunctionality.jsx";

// Components
import { SchemaForm } from "./SchemaForm";
import { SchemaCollection } from "../../api/schemas";
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
import Close from "@material-ui/icons/Close";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";

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

export const SchemaModal = ({ show, newSchema, initValues, handleClose }) => {
  const classes = useStyles();

  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

  const [width] = useWindowSize();

  const [editing, setEditing] = useState(newSchema || false);

  const [schemas, user, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemas = SchemaCollection.find().fetch();
    const user = Meteor.user();
    return [schemas, user, !sub.ready()];
  });

  const uniqueNames = (initValues, schemas) => {
    return schemas.map((schema) => {
      if (initValues.name !== schema.name) {
        return schema.name;
      }
    });
  };

  useEffect(() => {
    setEditing(newSchema || false);
  }, [newSchema, show]);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (values) {
      if (newSchema) {
        handleClose();
        Meteor.call("addNewSchema", initValues, values, user, (err, res) => {
          if (res || err) {
            console.err(res || err);
          } else {
            setOpenSnack(false);
            setSnack(
              <span>
                New <strong>{values.name}</strong> schema saved!
              </span>
            );
            setOpenSnack(true);
          }
        });
      } else {
        Meteor.call("updateSchema", initValues, values, user, (err, res) => {
          if (res || err) {
            console.err(res || err);
          } else {
            setOpenSnack(false);
            setSnack(
              <span>
                Changes on <strong>{values.name}</strong> schema saved!
              </span>
            );
            setOpenSnack(true);
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
    Meteor.call("deleteSchema", initValues, user, (err, res) => {
      if (res || err) {
        console.err(res || err);
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
      }
    });
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
            <Typography className={classes.titleText}>
              {newSchema ? (
                "Create New Schema"
              ) : (
                <>
                  Editing <strong>{initValues.name || "N/A"}</strong>
                </>
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={initValues}
            validationSchema={schemaValidatorShaper(
              initValues,
              uniqueNames,
              schemas
            )}
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
              isValidating,
            }) => (
              <Form>
                {isLoading ? (
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
                      Each schema is built to store sets of data that
                      characterize a satellite. Data fields can be added,
                      modified, or deleted below.
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
                              <Button
                                size={width && width < 500 ? "small" : "medium"}
                                variant="contained"
                                color="secondary"
                                startIcon={
                                  width && width < 500 ? null : <Delete />
                                }
                                onClick={handleDeleteDialog}
                              >
                                Delete
                              </Button>
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
                          size={width && width < 500 ? "small" : "medium"}
                          variant="contained"
                          color={editing && dirty ? "secondary" : "default"}
                          startIcon={
                            width && width < 500 ? null : editing ? (
                              dirty ? (
                                <Delete />
                              ) : null
                            ) : (
                              <Edit />
                            )
                          }
                          onClick={() => handleEdit(setValues, dirty)}
                        >
                          {editing ? "Cancel" : "Edit"}
                        </Button>
                      );
                    }}
                    loginRequired={true}
                  />

                  {!editing && (
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
                      startIcon={width && width < 500 ? null : <Save />}
                      disabled={
                        Object.entries(errors).length > 0 ||
                        !dirty ||
                        isValidating
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
        </div>
      </Dialog>
    </>
  );
};
