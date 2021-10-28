import React, { useState, useContext } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { useHistory } from "react-router";
import * as Yup from "yup";
import HelpersContext from "../Dialogs/HelpersContext.jsx";

// Components
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";

// @material-ui
import { Grid, Button, Tooltip } from "@material-ui/core";
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

  const isValidEmail = (email) => {
    const schema = Yup.string().email();
    return schema.isValidSync(email) && email.length <= 128;
  };

  const isValidUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{4,}$/g;
    return regex.test(username) && username.length <= 32;
  };

  const isValidPassword = (password) => {
    return password.length >= 8 && password.length < 128;
  };

  const validateEmail = () => {
    let email = document.getElementById("email")?.value;
    if (email) {
      if (isValidEmail(email)) {
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
      if (isValidUsername(username)) {
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
    if (password) {
      if (!isValidPassword(password)) {
        setPassErr(
          password.length >= 128
            ? "Cannot be longer than 128 characters"
            : "Must be at least 8 characters long, and should contain at least 1 lowercase, 1 uppercase, and 1 special character"
        );
      } else {
        setPassErr(null);
        setDisabled(false);
      }
      if (password && confirm) {
        if (confirm === password) {
          setConfirmErr(null);
          setDisabled(false);
          checkForm();
        } else {
          setConfirmErr("Passwords do not match");
          setDisabled(true);
        }
      }
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
      if (!res?.includes("error")) {
        await setSnack(res);
        setOpenSnack(true);
      }
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnackBar={snack} />
      <FormControl className={classes.margin}>
        <form
          onSubmit={registerUser}
          onChange={checkForm}
          className={classes.formContainer}
        >
          <TextField
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
            className={classes.button}
          >
            Register User
          </Button>
          <Tooltip title="Redirect to the login page" placement="right" arrow>
            <Button
              id="login-button"
              size="small"
              className={classes.button}
              onClick={loginRedirect}
            >
              Login Instead
            </Button>
          </Tooltip>
        </form>
      </FormControl>
    </Grid>
  );
};
