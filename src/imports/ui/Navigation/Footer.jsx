import React from "react";
// Imports
import { Link } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize.jsx";

// @material-ui
import { makeStyles, Paper, Divider } from "@material-ui/core";
import ContactIcon from "@material-ui/icons/Email";
import PolicyIcon from "@material-ui/icons/Policy";
import TermsIcon from "@material-ui/icons/FindInPage";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.navigation.main,
    width: "100%",
    height: "100%",
    lineHeight: "35px",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 0
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.info.main
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
      <Link to="/terms" className={classes.link}>
        {width > footerIconsBreakPoint ? "Terms" : <TermsIcon fontSize="small" className={classes.footerIcon} />}
      </Link>
      <Divider orientation="vertical" variant="middle" className={classes.divider} flexItem />
      <Link to="/privacypolicy" className={classes.link}>
        {width > footerIconsBreakPoint ? (
          "Privacy Policy"
        ) : (
          <PolicyIcon fontSize="small" className={classes.footerIcon} />
        )}
      </Link>
      <Divider orientation="vertical" variant="middle" className={classes.divider} flexItem />
      <a target="_blank" rel="noopener noreferrer" href="mailto:justinthelaw@gmail.com" className={classes.link}>
        {width > footerIconsBreakPoint ? "Contact Us" : <ContactIcon fontSize="small" className={classes.footerIcon} />}
      </a>
      <Divider orientation="vertical" variant="middle" className={classes.divider} flexItem />
      <a target="_blank" rel="noreferrer" href="https://github.com/afkrcher/probe/releases" className={classes.link}>
        <div>PROBE v1.0.1</div>
      </a>
    </Paper>
  );
};
