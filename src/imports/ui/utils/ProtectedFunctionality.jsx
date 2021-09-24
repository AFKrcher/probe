import React from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";

// @material-ui
import Skeleton from "@material-ui/lab/Skeleton";

export default function ProtectedFunctionality({
  component: Component,
  loginRequired,
  requiredRoles,
  disableIfLoggedIn,
}) {
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
    if (!disableIfLoggedIn) return loginRequired ? user : true;
    return false
  };

  return !isLoading ? (
    roleCheck() && loginCheck() ? (
      <Component />
    ) : null
  ) : (
    <Skeleton variant="rect" style={{ borderRadius: 5 }}>
      <Component />
    </Skeleton>
  );
}
