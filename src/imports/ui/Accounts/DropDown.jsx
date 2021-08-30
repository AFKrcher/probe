import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";

// @material-ui
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import StarIcon from "@material-ui/icons/Star";
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

export const DropDown = () => {
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
        Hi {user ? user : "Login"}
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
      {user ? (
        <>
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            {user}
          </Button>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
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
              <ListItemText primary="Settings" />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" onClick={() => Meteor.logout()} />
            </StyledMenuItem>
          </StyledMenu>
        </>
      ) : (
        <>
          <Button component={Link} to="/login">
            Login
          </Button>
        </>
        /* 
        <>
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            Login
          </Button>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <form onSubmit={loginUser}>
              <StyledMenuItem>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <input type="text" ref={(input) => (username = input)} />
                <ListItemText primary="Username" />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemIcon>
                  <VpnKeyIcon fontSize="small" />
                </ListItemIcon>
                <input type="password" ref={(input) => (password = input)} />
                <ListItemText primary="Password" />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Login" onClick={loginUser} />
              </StyledMenuItem>
              <Button type="submit">Login</Button>
            </form>
          </StyledMenu>
        </>
        */
      )}
    </div>
  );
};
