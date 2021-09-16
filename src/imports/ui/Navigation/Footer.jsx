import React from "react";
// Imports
import { Link } from "react-router-dom";

// @material-ui
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    width: "100%",
    height: "20px",
    lineHeight: "10px",
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
      <Link to="/terms" className={classes.link}>
        Terms
      </Link>{" "}
      -{" "}
      <Link to="/privacypolicy" className={classes.link}>
        Privacy Policy
      </Link>
    </div>
  );
};
