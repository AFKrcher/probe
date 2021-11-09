import React, { useState, useContext } from "react";
// Imports
import { useHistory } from "react-router";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { isValidEmail, isValidUsername } from "/imports/validation/accountYupShape";

// Components
import AlertDialog from "../Dialogs/AlertDialog.jsx";

// @material-ui
import { Grid, Button, makeStyles, TextField, CircularProgress, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: 30,
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
    marginBottom: 30
  },
  textField: {
    marginBottom: 20
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 20
  },
  registerForgotButtonContainer: {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -15
  },
  registerButton: {
    width: "70%"
  },
  forgotButton: {
    width: "60%"
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

export const Login = () => {
  const classes = useStyles();

  const history = useHistory();

  const { setOpenAlert, alert, setAlert } = useContext(HelpersContext);

  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleDisable = () => {
    setError(null);
    const username = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (username && pass && !error) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleError = (err) => {
    if (err) {
      if (err.message === "User not found [403]" || err.message === "Incorrect password [403]") {
        setError("Incorrect username or password");
      } else {
        setError("We are having difficulties logging you in. Please wait and try again.");
      }
    }
  };

  const loginUser = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    setError(null);
    setLoading(true);

    Meteor.call("checkIfBanned", username, (_, err) => {
      if (err) {
        setDisabled(true);
        setError("This user has been banned.");
        setLoading(false);
      } else {
        if (isValidEmail(null, username)) {
          Meteor.loginWithPassword(
            {
              email: username
            },
            password,
            (error) => {
              handleError(error);
              setLoading(false);
            }
          );
        } else if (isValidUsername(null, username)) {
          Meteor.loginWithPassword(
            {
              username: username
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

  const forgotPasswordError = "Please enter a valid email";

  const forgotPassword = () => {
    let options = {};
    const email = document.getElementById("username").value;
    if (isValidEmail(null, email)) {
      options.email = email;
      Accounts.forgotPassword(options, (err) => {
        if (err) {
          setAlert({
            title: "Error Encountered",
            text: err.reason,
            actions: null,
            closeAction: "Close"
          });
          setOpenAlert(true);
        } else {
          setAlert({
            title: "Password Reset Email Sent",
            text: "An email has been sent with instructions for resetting your password.",
            actions: null,
            closeAction: "Okay"
          });
          setOpenAlert(true);
        }
      });
    } else {
      setError(forgotPasswordError);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <AlertDialog bodyAlert={alert} />
      {loading ? (
        <div className={classes.spinnerContainer}>
          <CircularProgress className={classes.spinner} size={100} thickness={3} />
        </div>
      ) : (
        <Paper className={classes.formContainer} elevation={3}>
          <Typography variant="h4" className={classes.header}>
            <b>Login</b>
          </Typography>
          <form onSubmit={loginUser}>
            <TextField
              autoFocus={true}
              id="username"
              error={error ? true : false}
              helperText={error ? error : null}
              label="Username or Email"
              onChange={handleDisable}
              className={classes.textField}
              fullWidth
              autoComplete="off"
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              error={error ? !error.includes(forgotPasswordError) : false}
              helperText={error ? (error.includes(forgotPasswordError) ? null : error) : null}
              onChange={handleDisable}
              className={classes.textField}
              fullWidth
              autoComplete="off"
            />
            <Button id="login-button" variant="outlined" className={classes.loginButton} color="primary" type="submit" disabled={disabled} fullWidth>
              Login
            </Button>
            <div className={classes.registerForgotButtonContainer}>
              <Button className={classes.registerButton} id="register-instead" onClick={registerUser} size="small">
                Register New Account
              </Button>
              <Button className={classes.forgotButton} id="forgot-password" onClick={forgotPassword} size="small">
                Forgot Password?
              </Button>
            </div>
          </form>
        </Paper>
      )}
    </Grid>
  );
};
