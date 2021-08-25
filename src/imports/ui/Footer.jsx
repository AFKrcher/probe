import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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
    <footer className="footer">
      <div className="container">
        <span className="text-muted">
          2021 - OpenOrbit -{" "}
          <a href="" className={classes.link}>
            Terms
          </a>{" "}
          -{" "}
          <a href="" className={classes.link}>
            Privacy Policy
          </a>
        </span>
      </div>
    </footer>
  );
};
