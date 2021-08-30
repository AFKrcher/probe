import React from "react";

// @material-ui
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    width: "100%",
    height: "25px",
    lineHeight: "15px",
  },
  link: {
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.info.light,
    },
  },
}));

export const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        2021 - OpenOrbit -{" "}
      <a href="" className={classes.link}>
        Terms
      </a>{" "}
      -{" "}
      <a href="" className={classes.link}>
        Privacy Policy
      </a>
    </div>
  );
};
