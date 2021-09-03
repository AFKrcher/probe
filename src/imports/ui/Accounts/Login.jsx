import React, { useState } from "react";
// Imports
import { Accounts } from "meteor/accounts-base";
import { Formik, Form } from "formik";

// @material-ui
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { Meteor } from "meteor/meteor";
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export const Login = () => {
  const classes = useStyles();
  const redirect = () => {
    window.location.href = "/";
  };

  const loginUser = (e) => {
    e.preventDefault();
    let user = e.target.username.value;
    let password = e.target.password.value;
    if (/[~`!@.#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(user)) {
      console.log("email");
      Meteor.loginWithPassword(
        {
          email: user,
        },

        e.target.password.value,
        (error) => {
          console.log(error);
        }
      );
    } else {
      Meteor.loginWithPassword(
        {
          username: user,
        },

        e.target.password.value,
        (error) => {
          console.log(error);
        }
      );
    }
  };

  const registerUser = (e) => {
    e.preventDefault();
    window.location.href = "/register";
  };
  return (
    <Grid container justifyContent="center" alignItems="center">
      {Meteor.loggingIn() || Meteor.user()?._id ? (
        redirect(<div>You are already logged in.</div>)
      ) : (
        <FormControl className={classes.margin}>
          <form onSubmit={loginUser}>
            <TextField
              id="username"
              label="Username or Email"
              ref={(input) => (username = input)}
            />
            <br />
            <TextField
              id="password"
              label="Password"
              type="password"
              ref={(input) => (password = input)}
            />
            <br />
            <Button variant="outlined" color="primary" type="submit">
              Login
            </Button>
            <br />
            <Button variant="outlined" color="secondary" onClick={registerUser}>
              Register New
            </Button>
          </form>
        </FormControl>
      )}
    </Grid>
  );
};
