import React, { useState } from "react";
// Imports
import { useHistory } from "react-router";
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
  CircularProgress,
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
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  spinner: {
    color: theme.palette.text.primary,
    marginTop: "30vh",
  },
}));

export const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const usernameRegex = /[~`!@.#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g;

  const handleDisable = () => {
    setError(null);
    let username = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    if (username && pass && !error) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleError = (err) => {
    if (err) {
      if (
        err.message === "User not found [403]" ||
        err.message === "Incorrect password [403]"
      ) {
        setError("Incorrect username or password");
      } else {
        setError(
          "We are having difficulties logging you in. Please wait and try again."
        );
      }
    }
  };

  const loginUser = (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;

    setError(null);
    setLoading(true);

    Meteor.call("checkIfBanned", username, (_, err) => {
      if (err) {
        setDisabled(true);
        setError("This user has been banned.");
        setLoading(false);
      } else {
        if (usernameRegex.test(username)) {
          Meteor.loginWithPassword(
            {
              email: username,
            },
            password,
            (error) => {
              handleError(error);
              setLoading(false);
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
              setLoading(false);
            }
          );
        }
      }
    });
  };

  const registerUser = () => {
    history.push("/register");
  };

  const forgotPassword = () => {
    let options = {};
    let username = document.getElementById("username").value;
    if (usernameRegex.test(username)) {
      options.email = username;
      Accounts.forgotPassword(options, (res) => {
        alert(
          res || "An email has been sent with a link to reset your password."
        );
      });
    } else {
      setError("Please provide a valid email.");
    }
  };

  let username = document.getElementById("username")?.value;
  let pass = document.getElementById("password")?.value;
  return (
    <Grid container justifyContent="center" alignItems="center">
      {loading ? (
        <div className={classes.spinnerContainer}>
          <CircularProgress
            className={classes.spinner}
            size={100}
            thickness={3}
          />
        </div>
      ) : (
        <FormControl className={classes.margin}>
          <form onSubmit={loginUser} className={classes.formContainer}>
            <TextField
              id="username"
              error={error ? true : false}
              helperText={error ? error : null}
              label="Username or Email"
              onChange={handleDisable}
              ref={(input) => (username = input)}
              className={classes.textField}
              fullWidth
              autoComplete="off"
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              error={error ? true : false}
              helperText={error ? error : null}
              onChange={handleDisable}
              ref={(input) => (password = input)}
              className={classes.textField}
              fullWidth
              autoComplete="off"
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
