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

export const Verify = () => {
  const classes = useStyles();
  const [passHelper, setPassHelper] = useState();
  const [confirmHelper, setConfirmHelper] = useState();
  const [touched, setTouched] = useState(false);

  const location = useLocation();
  const token = location.search.slice(7, location.search.length);
  Accounts.verifyEmail(token, (res, err) =>{
    console.log(res, err)
  })
  console.log(token)

  return (
    <Grid container justifyContent="center" alignItems="center">
      
    </Grid>
  );
};
