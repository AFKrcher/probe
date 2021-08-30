import React from "react";

// @material-ui
import { makeStyles, Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footer: {
    position: "relative",
    bottom: 0,
    width: "100%",
    height: "50px",
    lineHeight: "60px",
    textAlign: "center",
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
    <footer className={classes.footer}>
        2021 - OpenOrbit -{" "}
      <a href="" className={classes.link}>
        Terms
      </a>{" "}
      -{" "}
      <a href="" className={classes.link}>
        Privacy Policy
      </a>
    </footer>
  );
};
