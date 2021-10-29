import React, { useState } from "react";
// Components
import { Users } from "./Users";
import { ApproveSatellites } from "./ApproveSatellites";
import { ApproveSchemas } from "./ApproveSchemas";
import { ErrorLog } from "./ErrorLog";

// Imports
import ProtectedFunctionality from "../Helpers/ProtectedFunctionality.jsx";

// @material-ui
import {
  AppBar,
  Toolbar,
  Button,
  makeStyles,
  Divider,
  Paper,
  Typography,
} from "@material-ui/core";

// CSS
import "../css/tabs.css";

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: theme.palette.navigation.main,
    marginBottom: 10,
  },
  tabContainer: {
    marginTop: 5,
    overflowY: "auto",
  },
  divider: {
    margin: 10,
  },
  contentContainer: {
    marginBottom: 5,
    width: "100%",
  },
  gridCaption: {
    marginLeft: 5,
    color: theme.palette.text.disabled,
  },
}));

export const Admin = () => {
  const classes = useStyles();

  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <React.Fragment>
      <AppBar className={classes.navbar} position="sticky">
        <Toolbar className={classes.tabContainer}>
          <Button
            size="medium"
            style={{ marginLeft: 5, marginRight: 5 }}
            className={
              ("tabButton", toggleState === 1 ? "tabs active-tabs" : "tabs")
            }
            onClick={() => {
              toggleTab(1);
            }}
          >
            Approve Satellites
          </Button>
          <Divider
            orientation="vertical"
            className={classes.divider}
            flexItem
          />
          <Button
            size="medium"
            style={{ marginLeft: 5, marginRight: 5 }}
            className={
              ("tabButton", toggleState === 2 ? "tabs active-tabs" : "tabs")
            }
            onClick={() => {
              toggleTab(2);
            }}
          >
            Approve Schemas
          </Button>
          <Divider
            orientation="vertical"
            className={classes.divider}
            flexItem
          />

          <ProtectedFunctionality
            component={() => {
              return (
                <React.Fragment>
                  <Button
                    size="medium"
                    style={{ marginLeft: 5, marginRight: 5 }}
                    className={
                      ("tabButton",
                      toggleState === 3 ? "tabs active-tabs" : "tabs")
                    }
                    onClick={() => {
                      toggleTab(3);
                    }}
                  >
                    Error Log
                  </Button>
                  <Divider
                    orientation="vertical"
                    className={classes.divider}
                    flexItem
                  />
                  <Button
                    size="medium"
                    style={{ marginLeft: 5, marginRight: 5 }}
                    className={
                      ("tabButton",
                      toggleState === 4 ? "tabs active-tabs" : "tabs")
                    }
                    onClick={() => {
                      toggleTab(4);
                    }}
                  >
                    Users
                  </Button>
                </React.Fragment>
              );
            }}
            requiredRoles={["admin"]}
            loginRequired={true}
            skeleton={false}
          />
        </Toolbar>
      </AppBar>
      <Paper
        elevation={3}
        className={toggleState === 1 ? "tabs active-tabs" : "inactive-tabs"}
      >
        <ApproveSatellites />
      </Paper>
      <Paper
        elevation={3}
        className={toggleState === 2 ? "tabs active-tabs" : "inactive-tabs"}
      >
        <ApproveSchemas />
      </Paper>

      <ProtectedFunctionality
        component={() => {
          return (
            <React.Fragment>
              <Paper
                elevation={3}
                className={
                  toggleState === 3 ? "tabs active-tabs" : "inactive-tabs"
                }
              >
                <ErrorLog />
              </Paper>
              <div
                className={
                  toggleState === 4 ? "tabs active-tabs" : "inactive-tabs"
                }
              >
                <Paper elevation={3} className={classes.contentContainer}>
                  <Users />
                </Paper>
                <Typography variant="caption" className={classes.gridCaption}>
                  Click to interact with a cell, Double-click to view user data
                </Typography>
              </div>
            </React.Fragment>
          );
        }}
        requiredRoles={["admin"]}
        loginRequired={true}
        skeleton={false}
      />
    </React.Fragment>
  );
};
