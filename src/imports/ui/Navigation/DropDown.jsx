import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { Link, useLocation, useHistory } from "react-router-dom";
import ProtectedFunctionality from "../Helpers/ProtectedFunctionality.jsx";

// @material-ui
import {
  withStyles,
  makeStyles,
  Menu,
  MenuItem,
  Button,
} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import BrightnessHigh from "@material-ui/icons/BrightnessHigh";
import Brightness2 from "@material-ui/icons/Brightness2";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

// CSS
import { themes } from "../css/Themes.jsx";

const useStyles = makeStyles((theme) => ({
  menuIcon: {
    color: theme.palette.tertiary.main,
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`,
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
  const classes = useStyles();

  const [user] = useTracker(() => {
    const user = Meteor.user()?.username;
    return [user];
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const location = useLocation();
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await Meteor.logout();
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      history.push("/");
    }
  };

  return (
    <React.Fragment>
      <Button
        onClick={handleClick}
        id="drop-down"
        disableElevation
        className={classes.menuIcon}
      >
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
            <StyledMenuItem id="settings" component={Link} to="/settings">
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                id="logout"
                primary="Logout"
                onClick={handleLogout}
              />
            </StyledMenuItem>
            <ProtectedFunctionality
              component={() => {
                return (
                  <StyledMenuItem id="admin" component={Link} to="/admin">
                    <ListItemIcon>
                      <SupervisorAccountIcon />
                    </ListItemIcon>
                    <ListItemText id="role" primary="Admin Page" />
                  </StyledMenuItem>
                );
              }}
              requiredRoles={["admin", "moderator"]}
              loginRequired={true}
              skeleton={false}
            />
          </div>
        ) : (
          <div>
            <StyledMenuItem id="login" component={Link} to="/login">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </StyledMenuItem>
            <StyledMenuItem id="register" component={Link} to="/register">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </StyledMenuItem>
          </div>
        )}
      </StyledMenu>
    </React.Fragment>
  );
};
