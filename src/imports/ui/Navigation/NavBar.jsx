import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
// Imports
import useWindowSize from "../Hooks/useWindowSize.jsx";
import { Link } from "react-router-dom";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { DropDown } from "../Navigation/DropDown";
import { SmallNav } from "../Navigation/SmallNav";

// @material-ui
import { AppBar, Toolbar, Button, Typography, makeStyles, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 10,
    width: "100%",
    position: "fixed",
    top: 0
  },
  navbar: {
    backgroundColor: theme.palette.navigation.main
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  logo: {
    color: theme.palette.tertiary.main,
    textDecoration: "none",
    marginRight: 0,
    fontSize: "30px",
    filter: `drop-shadow(3px 2px 2px ${theme.palette.tertiary.shadow})`
  },
  links: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center"
  },
  navButton: {
    backgroundColor: theme.palette.navigation.main,
    color: theme.palette.text.primary,
    marginLeft: "20px"
  },
  navButtonAPI: {
    backgroundColor: theme.palette.navigation.main,
    color: theme.palette.text.primary,
    marginLeft: "10px"
  },
  navButtonText: {
    filter: `drop-shadow(2px 2px 2px ${theme.palette.tertiary.shadow})`
  },
  dropDown: {
    backgroundColor: theme.palette.navigation.main,
    color: theme.palette.text.primary,
    borderRadius: 5,
    "&:hover": {
      backgroundColor: theme.palette.navigation.main,
      color: theme.palette.text.primary
    }
  }
}));

const actionsBreak = 725;

export const NavBar = ({ theme, toggleTheme }) => {
  const { setOpenAlert, setOpenSnack } = useContext(HelpersContext);

  const classes = useStyles();

  const [width] = useWindowSize();

  return (
    <div className={classes.root}>
      <AppBar className={classes.navbar} position="sticky">
        <Toolbar className={classes.toolbar}>
          <div className={classes.links}>
            <Typography
              variant="h5"
              className={classes.logo}
              component={Link}
              onClick={() => {
                setOpenAlert(false);
                setOpenSnack(false);
              }}
              to="/">
              <strong>PROBE</strong>
            </Typography>
            {width > actionsBreak ? (
              <React.Fragment>
                <Button
                  id="home-button"
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={() => {
                    setOpenAlert(false);
                    setOpenSnack(false);
                  }}
                  to="/">
                  <span className={classes.navButtonText}>Home</span>
                </Button>
                <Button
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={() => {
                    setOpenAlert(false);
                    setOpenSnack(false);
                  }}
                  id="sat-table-button"
                  to="/satellites">
                  <span className={classes.navButtonText}>Satellites</span>
                </Button>
                <Button
                  id="schema-table-button"
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={() => {
                    setOpenAlert(false);
                    setOpenSnack(false);
                  }}
                  to="/schemas">
                  <span className={classes.navButtonText}>Schemas</span>
                </Button>
                <Button
                  id="about-button"
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={() => {
                    setOpenAlert(false);
                    setOpenSnack(false);
                  }}
                  to="/about">
                  <span className={classes.navButtonText}>About</span>
                </Button>
                <Button
                  id="api-button"
                  size="medium"
                  className={classes.navButtonAPI}
                  onClick={() => {
                    window.open(`${Meteor.absoluteUrl("/api")}`, "_blank").focus();
                  }}>
                  <span className={classes.navButtonText}>API</span>
                </Button>
              </React.Fragment>
            ) : null}
          </div>
          {width > actionsBreak ? (
            <div edge="end" className={classes.dropDown}>
              <DropDown theme={theme} toggleTheme={toggleTheme} />
            </div>
          ) : (
            <SmallNav theme={theme} toggleTheme={toggleTheme} />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

// Prop checking
NavBar.propTypes = {
  theme: PropTypes.object,
  toggleTheme: PropTypes.func
};
