import React from "react";
// Imports
import { Link } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize.jsx";

// @material-ui
import { makeStyles, Paper, Divider } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import ContactIcon from "@material-ui/icons/Email";
import PolicyIcon from "@material-ui/icons/Policy";
import TermsIcon from "@material-ui/icons/FindInPage";

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
    borderRadius: 0
  },
  probe: {
    color: theme.palette.tertiary.main,
    marginRight: 2
  },
  link: {
    color: theme.palette.text.primary,
    filter: `drop-shadow(1px 1px 1px ${theme.palette.tertiary.shadow})`,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.info.main
    }
  },
  linkElementsContainer: {
    display: "flex"
  },
  gitHub: {
    marginTop: 10,
    marginLeft: 2,
    color: theme.palette.text.primary,
    filter: `drop-shadow(3px 2px 2px ${theme.palette.tertiary.shadow})`,
    "&:hover": {
      color: theme.palette.info.main,
      filter: "none",
      cursor: "pointer"
    }
  },
  footerIcon: {
    margin: "10px 2.5px 0px 2.5px",
    color: theme.palette.text.primary
  },
  divider: {
    margin: 10
  }
}));

const footerIconsBreakPoint = 475;

export const Footer = () => {
  const classes = useStyles();

  const [width] = useWindowSize();

  return (
    <Paper className={classes.root} elevation={5}>
      <Link to="/" className={classes.link}>
        <b className={classes.probe}>PROBE</b>
      </Link>
      <Divider orientation="vertical" variant="middle" className={classes.divider} flexItem />
      <Link to="/terms" className={classes.link}>
        {width > footerIconsBreakPoint ? (
          <div className={classes.linkElementsContainer}>
            <TermsIcon fontSize="small" className={classes.footerIcon} />
            Terms
          </div>
        ) : (
          <TermsIcon fontSize="small" className={classes.footerIcon} />
        )}
      </Link>
      <Divider orientation="vertical" variant="middle" className={classes.divider} flexItem />
      <Link to="/privacypolicy" className={classes.link}>
        {width > footerIconsBreakPoint ? (
          <div className={classes.linkElementsContainer}>
            <PolicyIcon fontSize="small" className={classes.footerIcon} />
            Privacy Policy
          </div>
        ) : (
          <PolicyIcon fontSize="small" className={classes.footerIcon} />
        )}
      </Link>
      <Divider orientation="vertical" variant="middle" className={classes.divider} flexItem />
      <a target="_blank" rel="noopener noreferrer" href="mailto:justinthelaw@gmail.com" className={classes.link}>
        {width > footerIconsBreakPoint ? (
          <div className={classes.linkElementsContainer}>
            <ContactIcon fontSize="small" className={classes.footerIcon} />
            Contact Us
          </div>
        ) : (
          <ContactIcon fontSize="small" className={classes.footerIcon} />
        )}
      </a>
      <Divider orientation="vertical" variant="middle" className={classes.divider} flexItem />
      <a target="_blank" rel="noreferrer" href="https://github.com/afkrcher/probe">
        <GitHubIcon fontSize="small" className={classes.gitHub} />
      </a>
    </Paper>
  );
};
