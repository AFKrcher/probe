import React, { useState, useEffect, useContext } from "react";
// Imports
import { useLocation, useHistory } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { isValidPassword, isConfirmedPassword } from "/imports/validation/accountYupShape";

// @material-ui
import { Grid, Button, makeStyles, TextField, Typography, Paper } from "@material-ui/core";
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";

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
    marginTop: 20
  },
  registerButton: {
    marginTop: 20
  }
}));

export const ResetPassword = () => {
  const classes = useStyles();

  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } = useContext(HelpersContext);

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
      if (err) {
        setAlert({
          title: "Error Encountered",
          text: err.reason,
          closeAction: "Okay"
        });
        setOpenAlert(true);
      }
      if (res) {
        setSnack("Your password has been successfully reset!");
        setOpenSnack(true);
      }
    });
  };

  const validatePassword = () => {
    const newPassword = document.getElementById("password")?.value;
    const confirm = document.getElementById("confirm")?.value;

    if (!isValidPassword(null, newPassword)) {
      if (newPassword.length < 8) {
        setPassErr(newPassword.length > 128 ? "Cannot be longer than 128 characters" : "Must be at least 8 characters long");
      }
    } else {
      setPassErr();
      setDisabled(false);
    }

    if (!isConfirmedPassword(newPassword, confirm)) {
      setConfirmErr("Passwords do not match");
    } else {
      setConfirmErr();
      setDisabled(false);
    }

    if (newPassword || confirm) {
      if (newPassword && confirm) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnack={snack} />
      <Paper className={classes.formContainer}>
        <Typography variant="h4" className={classes.header}>
          <b>Reset Password</b>
        </Typography>
        <form onSubmit={handleReset}>
          <TextField
            autoFocus={true}
            id="password"
            label="New password"
            type="password"
            error={passErr ? true : false}
            helperText={passErr}
            onChange={validatePassword}
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
          <Button disabled={disabled} variant="outlined" className={classes.loginButton} color="primary" type="submit" fullWidth>
            Reset Password
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};
