import React from "react";
// Imports
import { Route, Redirect } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

// @material-ui
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  spinner: {
    color: theme.palette.text.primary,
    marginTop: "30vh",
  },
}));

export default function ProtectedRoute({
  component: Component,
  loginRequired,
  requiredRoles,
}) {
  const classes = useStyles();

  const [user, roles, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("roles");
    const roles = Roles.getRolesForUser(Meteor.userId());
    const user = Meteor.user()?.username;
    return [user, roles, !sub.ready()];
  });

  const roleCheck = () => {
    // ensure that every role that is required to access the component is present in the user's roles
    return requiredRoles
      ? requiredRoles.every((role) => roles.includes(role))
      : true;
  };

  const loginCheck = () => {
    // if login is required, then return the user and isLoading booleans to check for user prior to loading the component
    return loginRequired ? user : user ? false : true
  };

  return !isLoading ? (
    <Route
      render={(props) => {
        if (roleCheck() && loginCheck()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  ) : (
    <div className={classes.spinnerContainer}>
      <CircularProgress className={classes.spinner} size={100} thickness={3} />
    </div>
  );
}
