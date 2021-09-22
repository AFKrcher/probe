import React, { useState, useEffect } from "react";
// Imports
import { useLocation, useHistory } from "react-router-dom";
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
  const [passHelper, setPassHelper] = useState();
  const [confirmHelper, setConfirmHelper] = useState();
  const [touched, setTouched] = useState(false);

  const location = useLocation();
  const token = location.search.slice(7, location.search.length);

  const handleReset = (newPassword) => {
    Accounts.resetPassword(token, newPassword, (res, err) => {
      if (err) alert(err)
      if (res) alert(res)
    });
  };

  const validatePassword = () => {
    let pass = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
    if (pass) {
      setTouched(true);
      if (!regex.test(pass)) {
        setPassHelper(
          "Must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, and 1 special character"
        );
      } else {
        setPassHelper(null);
      }
      if (pass && confirm) {
        if (confirm === pass) {
          setConfirmHelper(null);
        } else {
          setConfirmHelper("Passwords do not match!");
        }
      }
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <FormControl className={classes.margin}>
        <form onSubmit={handleReset} className={classes.formContainer}>
          <TextField
            id="password"
            label="New password"
            type="password"
            error={passHelper ? true : false}
            helperText={passHelper}
            onChange={validatePassword}
            ref={(input) => (password = input)}
            fullWidth
            className={classes.textField}
          />
          <TextField
            error={confirmHelper ? true : false}
            id="confirm"
            helperText={confirmHelper}
            label="Confirm New password"
            onChange={validatePassword}
            type="password"
            fullWidth
            className={classes.textField}
          />
          <Button
            disabled={!touched || confirmHelper || passHelper}
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
    </Grid>
  );
};
