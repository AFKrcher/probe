import React from "react";
// Imports
import { useLocation, useHistory } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";

// @material-ui
import { Grid } from "@material-ui/core";

export const Verify = () => {
  const location = useLocation();

  const token = location.search.slice(7, location.search.length);
  Accounts.verifyEmail(token, (res, err) => {
    console.log(res, err);
  });

  return <Grid container justifyContent="center" alignItems="center"></Grid>;
};
