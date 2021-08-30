import React, {useContext} from "react";

// Imports
import { Link } from "react-router-dom";
import HelpersContext from "../helpers/HelpersContext.jsx";
import { DropDown } from "../Accounts/DropDown";

// @material-ui
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  makeStyles,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { themes } from "../css/Themes.jsx";
import BrightnessHigh from "@material-ui/icons/BrightnessHigh";
import Brightness4 from "@material-ui/icons/Brightness4";

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
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  links: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  navBtn: {
    backgroundColor: theme.palette.navigation.main,
    color: theme.palette.text.primary,
    marginLeft: "20px",
    "&:hover": {
      backgroundColor: theme.palette.navigation.hover,
      color: theme.palette.text.primary,
    },
  },
}));

export const Nav = ({ theme, toggleTheme }) => {


  
  const { setOpenAlert, setOpenSnack } = useContext(HelpersContext);
  const classes = useStyles();
  return (
    <AppBar className={classes.navbar} position="static">
      <Toolbar className={classes.toolbar}>
        <div className={classes.links}>
          <Tooltip title="To Home">
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
              <strong>OpenOrbit</strong>
            </Typography>
          </Tooltip>
          <Button
            disableElevation
            className={classes.navBtn}
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
            className={classes.navBtn}
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
            className={classes.navBtn}
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
            className={classes.navBtn}
            component={Link}
            onClick={() => {
              setOpenAlert(false);
              setOpenSnack(false);
            }}
            to="/about"
          >
            About
          </Button>
          <div className={classes.navBtn}>
            <DropDown />
          </div>
        </div>
        {theme === themes.dark ? (
          <IconButton edge="end" aria-label="light theme" onClick={toggleTheme}>
            <BrightnessHigh />
          </IconButton>
        ) : (
          <IconButton edge="end" aria-label="dark theme" onClick={toggleTheme}>
            <Brightness4 />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};
