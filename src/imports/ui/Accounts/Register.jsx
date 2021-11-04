import React, { useState, useContext } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { useHistory } from "react-router";
import * as Yup from "yup";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isConfirmedPassword,
} from "/imports/validation/accountYupShape";

// Components
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";

// @material-ui
import {
  Grid,
  Button,
  Typography,
  Paper,
  TextField,
  makeStyles,
} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: 40,
    padding: 20,
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "400px",
    borderRadius: 10,
  },
  header: {
    marginBottom: 25,
  },
  textField: {
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 20,
  },
  loginButtonContainer: {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
  },
  loginButton: {
    marginTop: 20,
    width: "60%",
  },
}));

export const Register = () => {
  const classes = useStyles();
  const history = useHistory();

  const { setOpenAlert, alert, setAlert, setSnack, snack, setOpenSnack } =
    useContext(HelpersContext);

  const [passErr, setPassErr] = useState();
  const [confirmErr, setConfirmErr] = useState();
  const [emailErr, setEmailErr] = useState();
  const [userErr, setUserErr] = useState();
  const [disabled, setDisabled] = useState(true);

  const loginRedirect = () => {
    setTimeout(history.push("/login"));
  };

  const checkForm = () => {
    let email = document.getElementById("email")?.value;
    let username = document.getElementById("username")?.value;
    let password = document.getElementById("password")?.value;
    let confirm = document.getElementById("confirm")?.value;
    if (!email || !username || !password || !confirm) setDisabled(true);
  };

  const validateEmail = () => {
    let email = document.getElementById("email")?.value;
    if (email) {
      if (isValidEmail(null, email)) {
        Meteor.call("emailExists", email, (_, res) => {
          if (res) {
            setEmailErr(res);
          } else {
            setEmailErr(null);
            setDisabled(false);
            checkForm();
          }
        });
      } else {
        setEmailErr("Invalid email address");
        setDisabled(true);
      }
    }
  };

  const validateUsername = () => {
    let username = document.getElementById("username")?.value;
    if (username) {
      if (isValidUsername(null, username)) {
        Meteor.call("userExists", username, function (_, res) {
          if (res) {
            setUserErr(res);
          } else {
            setUserErr(null);
            setDisabled(false);
            checkForm();
          }
        });
      } else {
        setUserErr(
          "Must be between 4 and 32 characters long and cannot contain special characters"
        );
        setDisabled(true);
      }
    }
  };

  const validatePassword = () => {
    let confirm = document.getElementById("confirm")?.value;
    let password = document.getElementById("password")?.value;
    if (!isValidPassword(null, password, confirm)) {
      if (password !== confirm) {
        setPassErr();
      } else {
        setPassErr(
          password.length > 128
            ? "Cannot be longer than 128 characters"
            : "Must be at least 8 characters long"
        );
        setDisabled(true);
      }
    } else if (!isConfirmedPassword(password, confirm)) {
      setConfirmErr("Passwords do not match");
      setDisabled(true);
    } else {
      setPassErr();
      setConfirmErr();
      setDisabled(false);
    }
  };

  const registerUser = (e) => {
    e.preventDefault();
    let email = document.getElementById("email")?.value;
    let username = document.getElementById("username")?.value;
    let password = document.getElementById("password")?.value;

    Meteor.call("registerUser", email, username, password, async (err, res) => {
      if (res) {
        await Meteor.loginWithPassword(
          {
            username: username,
          },
          password,
          (error) => {
            if (error) {
              setAlert({
                title: "Error Encountered",
                text: err?.reason,
                actions: null,
                closeAction: "Close",
              });
              setOpenAlert(true);
            }
          }
        );
      }
      if (err) {
        setAlert({
          title: "Error Encountered",
          text: err?.reason,
          actions: null,
          closeAction: "Close",
        });
        setOpenAlert(true);
      } else if (!res?.includes("error")) {
        setSnack(res);
        setOpenSnack(true);
      }
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      <Paper className={classes.formContainer} elevation={3}>
        <Typography variant="h4" className={classes.header}>
          <strong>Register</strong>
        </Typography>
        <form onSubmit={registerUser} onChange={checkForm}>
          <TextField
            autoFocus={true}
            autoComplete="off"
            id="email"
            error={emailErr ? true : false}
            helperText={emailErr}
            label="Email"
            type="email"
            onChange={validateEmail}
            ref={(input) => (email = input)}
            fullWidth
            className={classes.textField}
          />
          <TextField
            autoComplete="off"
            id="username"
            error={userErr ? true : false}
            helperText={userErr}
            label="Username"
            onChange={validateUsername}
            onBlur={checkForm}
            ref={(input) => (username = input)}
            fullWidth
            className={classes.textField}
          />
          <TextField
            autoComplete="off"
            id="password"
            label="Password"
            type="password"
            error={passErr ? true : false}
            helperText={passErr}
            onChange={validatePassword}
            onBlur={checkForm}
            ref={(input) => (password = input)}
            fullWidth
            className={classes.textField}
          />
          <TextField
            autoComplete="off"
            error={confirmErr ? true : false}
            id="confirm"
            helperText={confirmErr}
            label="Confirm Password"
            onChange={validatePassword}
            onBlur={checkForm}
            type="password"
            fullWidth
            className={classes.textField}
          />
          <Button
            id="register-button"
            variant="outlined"
            color="primary"
            type="submit"
            fullWidth
            disabled={disabled}
            className={classes.registerButton}
          >
            Register User
          </Button>
          <div className={classes.loginButtonContainer}>
            <Button
              id="login-button"
              size="small"
              className={classes.loginButton}
              onClick={loginRedirect}
            >
              Login Instead
            </Button>
          </div>
        </form>
      </Paper>
    </Grid>
  );
};
