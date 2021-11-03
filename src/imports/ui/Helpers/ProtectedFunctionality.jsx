import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
// Imports
import { Roles } from "meteor/alanning:roles";
import { useTracker } from "meteor/react-meteor-data";

// @material-ui
import { Skeleton } from "@material-ui/lab";

export default function ProtectedFunctionality({
  component: Component,
  loginRequired,
  requiredRoles,
  iconButton,
  skeleton,
}) {
  const [user, roles, verified, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("roles");
    const roles = Roles.getRolesForUser(Meteor.userId());
    const user = Meteor.user({ fields: { username: 1 } })?.username;
    const verified = Meteor.user({ fields: { "emails.verified": 1 } })
      ?.emails[0].verified;
    return [user, roles, verified, !sub.ready()];
  });

  const roleCheck = () => {
    // ensure that every role that is required to access the component is present in the user's roles
    return requiredRoles
      ? requiredRoles.map((role) => roles.includes(role)).includes(true)
      : true;
  };

  const loginCheck = () => {
    // if login is required, then return the user and isLoading booleans to check for user prior to loading the component
    return loginRequired ? user : true;
  };

  return !isLoading ? (
    roleCheck() && loginCheck() && verified ? (
      <Component />
    ) : null
  ) : skeleton || skeleton === undefined ? (
    <Skeleton
      variant={iconButton ? "circle" : "rect"}
      style={iconButton ? {} : { borderRadius: 5 }}
    >
      <Component />
    </Skeleton>
  ) : null;
}

// Prop checking
ProtectedFunctionality.propTypes = {
  component: PropTypes.elementType,
  loginRequired: PropTypes.bool,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  iconButton: PropTypes.bool,
  skeleton: PropTypes.bool,
};
