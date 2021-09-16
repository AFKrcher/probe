import React from "react";

// @material-ui
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
}));

export const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3">
        Privacy Policy
      </Typography>
      <p>

      </p>
    </div>
  );
};
