import React, { useState, useContext } from "react";
//Imports
import { useTracker } from "meteor/react-meteor-data";
import { Accounts } from "meteor/accounts-base";
import * as Yup from "yup";
import HelpersContext from "../Dialogs/HelpersContext.jsx";

// Components
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";

// @material-ui
import {
  Grid,
  Button,
  TextField,
  FormControl,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(4),
    width: "300px",
  },
  formContainer: {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  textField: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  spinner: {
    color: theme.palette.text.primary,
    marginTop: "30vh",
  },
}));

export const Settings = () => {
  const classes = useStyles();
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

  const [passErr, setPassErr] = useState();
  const [confirmErr, setConfirmErr] = useState();
  const [emailErr, setEmailErr] = useState();
  const [userErr, setUserErr] = useState();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [id, user, email] = useTracker(() => {
    const id = Meteor.user()?._id;
    const user = Meteor.user()?.username;
    const email =
      Meteor.user()?.emails[Meteor.user()?.emails.length - 1].address;
    return [id, user, email];
  });

  const deleteAccount = () => {
    setLoading(true);
    Meteor.call("deleteAccount", id, (err, res) => {
      if (err) {
        setAlert({
          title: "Error Encountered",
          text: err,
          actions: null,
          closeAction: "Close",
        });
        return;
      }
      if (res) {
        setLoading(false);
        setSnack("Your account has been successfully deleted");
        setOpenSnack(true);
        return;
      }
    });
  };

  const sendEmail = () => {
    Meteor.call("sendEmail", id, email, (err, res) => {
      if (err) {
        setAlert({
          title: "Error Encountered",
          text: err,
          actions: null,
          closeAction: "Close",
        });
      }
      if (res) {
        setSnack(res);
        setOpenSnack(true);
      }
    });
  };

  const isValidEmail = () => {
    let newEmail = document.getElementById("newEmail")?.value;
    const schema = Yup.string().email();
    return schema.isValidSync(newEmail) && newEmail?.length <= 128;
  };

  const isValidUsername = () => {
    let newUsername = document.getElementById("newUsername")?.value;
    const regex = /^[a-zA-Z0-9]{4,}$/g;
    return regex.test(newUsername) && newUsername?.length <= 32;
  };

  const isValidPassword = () => {
    let oldPassword = document.getElementById("oldPassword")?.value;
    let newPassword = document.getElementById("newPassword")?.value;
    let confirm = document.getElementById("confirm")?.value;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
    return (
      regex.test(newPassword) &&
      newPassword !== oldPassword &&
      confirm === newPassword &&
      newPassword?.length <= 128
    );
  };

  const validateNameOnly = () => {
    let newUsername = document.getElementById("newUsername")?.value;
    let oldPassword = document.getElementById("oldPassword")?.value;
    let newPassword = document.getElementById("newPassword")?.value;
    let confirm = document.getElementById("confirm")?.value;
    user === newUsername && !confirm && !newPassword && !oldPassword
      ? setDisabled(true)
      : setDisabled(false);
  };

  const validateEmailOnly = () => {
    let newEmail = document.getElementById("newEmail")?.value;
    let oldPassword = document.getElementById("oldPassword")?.value;
    let newPassword = document.getElementById("newPassword")?.value;
    let confirm = document.getElementById("confirm")?.value;
    email === newEmail && !confirm && !newPassword && !oldPassword
      ? setDisabled(true)
      : setDisabled(false);
  };

  const validateForm = () => {
    let oldPassword = document.getElementById("oldPassword")?.value;
    let newPassword = document.getElementById("newPassword")?.value;
    let confirm = document.getElementById("confirm")?.value;

    if (!isValidEmail()) {
      setEmailErr("Invalid email address");
    } else {
      setEmailErr();
      setDisabled(false);
    }

    if (!isValidUsername()) {
      setUserErr(
        "Must be between 4 and 32 characters long and cannot contain special characters"
      );
    } else {
      setUserErr();
      setDisabled(false);
    }

    if (newPassword && !isValidPassword()) {
      if (newPassword === oldPassword) {
        setPassErr("Old and new passwords are the same");
      } else if (newPassword !== confirm) {
        setPassErr();
      } else {
        setPassErr(
          newPassword.length > 128
            ? "Cannot be longer than 128 characters"
            : "Must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, and 1 special character"
        );
      }
    } else {
      setPassErr();
      setDisabled(false);
    }

    if (
      (confirm && newPassword && newPassword !== confirm) ||
      (confirm && !newPassword)
    ) {
      setConfirmErr("Passwords do not match");
    } else {
      setConfirmErr();
      setDisabled(false);
    }

    if (newPassword || oldPassword || confirm) {
      if (newPassword && oldPassword && confirm) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
  };

  const updateAccount = (e) => {
    e.preventDefault();

    const newEmail = e.target.newEmail?.value;
    const newUsername = e.target.newUsername?.value;
    const oldPassword = e.target.oldPassword?.value;
    const newPassword = e.target.newPassword?.value;
    const confirm = e.target.confirm?.value;

    if (isValidEmail(newEmail) && newEmail !== email) {
      Meteor.call("updateEmail", id, email, newEmail, (err, res) => {
        if (err) {
          setAlert({
            title: "Error Encountered",
            text: err,
            actions: null,
            closeAction: "Close",
          });
          setOpenAlert(true);
        }
        if (res) {
          setSnack(`Email successfully changed from ${email} to ${oldEmail}`);
          setOpenSnack(true);
          setDisabled(true);
        }
      });
    } else if (isValidUsername(newUsername) && newUsername !== user) {
      Meteor.call("updateUsername", id, user, newUsername, (err, res) => {
        if (err) {
          setAlert({
            title: "Error Encountered",
            text: err.message,
            actions: null,
            closeAction: "Close",
          });
          setOpenAlert(true);
        }
        if (res) {
          setSnack(`Username successfully changed from ${user} to ${newUsername}`);
          setOpenSnack(true);
          setDisabled(true);
        }
      });
    } else if (isValidPassword(oldPassword, newPassword, confirm)) {
      Accounts.changePassword(oldPassword, newPassword, (err, res) => {
        if (err) {
          setAlert({
            title: "Error Encountered",
            text: err.message,
            actions: null,
            closeAction: "Close",
          });
          setOpenAlert(true);
        } else {
          setSnack("Successfully changed password");
          setOpenSnack(true);
          setDisabled(true);
        }
      });
    } else {
      setAlert({
        title: "Error Encountered",
        text: "No changes made. Email, username, and password are the same.",
        actions: null,
        closeAction: "Close",
      });
      setOpenAlert(true);
    }
  };

  return (
    <React.Fragment>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      {loading ? (
        <div className={classes.spinnerContainer}>
          <CircularProgress
            className={classes.spinner}
            size={100}
            thickness={3}
          />
        </div>
      ) : (
        <Grid container justifyContent="center" alignItems="center">
          <FormControl className={classes.margin}>
            <form id="settings" onSubmit={updateAccount} className={classes.flexContainer}>
              <TextField
                id="newEmail"
                label="Email"
                type="email"
                ref={(input) => (newEmail = input)}
                fullWidth
                className={classes.textField}
                onChange={() => {
                  validateForm();
                  validateEmailOnly();
                }}
                defaultValue={email}
                error={emailErr ? true : false}
                helperText={emailErr}
              />
              <TextField
                id="newUsername"
                label="Username"
                type="username"
                ref={(input) => (newUsername = input)}
                fullWidth
                className={classes.textField}
                onChange={() => {
                  validateForm();
                  validateNameOnly();
                }}
                defaultValue={user}
                error={userErr ? true : false}
                helperText={userErr}
              />
              <TextField
                id="oldPassword"
                label="Current Password"
                type="password"
                ref={(input) => (oldPassword = input)}
                fullWidth
                className={classes.textField}
                onChange={validateForm}
              />
              <TextField
                id="newPassword"
                label="New Password"
                type="password"
                ref={(input) => (newPassword = input)}
                fullWidth
                className={classes.textField}
                onChange={validateForm}
                error={passErr ? true : false}
                helperText={passErr}
              />
              <TextField
                id="confirm"
                label="Re-Type New Password"
                type="password"
                fullWidth
                className={classes.textField}
                onChange={validateForm}
                error={confirmErr ? true : false}
                helperText={confirmErr}
              />
              <Button
                id="updateButton"
                variant="outlined"
                color="primary"
                type="submit"
                fullWidth
                className={classes.button}
                disabled={
                  userErr || passErr || confirmErr || emailErr || disabled
                    ? true
                    : false
                }
              >
                Update your account
              </Button>
              <Button
                id="verifyButton"
                onClick={sendEmail}
                fullWidth
                className={classes.button}
              >
                Verify your email
              </Button>
              <Button
                id="deleteButton"
                color="secondary"
                onClick={deleteAccount}
                fullWidth
                className={classes.button}
              >
                Delete your account
              </Button>
            </form>
          </FormControl>
        </Grid>
      )}
    </React.Fragment>
  );
};
