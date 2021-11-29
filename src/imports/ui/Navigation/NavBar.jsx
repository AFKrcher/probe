import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import useWindowSize from "../hooks/useWindowSize.jsx";
import { Link, useHistory, useLocation } from "react-router-dom";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { DropDown } from "../Navigation/DropDown";

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
  },
  menuIcon: {
    color: theme.palette.primary.main,
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`
  }
}));

const actionsBreak = 725;

export const NavBar = ({ theme, toggleTheme }) => {
  const [user] = useTracker(() => {
    const user = Meteor.user()?.username;
    return [user];
  });

  const { setOpenAlert, setOpenSnack } = useContext(HelpersContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();

  const [width] = useWindowSize();

  const location = useLocation();
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearPopups = () => {
    setOpenAlert(false);
    setOpenSnack(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await clearPopups();
    await Meteor.logout();
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      history.push("/");
    }
  };

  const handleAPI = () => {
    window.open(`${Meteor.absoluteUrl("/api")}`, "_blank").focus();
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.navbar} position="sticky">
        <Toolbar className={classes.toolbar}>
          <div className={classes.links}>
            <Typography variant="h5" className={classes.logo} component={Link} onClick={clearPopups} to="/">
              <b>PROBE</b>
            </Typography>
            {width > actionsBreak && (
              <React.Fragment>
                <Button
                  id="home-button"
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={clearPopups}
                  to="/">
                  <span className={classes.navButtonText}>Home</span>
                </Button>
                <Button
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={clearPopups}
                  id="sat-table-button"
                  to="/satellites">
                  <span className={classes.navButtonText}>Satellites</span>
                </Button>
                <Button
                  id="schema-table-button"
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={clearPopups}
                  to="/schemas">
                  <span className={classes.navButtonText}>Schemas</span>
                </Button>
                <Button
                  id="about-button"
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={clearPopups}
                  to="/about">
                  <span className={classes.navButtonText}>About</span>
                </Button>
                <Button id="api-button" size="medium" className={classes.navButtonAPI} onClick={handleAPI}>
                  <span className={classes.navButtonText}>API</span>
                </Button>
              </React.Fragment>
            )}
          </div>
          <DropDown
            menuIcon={classes.menuIcon}
            toggleTheme={toggleTheme}
            theme={theme}
            handleClick={handleClick}
            anchorEl={anchorEl}
            handleClose={handleClose}
            handleLogout={handleLogout}
            handleAPI={handleAPI}
            clearPopups={clearPopups}
            user={user}
            smallNav={width < actionsBreak}
          />
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
