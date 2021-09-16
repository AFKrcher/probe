import React from "react";

// @material-ui
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
}));

export const Terms = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3">
        Terms
      </Typography>
      <p>

      </p>
    </div>
  );
};
