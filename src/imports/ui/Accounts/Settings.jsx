import React, { useState, useContext, useEffect } from "react";
import { Meteor } from "meteor/meteor";
//Imports
import { useTracker } from "meteor/react-meteor-data";
import { Accounts } from "meteor/accounts-base";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { isValidEmail, isValidUsername, isValidPassword, isConfirmedPassword } from "/imports/validation/accountYupShape";

// Components
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";

// @material-ui
import { Container, Grid, Button, TextField, CircularProgress, Tooltip, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: 10,
    padding: 45,
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "400px",
    borderRadius: 10,
    backgroundColor: theme.palette.grid.background
  },
  header: {
    marginBottom: 20
  },
  textField: {
    marginBottom: 20
  },
  button: {
    marginTop: 20
  },
  verifiedAdornment: {
    color: theme.palette.success.light,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`,
    cursor: "default",
    marginBottom: 5
  },
  unverifiedAdornment: {
    color: theme.palette.error.light,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`,
    cursor: "default",
    marginBottom: 5
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center"
  },
  spinner: {
    color: theme.palette.text.primary,
    marginTop: "30vh"
  }
}));

export const Settings = () => {
  const classes = useStyles();
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } = useContext(HelpersContext);

  const [passErr, setPassErr] = useState();
  const [confirmErr, setConfirmErr] = useState();
  const [emailErr, setEmailErr] = useState();
  const [userErr, setUserErr] = useState();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [adornment, setAdornment] = useState(<></>);
  const [adornmentTip, setAdornmentTip] = useState("");

  const [id, user, email, verified] = useTracker(() => {
    const id = Meteor.user({ fields: { _id: 1 } })?._id;
    const email = Meteor.user()?.emails[0]?.address;
    const user = Meteor.user({ fields: { username: 1 } })?.username;
    const verified = Meteor.user()?.emails[0] ? Meteor.user()?.emails[0]?.verified : false;
    return [id, user, email, verified];
  });

  useEffect(() => {
    if (verified) {
      setAdornment(<VerifiedUserIcon fontSize="small" className={classes.verifiedAdornment} />);
      setAdornmentTip("Email Verified");
    } else {
      setAdornment(<CancelIcon fontSize="small" className={classes.unverifiedAdornment} />);
      setAdornmentTip("Email Not Verified");
    }
  }, [verified]);

  const handleDeleteDialog = () => {
    setAlert({
      title: "Delete Your Account",
      text: "Are you sure you want to delete your PROBE account and all of its associated data?",
      actions: (
        <Button variant="contained" size="small" color="secondary" disableElevation onClick={deleteAccount}>
          Delete My Account
        </Button>
      ),
      closeAction: "Cancel"
    });
    setOpenAlert(true);
  };

  const deleteAccount = () => {
    setOpenAlert(false);
    setLoading(true);
    Meteor.call("deleteAccount", id, (err) => {
      if (err) {
        setAlert({
          title: "Error Encountered",
          text: err.reason,
          actions: null,
          closeAction: "Close"
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
          closeAction: "Close"
        });
        setOpenAlert(true);
      } else {
        setSnack(`Verification email sent to ${email}. Please check your inbox for further instructions.`);
        setOpenSnack(true);
      }
    });
  };

  const isValidEmailCheck = () => {
    const newEmail = document.getElementById("newEmail")?.value;
    const oldEmail = email;
    return isValidEmail(oldEmail, newEmail);
  };

  const isValidUsernameCheck = () => {
    const newUsername = document.getElementById("newUsername")?.value;
    const oldUsername = user;
    return isValidUsername(oldUsername, newUsername);
  };

  const isValidPasswordCheck = (oldPassword, newPassword, confirm) => {
    return isValidPassword(oldPassword, newPassword) && isConfirmedPassword(newPassword, confirm);
  };

  const validateNameOnly = () => {
    !isValidUsernameCheck() && !isValidPasswordCheck()
      ? setDisabled(true) + setUserErr("Must be between 4 and 32 characters long and cannot contain special characters")
      : setDisabled(false) + setUserErr();
  };

  const validateEmailOnly = () => {
    !isValidEmailCheck() && !isValidPasswordCheck() ? setDisabled(true) + setEmailErr("Invalid email address") : setDisabled(false) + setEmailErr();
  };

  const validatePasswordOnly = () => {
    const oldPassword = document.getElementById("oldPassword")?.value;
    const newPassword = document.getElementById("newPassword")?.value;
    const confirm = document.getElementById("confirm")?.value;

    if (!isValidPasswordCheck(oldPassword, newPassword, confirm)) {
      if (newPassword === oldPassword) {
        setPassErr("Old and new passwords are the same");
      } else if (newPassword !== confirm) {
        setPassErr();
      } else {
        setPassErr(newPassword.length > 128 ? "Cannot be longer than 128 characters" : "Must be at least 8 characters long");
        setDisabled(true);
      }
    } else if (!isConfirmedPassword(newPassword, confirm)) {
      setConfirmErr("Passwords do not match");
      setDisabled(true);
    } else {
      setPassErr();
      setConfirmErr();
      setDisabled(false);
    }
  };

  const updateAccount = async (e) => {
    e.preventDefault();
    const newEmail = e.target.newEmail?.value;
    const newUsername = e.target.newUsername?.value;
    const oldPassword = e.target.oldPassword?.value;
    const newPassword = e.target.newPassword?.value;
    const confirm = e.target.confirm?.value;

    const emailCheck = isValidEmailCheck();
    const passwordCheck = isValidPasswordCheck(oldPassword, newPassword, confirm);
    const nameCheck = isValidUsernameCheck();

    if (emailCheck) {
      await Meteor.call("updateEmail", id, email, newEmail, (err) => {
        if (err) {
          setOpenSnack(false);
          setAlert({
            title: "Error Encountered",
            text: err?.reason,
            actions: null,
            closeAction: "Close"
          });
          setOpenAlert(true);
        } else {
          setOpenSnack(true);
          setDisabled(true);
        }
      });
    }

    if (nameCheck) {
      await Meteor.call("updateUsername", id, user, newUsername, (err) => {
        if (err) {
          setOpenSnack(false);
          setAlert({
            title: "Error Encountered",
            text: err?.reason,
            actions: null,
            closeAction: "Close"
          });
          setOpenAlert(true);
        } else {
          setOpenSnack(true);
          setDisabled(true);
        }
      });
    }

    if (passwordCheck) {
      await Accounts.changePassword(oldPassword, newPassword, (err) => {
        if (err) {
          setOpenSnack(false);
          setAlert({
            title: "Error Encountered",
            text: err?.reason,
            actions: null,
            closeAction: "Close"
          });
          setOpenAlert(true);
        } else {
          setOpenSnack(true);
          setDisabled(true);
        }
      });
    }

    if (emailCheck && passwordCheck && nameCheck) {
      setSnack("Successfully changed email, username, and password! A verification email was sent to your new email.");
    } else if (passwordCheck && nameCheck) {
      setSnack("Successfully changed username and password");
    } else if (emailCheck && passwordCheck) {
      setSnack("Successfully changed email and password! A verification email was sent to your new email.");
    } else if (emailCheck && nameCheck) {
      setSnack("Successfully changed email and username! A verification email was sent to your new email.");
    } else if (passwordCheck) {
      setSnack("Successfully changed password");
    } else if (nameCheck) {
      setSnack(`Successfully changed username from ${user} to ${newUsername}`);
    } else if (emailCheck) {
      setSnack(`Successfully changed email from ${email} to ${newEmail}! A verification email was sent to your new email.`);
    }
  };

  return (
    <Container>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      {loading ? (
        <Container className={classes.spinnerContainer}>
          <CircularProgress className={classes.spinner} size={100} thickness={3} />
        </Container>
      ) : (
        <Grid container justifyContent="center" alignItems="center" className={classes.root}>
          <Paper className={classes.formContainer} elevation={3}>
            <Typography variant="h4" className={classes.header}>
              <strong>Profile Settings</strong>
            </Typography>
            <form id="settings" onSubmit={updateAccount} className={classes.flexContainer}>
              <TextField
                id="newEmail"
                label="Email"
                type="email"
                fullWidth
                className={classes.textField}
                InputProps={{
                  endAdornment: (
                    <Tooltip title={adornmentTip} placement="right" arrow>
                      {adornment}
                    </Tooltip>
                  )
                }}
                onChange={(e) => {
                  if (e.target.value !== email) validateEmailOnly();
                }}
                defaultValue={email}
                error={emailErr ? true : false}
                helperText={emailErr}
              />
              <TextField
                id="newUsername"
                label="Username"
                type="username"
                fullWidth
                className={classes.textField}
                onChange={(e) => {
                  if (e.target.value !== user) validateNameOnly();
                }}
                defaultValue={user}
                error={userErr ? true : false}
                helperText={userErr}
              />
              <TextField
                id="oldPassword"
                label="Current Password"
                type="password"
                fullWidth
                className={classes.textField}
                onChange={(e) => {
                  if (e.target.value) validatePasswordOnly();
                }}
              />
              <TextField
                id="newPassword"
                label="New Password"
                type="password"
                fullWidth
                className={classes.textField}
                onChange={(e) => {
                  if (e.target.value) validatePasswordOnly();
                }}
                error={passErr ? true : false}
                helperText={passErr}
              />
              <TextField
                id="confirm"
                label="Confirm New Password"
                type="password"
                fullWidth
                className={classes.textField}
                onChange={(e) => {
                  if (e.target.value) validatePasswordOnly();
                }}
                error={confirmErr ? true : false}
                helperText={confirmErr}
              />
              <Button
                id="updateButton"
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                className={classes.button}
                disabled={userErr || passErr || confirmErr || emailErr || disabled ? true : false}>
                Update your account
              </Button>
              {!verified ? (
                <Button id="verifyButton" variant="contained" onClick={sendEmail} fullWidth className={classes.button}>
                  Send verification email
                </Button>
              ) : null}
              <Button id="deleteButton" variant="contained" color="secondary" onClick={handleDeleteDialog} fullWidth className={classes.button}>
                Delete your account
              </Button>
            </form>
          </Paper>
        </Grid>
      )}
    </Container>
  );
};
