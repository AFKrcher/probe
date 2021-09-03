import React, { useState } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";

// @material-ui
import {
  withStyles,
  makeStyles,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import StarIcon from "@material-ui/icons/Star";
import BrightnessHigh from "@material-ui/icons/BrightnessHigh";
import Brightness2 from "@material-ui/icons/Brightness2";
import { themes } from "../css/Themes.jsx";

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
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export const DropDown = ({ theme, toggleTheme }) => {
  let user = useTracker(() => Meteor.user()?.username, []);

  const userMgmt = () => {
    let userNav = (
      <Button
        disableElevation
        className={classes.navBtn}
        component={Link}
        onClick={() => {
          setOpenAlert(false);
          setOpenSnack(false);
        }}
        to={user ? "/profile" : "/login"}
      >
        Hi {user ? "Options" : "Login"}
      </Button>
    );
    return userNav;
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick} disableElevation>
        <SettingsIcon fontSize="medium" />
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={toggleTheme}>
          <ListItemIcon>
            {theme === themes.dark ? (
              <Brightness2 aria-label="dark theme" fontSize="small" />
            ) : (
              <BrightnessHigh aria-label="light theme" />
            )}
          </ListItemIcon>
          <ListItemText primary="Toggle Theme" fontSize="small" />
        </StyledMenuItem>
        {user ? (
          <div>
            <StyledMenuItem>
              <ListItemIcon>
                <StarIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={`${user}'s Settings`} />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" onClick={() => Meteor.logout()} />
            </StyledMenuItem>
          </div>
        ) : (
          <div>

          <StyledMenuItem component={Link} to="/login">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </StyledMenuItem>
          <StyledMenuItem component={Link} to="/register">
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Register" />
        </StyledMenuItem>
        </div>
        )}
      </StyledMenu>
    </div>
    );
};
