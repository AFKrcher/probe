import React, { useState, useEffect } from "react";
// Imports
import { useLocation, useHistory } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";

// @material-ui
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

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

  const [passErr, setPassErr] = useState();
  const [confirmErr, setConfirmErr] = useState();
  const [disabled, setDisabled] = useState(true);

  const location = useLocation();
  const history = useHistory();

  const token = location.search.slice(7, location.search.length);

  useEffect(() => {
    if (!token) history.push("/");
  }, []);

  const handleReset = (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("password").value;
    Accounts.resetPassword(token, newPassword, (err, res) => {
      if (err) alert(err?.reason);
      if (res) alert("Password updated.");
    });
  };

  const validatePassword = () => {
    let pass = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    if (pass && pass.length < 8) {
      setPassErr(
        "Must be at least 8 characters long, and should contain at least 1 lowercase, 1 uppercase, and 1 special character"
      );
    } else {
      setPassErr(null);
    }
    if (pass && confirm) {
      if (confirm === pass) {
        setConfirmErr(null);
        setDisabled(false);
      } else {
        setConfirmErr("Passwords do not match");
        setDisabled(true);
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
            label="Confirm New password"
            onChange={validatePassword}
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
    </Grid>
  );
};
