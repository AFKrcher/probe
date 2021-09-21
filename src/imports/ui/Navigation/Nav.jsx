import React, { useContext } from "react";

// Imports
import useWindowSize from "../Hooks/useWindowSize.jsx";
import { Link } from "react-router-dom";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { DropDown } from "../Navigation/DropDown";

// @material-ui
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  makeStyles,
  Tooltip,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: theme.palette.navigation.main,
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  logo: {
    color: theme.palette.text.primary,
    textDecoration: "none",
    marginRight: 0,
    fontSize: "30px",
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  links: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  navButton: {
    backgroundColor: theme.palette.navigation.main,
    color: theme.palette.text.primary,
    marginLeft: "20px",
    "&:hover": {
      backgroundColor: theme.palette.navigation.hover,
      color: theme.palette.text.primary,
    },
  },
  dropDown: {
    backgroundColor: theme.palette.navigation.main,
    color: theme.palette.text.primary,
    borderRadius: 5,
    "&:hover": {
      backgroundColor: theme.palette.navigation.hover,
      color: theme.palette.text.primary,
    },
  },
}));

export const Nav = ({ theme, toggleTheme }) => {
  const { setOpenAlert, setOpenSnack } = useContext(HelpersContext);

  const classes = useStyles();

  const [width, height] = useWindowSize();

  return (
    <div className={classes.root}>
      <AppBar className={classes.navbar} position="sticky">
        <Toolbar className={classes.toolbar}>
          <div className={classes.links}>
            <Tooltip
              title={
                <Typography color="inherit" variant="body2">
                  <strong>P</strong>ublically <strong>R</strong>esearched{" "}
                  <strong>OB</strong>s<strong>E</strong>rvatory
                </Typography>
              }
              arrow
              placement="bottom-start"
            >
              <Typography
                variant="h5"
                className={classes.logo}
                component={Link}
                onClick={() => {
                  setOpenAlert(false);
                  setOpenSnack(false);
                }}
                to="/"
              >
                <strong>PROBE</strong>
              </Typography>
            </Tooltip>
            {width > 620 ? (
              <React.Fragment>
                <Button
                  disableElevation
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={() => {
                    setOpenAlert(false);
                    setOpenSnack(false);
                  }}
                  to="/"
                >
                  Home
                </Button>
                <Button
                  disableElevation
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={() => {
                    setOpenAlert(false);
                    setOpenSnack(false);
                  }}
                  to="/satellites"
                >
                  Satellites
                </Button>
                <Button
                  disableElevation
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={() => {
                    setOpenAlert(false);
                    setOpenSnack(false);
                  }}
                  to="/schemas"
                >
                  Schemas
                </Button>
                <Button
                  disableElevation
                  size="medium"
                  className={classes.navButton}
                  component={Link}
                  onClick={() => {
                    setOpenAlert(false);
                    setOpenSnack(false);
                  }}
                  to="/about"
                >
                  About
                </Button>
              </React.Fragment>
            ) : null}
          </div>
          <div edge="end" className={classes.dropDown}>
            <DropDown theme={theme} toggleTheme={toggleTheme} />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
