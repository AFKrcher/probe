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
    marginRight: 10,
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
    <div className={classes.root}>
    <AppBar className={classes.navbar} position="sticky">
      <Toolbar className={classes.toolbar}>
        <div className={classes.links}>
          <Tooltip title="To Home">
            <Typography
              variant="h4"
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
            size="medium"
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
            size="medium"
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
            size="medium"
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
            size="medium"
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
        </div>
          <div edge="end" className={classes.navBtn}>
            <DropDown theme={theme} toggleTheme={toggleTheme} />
          </div>
      </Toolbar>
    </AppBar>
    </div>
  );
};
