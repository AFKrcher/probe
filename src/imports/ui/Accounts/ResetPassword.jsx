import React, { useState } from "react";
// Imports
import { useLocation } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Accounts } from "meteor/accounts-base";

// @material-ui
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { Meteor } from "meteor/meteor";
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

export const ResetPassword = () => {
  const classes = useStyles();
  let [disabled, setDisabled] = useState(true);
  const [passErr, setPassErr] = useState();
  const [passHelper, setPassHelper] = useState("");
  const [confirmErr, setConfirmErr] = useState();
  const [confirmHelper, setConfirmHelper] = useState("");

  let user = useTracker(() => Meteor.user()?.username, []);

  const location = useLocation();

  let token = location.search.slice(7, location.search.length);
  
  const handleReset = (newPassword) => {
    Accounts.resetPassword(token, newPassword, (res, err) => {
      console.log(res, err);
    });
  };

  const validate = () => {
    let pass = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    let regex = new RegExp(
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
    );
    if (pass) {
      if (!regex.test(pass)) {
        setPassErr(true);
        setDisabled(true)
        setPassHelper("Needs 8+ length, upper, lower, & special characters!");
      } else {
        setPassErr(false);
        setPassHelper("");
      }
      if (pass && confirm) {
        if (confirm === pass) {
          setConfirmErr(false);
          setDisabled(false);
          setConfirmHelper("");
        } else {
          setDisabled(true);
          setConfirmErr(true);
          setConfirmHelper("Passwords do not match!");
        }
      }
    }
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        {user ? (
          <div>You are already logged in.</div>
        ) : (
          <FormControl className={classes.margin}>
            <form onSubmit={handleReset} className={classes.formContainer}>
              <TextField
                id="password"
                label="New password"
                type="password"
                error={passErr}
                helperText={passHelper}
                onChange={validate}
                ref={(input) => (password = input)}
                fullWidth
                className={classes.textField}
              />
              <TextField
                error={confirmErr}
                id="confirm"
                helperText={confirmHelper}
                label="Confirm new password"
                onChange={validate}
                type="password"
                fullWidth
                className={classes.textField}
              />
              <Button
                disabled={disabled}
                variant="outlined"
                className={classes.loginButton}
                color="primary"
                type="submit"
                fullWidth
              >
                Reset Password
              </Button>
            </form>
          </FormControl>
        )}
      </Grid>
    </>
  );
};
