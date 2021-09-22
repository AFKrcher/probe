import React, { useState } from "react";
// Imports
import { Accounts } from "meteor/accounts-base";
import { useTracker } from "meteor/react-meteor-data";
import { useHistory } from "react-router";
import * as Yup from "yup";

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

  const [passErr, setPassErr] = useState();
  const [confirmErr, setConfirmErr] = useState();
  const [emailErr, setEmailErr] = useState();
  const [userErr, setUserErr] = useState();

  const loginRedirect = () => {
    setTimeout(history.push("/login"));
  };

  const isValidEmail = (email) => {
    const schema = Yup.string().email();
    return schema.isValidSync(email);
  };

  const isValidUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{4,}$/g;
    return regex.test(username);
  };

  const validateEmail = () => {
    let email = document.getElementById("email")?.value;
    if (email) {
      if (isValidEmail(email)) {
        Meteor.call("emailExists", email, (_, err) => {
          if (err) {
            setEmailErr(err);
          } else {
            setEmailErr(null);
          }
        });
      } else {
        setEmailErr("Invalid email address");
      }
    }
  };

  const validateUsername = () => {
    let username = document.getElementById("username")?.value;
    if (username) {
      if (isValidUsername(username)) {
        Meteor.call("userExists", username, function (_, err) {
          if (err) {
            setUserErr(err);
          } else {
            setUserErr(null);
          }
        });
      } else {
        setUserErr(
          "Must be at least 4 characters long and cannot contain special characters"
        );
      }
    }
  };

  const validatePassword = () => {
    let pass = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
    if (pass) {
      if (!regex.test(pass)) {
        setPassErr(
          "Must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, and 1 special character"
        );
      } else {
        setPassErr(null);
      }
      if (pass && confirm) {
        if (confirm === pass) {
          setConfirmErr(null);
        } else {
          setConfirmErr("Passwords do not match");
        }
      }
    }
  };

  const registerUser = (e) => {
    e.preventDefault();
    try {
      Accounts.createUser(
        {
          email: e.target.email.value,
          username: e.target.username.value,
          password: e.target.password.value,
        },
        () => {
          alert("Welcome to PROBE"); // TODO: use AlertDialog for custom welcome message
        }
      );
      setTimeout(history.push("/"));
    } catch (err) {
      alert(
        "Something went wrong while trying to register your new account. Please try again later."
      );
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <FormControl className={classes.margin}>
        <form onSubmit={registerUser} className={classes.formContainer}>
          <TextField
            id="email"
            error={emailErr ? true : false}
            helperText={emailErr}
            label="Email"
            type="email"
            onBlur={validateEmail}
            onChange={validateEmail}
            ref={(input) => (email = input)}
            fullWidth
            className={classes.textField}
          />
          <TextField
            id="username"
            error={userErr ? true : false}
            helperText={userErr}
            label="Username"
            onBlur={validateUsername}
            onChange={validateUsername}
            ref={(input) => (username = input)}
            fullWidth
            className={classes.textField}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            error={passErr ? true : false}
            helperText={passErr}
            onChange={validatePassword}
            ref={(input) => (password = input)}
            fullWidth
            className={classes.textField}
          />
          <TextField
            error={confirmErr ? true : false}
            id="confirm"
            helperText={confirmErr}
            label="Confirm password"
            onChange={validatePassword}
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
            disabled={passErr || confirmErr || userErr || emailErr}
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
