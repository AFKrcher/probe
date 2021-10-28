import React, { useState, useContext } from "react";
import { Meteor } from "meteor/meteor";
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
  Container,
  Grid,
  Button,
  TextField,
  FormControl,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: 30,
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "300px",
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
    const email = Meteor.user()?.emails[0]?.address;
    return [id, user, email];
  });

  const deleteAccount = () => {
    setLoading(true);
    Meteor.call("deleteAccount", id, (err) => {
      if (err) {
        setAlert({
          title: "Error Encountered",
          text: err.reason,
          actions: null,
          closeAction: "Close",
        });
        setOpenAlert(true);
      } else {
        setLoading(false);
        setSnack("Your account has been successfully deleted");
        setOpenSnack(true);
      }
    });
  };

  const sendEmail = () => {
    Meteor.call("sendEmail", id, email, (err) => {
      if (err) {
        setAlert({
          title: "Error Encountered",
          text: err.reason,
          actions: null,
          closeAction: "Close",
        });
        setOpenAlert(true);
      } else {
        setSnack(
          `Verification email sent to ${email}. Please check your inbox for further instructions.`
        );
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
    return (
      newPassword !== oldPassword &&
      confirm === newPassword &&
      newPassword?.length <= 128 &&
      newPassword?.length >= 8
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
            : "Must be at least 8 characters long, and should contain at least 1 lowercase, 1 uppercase, and 1 special character"
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

  const updateAccount = async (e) => {
    e.preventDefault();
    const newEmail = e.target.newEmail?.value;
    const newUsername = e.target.newUsername?.value;
    const oldPassword = e.target.oldPassword?.value;
    const newPassword = e.target.newPassword?.value;
    const confirm = e.target.confirm?.value;

    if (isValidEmail(newEmail) && newEmail !== email) {
      await Meteor.call("updateEmail", id, email, newEmail, (err) => {
        if (err) {
          setAlert({
            title: "Error Encountered",
            text: err?.reason,
            actions: null,
            closeAction: "Close",
          });
          setOpenAlert(true);
        } else {
          setDisabled(true);
          setOpenSnack(true);
        }
      });
    }

    if (isValidUsername(newUsername) && newUsername !== user) {
      await Meteor.call("updateUsername", id, user, newUsername, (err) => {
        if (err) {
          setAlert({
            title: "Error Encountered",
            text: err?.reason,
            actions: null,
            closeAction: "Close",
          });
          setOpenAlert(true);
        } else {
          setDisabled(true);
          setOpenSnack(true);
        }
      });
    }

    if (isValidPassword(oldPassword, newPassword, confirm)) {
      await Accounts.changePassword(oldPassword, newPassword, (err) => {
        if (err) {
          setAlert({
            title: "Error Encountered",
            text: err?.reason,
            actions: null,
            closeAction: "Close",
          });
          setOpenAlert(true);
        } else {
          setDisabled(true);
          setOpenSnack(true);
        }
      });
    }

    if (
      isValidEmail(newEmail) &&
      newEmail !== email &&
      isValidPassword(oldPassword, newPassword, confirm) &&
      isValidUsername(newUsername) &&
      newUsername !== user
    ) {
      setSnack("Successfully changed email, username, and password");
    } else if (
      isValidPassword(oldPassword, newPassword, confirm) &&
      isValidUsername(newUsername) &&
      newUsername !== user
    ) {
      setSnack("Successfully changed username and password");
    } else if (
      isValidEmail(newEmail) &&
      newEmail !== email &&
      isValidPassword(oldPassword, newPassword, confirm)
    ) {
      setSnack("Successfully changed email and password");
    } else if (
      isValidUsername(newUsername) &&
      newUsername !== user &&
      isValidEmail(newEmail) &&
      newEmail !== email
    ) {
      setSnack("Successfully changed email and username");
    } else if (isValidPassword(oldPassword, newPassword, confirm)) {
      setSnack("Successfully changed password");
    } else if (isValidUsername(newUsername) && newUsername !== user) {
      setSnack(`Username successfully changed from ${user} to ${newUsername}`);
    } else if (isValidEmail(newEmail) && newEmail !== email) {
      setSnack(`Email successfully changed from ${email} to ${newEmail}`);
    }
  };

  return (
    <Container>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      {loading ? (
        <Container className={classes.spinnerContainer}>
          <CircularProgress
            className={classes.spinner}
            size={100}
            thickness={3}
          />
        </Container>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className={classes.root}
        >
          <FormControl className={classes.formContainer}>
            <form
              id="settings"
              onSubmit={updateAccount}
              className={classes.flexContainer}
            >
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
                label="Confirm New Password"
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
              {!Meteor.user().emails[0].verified ? (
                <Button
                  id="verifyButton"
                  variant="outlined"
                  onClick={sendEmail}
                  fullWidth
                  className={classes.button}
                >
                  VERIFY YOUR EMAIL
                </Button>
              ) : null}
              <Button
                id="deleteButton"
                variant="outlined"
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
    </Container>
  );
};
