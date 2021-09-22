import React, { useState } from "react";
// Imports
import { useHistory } from "react-router";
import { Roles } from "meteor/alanning:roles";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";

// @material-ui
import {
  withStyles,
  Menu,
  MenuItem,
  Button,
  Divider,
} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import StarIcon from "@material-ui/icons/Star";
import BrightnessHigh from "@material-ui/icons/BrightnessHigh";
import Brightness2 from "@material-ui/icons/Brightness2";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import SatelliteIcon from "@material-ui/icons/Satellite";
import StorageIcon from "@material-ui/icons/Storage";
import ImportContacts from "@material-ui/icons/ImportContacts";
import { themes } from "../css/Themes.jsx";

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

export const SmallNav = ({ theme, toggleTheme }) => {
  const history = useHistory();

  const [user, roles, isLoadingRoles] = useTracker(() => {
    const subRoles = Meteor.subscribe("roles");
    const user = Meteor.user()?.username;
    const roles = Roles.getRolesForUser(Meteor.userId());
    return [user, roles, !subRoles.ready()];
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    Meteor.logout();
    setTimeout(() => history.push("/"));
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick} id="drop-down" disableElevation>
        <MenuIcon fontSize="medium" />
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem id="home" component={Link} to="/">
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </StyledMenuItem>
        <StyledMenuItem id="satellites" component={Link} to="/satellites">
          <ListItemIcon>
            <SatelliteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Satellites" />
        </StyledMenuItem>
        <StyledMenuItem id="schemas" component={Link} to="/schemas">
          <ListItemIcon>
            <StorageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Schemas" />
        </StyledMenuItem>
        <StyledMenuItem id="about" component={Link} to="/about">
          <ListItemIcon>
            <ImportContacts fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="About" />
        </StyledMenuItem>
        <Divider component="li"/>
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
            <StyledMenuItem id="favorites">
              <ListItemIcon>
                <StarIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </StyledMenuItem>
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
            {roles.indexOf("admin") !== -1 ? (
              <StyledMenuItem id="admin" component={Link} to="/admin">
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText id="role" primary="Admin Page" />
              </StyledMenuItem>
            ) : null}
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
