import React from "react";
// Imports
import { Link } from "react-router-dom";

// @material-ui
import { makeStyles, Paper, Divider } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.navigation.main,
    width: "100%",
    height: "90%",
    position: "relative",
    bottom: -10,
    lineHeight: "40px",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
  link: {
    color: theme.palette.text.primary,
    filter: `drop-shadow(2px 2px 2px ${theme.palette.tertiary.shadow})`,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.info.light,
    },
  },
  gitHub: {
    marginTop: 10,
    color: theme.palette.text.primary,
    filter: `drop-shadow(2px 2px 2px ${theme.palette.tertiary.shadow})`,
    "&:hover": {
      color: "black",
      filter: "none",
      cursor: "pointer",
    },
  },
  divider: {
    margin: 10,
  },
}));

export const Footer = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={5}>
      <Link to="/" className={classes.link}>
        PROBE
      </Link>
      <Divider
        orientation="vertical"
        variant="middle"
        className={classes.divider}
        flexItem
      />
      <Link to="/terms" className={classes.link}>
        Terms
      </Link>
      <Divider
        orientation="vertical"
        variant="middle"
        className={classes.divider}
        flexItem
      />
      <Link to="/privacypolicy" className={classes.link}>
        Privacy Policy
      </Link>
      <Divider
        orientation="vertical"
        variant="middle"
        className={classes.divider}
        flexItem
      />
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/justinthelaw/probe"
      >
        <GitHubIcon fontSize="small" className={classes.gitHub} />
      </a>
    </Paper>
  );
};
