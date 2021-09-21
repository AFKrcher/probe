import React, { useState } from "react";
// Imports
import { useHistory } from "react-router";
import { useTracker } from "meteor/react-meteor-data";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

// @material-ui
import {
  Grid,
  Button,
  makeStyles,
  FormControl,
  TextField,
  Tooltip,
} from "@material-ui/core";

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
  loginButton: {
    marginTop: 20,
  },
  registerButton: {
    marginTop: 20,
  },
}));

export const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [errHelper, setErrHelper] = useState("");

  let user = useTracker(() => Meteor.user()?.username, []);
  let regex = /[~`!@.#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g;

  const redirect = () => {
    setTimeout(() => history.push("/"));
  };

  const [disabled, setDisabled] = useState(true);
  const handleDisable = () => {
    let username = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    if (username && pass) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleError = (error) => {
    if (error) {
      if (
        error.message === "User not found [403]" ||
        error.message === "Incorrect password [403]"
      ) {
        setErrHelper("Incorrect username or password");
      } else {
        setErrHelper(
          "We are having difficulties logging you in. Please, wait and try again."
        );
      }
    }
  };

  const loginUser = (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;
    setErrHelper("");
    if (regex.test(username)) {
      Meteor.loginWithPassword(
        {
          email: username,
        },
        password,
        (error) => {
          handleError(error);
        }
      );
    } else {
      Meteor.loginWithPassword(
        {
          username: username,
        },
        password,
        (error) => {
          handleError(error);
        }
      );
    }
  };

  const registerUser = () => {
    history.push("/register");
  };

  const forgotPassword = () => {
    let options = {};
    let username = document.getElementById("username").value;
    if (regex.test(username)) {
      options.email = username;
      Accounts.forgotPassword(options, (res) => {
        alert(
          res || "An email has been sent with a link to reset your password."
        );
      });
    } else {
      setErrHelper("Please provide a valid email.");
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      {user ? (
        redirect(
          <div style={{ textAlign: "center" }}>You are already logged in.</div>
        )
      ) : (
        <FormControl className={classes.margin}>
          <form onSubmit={loginUser} className={classes.formContainer}>
            <TextField
              id="username"
              error={
                errHelper.includes("email") || errHelper.includes("user")
                  ? true
                  : false
              }
              helperText={
                errHelper.includes("email") || errHelper.includes("user")
                  ? errHelper
                  : null
              }
              label="Username or Email"
              onChange={handleDisable}
              ref={(input) => (username = input)}
              className={classes.textField}
              fullWidth
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              error={errHelper.includes("password") ? true : false}
              helperText={errHelper.includes("password") ? errHelper : null}
              onChange={handleDisable}
              ref={(input) => (password = input)}
              className={classes.textField}
              fullWidth
            />
            <Button
              id="login-button"
              variant="outlined"
              className={classes.loginButton}
              color="primary"
              type="submit"
              disabled={disabled}
              fullWidth
            >
              Login
            </Button>
            <Tooltip
              title="Redirect to the account registration page"
              placement="right"
              arrow
            >
              <Button
                id="register-instead"
                className={classes.registerButton}
                onClick={registerUser}
                size="small"
              >
                Register New
              </Button>
            </Tooltip>
            <Tooltip
              title="Enter a registered email above"
              placement="right"
              arrow
            >
              <Button
                id="forgot-password"
                onClick={forgotPassword}
                size="small"
              >
                Forgot Password?
              </Button>
            </Tooltip>
          </form>
        </FormControl>
      )}
    </Grid>
  );
};
