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
import { Grid, Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
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
}));

export const Settings = () => {
  const classes = useStyles();
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

  const [passErr, setPassErr] = useState(false);
  const [passHelper, setPassHelper] = useState("");
  const [confirmErr, setConfirmErr] = useState(false);
  const [confirmHelper, setConfirmHelper] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [emailHelper, setEmailHelper] = useState("");
  const [userErr, setUserErr] = useState(false);
  const [userHelper, setUserHelper] = useState("");
  const [touched, setTouched] = useState(false);

  const [id, user, email] = useTracker(() => {
    const id = Meteor.user()?._id;
    const user = Meteor.user()?.username;
    const email =
      Meteor.user()?.emails[Meteor.user()?.emails.length - 1].address;
    return [id, user, email];
  });

  const deleteAccount = () => {
    Meteor.call("deleteAccount", id, (err, res) => {
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

  const isValidEmail = (newEmail) => {
    const schema = Yup.string().email();
    return schema.isValidSync(newEmail);
  };

  const isValidUsername = (newUsername) => {
    const regex = /^[a-zA-Z0-9]{4,}$/g;
    return regex.test(newUsername);
  };

  const isValidPassword = (oldPassword, newPassword, confirm) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
    return (
      regex.test(newPassword) &&
      newPassword !== oldPassword &&
      confirm === newPassword
    );
  };

  const validateForm = () => {
    const newEmail = document.getElementById("newEmail").value;
    const newUsername = document.getElementById("newUsername").value;
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirm").value;

    if (newEmail !== email || newUsername !== user) {
      setTouched(true);
    } else {
      setTouched(false);
    }

    if (!isValidEmail(newEmail)) {
      setEmailHelper("Invalid email address");
      setEmailErr(true);
    } else {
      setEmailHelper("");
      setEmailErr(false);
    }

    if (!isValidUsername(newUsername)) {
      setUserHelper(
        "Must be at least 4 characters long and cannot contain special characters"
      );
      setUserErr(true);
    } else {
      setUserHelper("");
      setUserErr(false);
    }

    if (newPassword !== confirm) {
      setConfirmHelper("Passwords do not match");
      setConfirmErr(true);
    } else {
      setConfirmHelper("");
      setConfirmErr(false);
    }

    if (isValidPassword(oldPassword, newPassword, confirm)) {
      setPassHelper(
        "Must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, and 1 special character"
      );
      setPassErr(true);
    } else {
      setPassHelper("");
      setPassErr(false);
    }
  };

  const updateAccount = () => {
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
          setSnack(res);
          setOpenSnack(true);
        }
      });
    }

    if (isValidUsername(newUsername) && newUsername !== oldUsername) {
      Meteor.call("updateUsername", id, user, newUsername, (err, res) => {
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
          setSnack(res);
          setOpenSnack(true);
        }
      });
    }

    if (isValidPassword(oldPassword, newPassword, confirm)) {
      Accounts.changePassword(oldPassword, newPassword, (res, err) => {
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
          setSnack(res);
          setOpenSnack(true);
        }
      });
    }
  };

  return (
    <React.Fragment>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      <Grid container justifyContent="center" alignItems="center">
        <FormControl className={classes.margin}>
          <form onSubmit={updateAccount} className={classes.flexContainer}>
            <TextField
              id="newEmail"
              label="Email"
              type="email"
              ref={(input) => (newEmail = input)}
              fullWidth
              className={classes.textField}
              onChange={validateForm}
              defaultValue={email}
              error={emailErr}
              helperText={emailHelper}
            />
            <TextField
              id="newUsername"
              label="Username"
              type="username"
              ref={(input) => (newUsername = input)}
              fullWidth
              className={classes.textField}
              onChange={validateForm}
              defaultValue={user}
              error={userErr}
              helperText={userHelper}
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
              error={passErr}
              helperText={passHelper}
            />
            <TextField
              id="confirm"
              label="Confirm new password"
              type="password"
              fullWidth
              className={classes.textField}
              onChange={validateForm}
              error={confirmErr}
              helperText={confirmHelper}
            />
            <Button
              id="updateButton"
              variant="outlined"
              color="primary"
              type="submit"
              fullWidth
              className={classes.button}
              disabled={
                userErr || passErr || confirmErr || emailErr || !touched
              }
            >
              Update your account
            </Button>
            <Button
              id="verifyButton"
              variant="outlined"
              onClick={sendEmail}
              fullWidth
              className={classes.button}
            >
              Verify your email
            </Button>
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
    </React.Fragment>
  );
};
