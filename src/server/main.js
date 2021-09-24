import { Meteor } from "meteor/meteor";
import * as Yup from "yup";
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import "./routes";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";
import helmet from "helmet";
import { helmetOptions } from "./helmet.js";

const fs = Npm.require("fs");

const self = "'self'";
const data = "data:";
const unsafeEval = "'unsafe-eval'";
const unsafeInline = "'unsafe-inline'";

const isValidEmail = (oldEmail, newEmail) => {
  const schema = Yup.string().email();
  return schema.isValidSync(newEmail) && oldEmail !== newEmail;
};

const isValidUsername = (oldUsername, newUsername) => {
  const regex = /^[a-zA-Z0-9]{4,}$/g;
  return regex.test(newUsername) && oldUsername !== newUsername;
};

Meteor.startup(() => {
  // See helmet.js for Content Security Policy (CSP) options
  WebApp.connectHandlers.use(helmet(helmetOptions()));

  // Account publications, methods, and seeds
  Roles.createRole("admin", { unlessExists: true });
  Roles.createRole("moderator", { unlessExists: true });
  Roles.createRole("dummies", { unlessExists: true });

  // Email verificationa dn password reset emails
  Accounts.config({
    sendVerificationEmail: false,
  });
  Accounts.urls.resetPassword = (token) => {
    return Meteor.absoluteUrl(`/reset?token=${token}`);
  };
  Accounts.urls.verifyEmail = (token) => {
    return Meteor.absoluteUrl(`/verify?token=${token}`);
  };

  // Publish user list and user roles
  Meteor.publish("roles", () => {
    if (Meteor.user()) {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        return [
          Meteor.users.find(),
          Meteor.roles.find(),
          Meteor.roleAssignment.find(),
        ];
      } else {
        return [
          Meteor.users.find({ _id: Meteor.user()._id }),
          Meteor.roles.find({ _id: Meteor.user()._id }),
          Meteor.roleAssignment.find({ _id: Meteor.user()._id }),
        ];
      }
    } else {
      return [];
    }
  });

  Meteor.publish("userList", function () {
    return Meteor.users.find(
      {},
      { fields: { username: 1, emails: 1, roles: 1 } }
    );
  });

  // Account creation and managment methods
  Meteor.methods({
    userExists: (username) => {
      if (Accounts.findUserByUsername(username)) {
        return "Username already exists.";
      }
    },

    emailExists: (email) => {
      if (Accounts.findUserByEmail(email)) {
        return `Email, ${email}, already in use`;
      } else {
        return;
      }
    },

    addUserToRole: (user, role) => {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        Roles.addUsersToRoles(Accounts.findUserByUsername(user.username), role);
        if (role === "dummies") {
          Meteor.users.update(
            user._id,
            { $set: { "services.resume.loginTokens": [] } },
            { multi: true }
          );
        }
        return `${user} added to ${role}`;
      }
    },

    deleteAccount: (id) => {
      if (
        Meteor.userId() === id ||
        Roles.userIsInRole(Meteor.userId(), "admin")
      ) {
        Meteor.users.remove({ _id: id });
        return `User ${id} has successfully been deleted`;
      } else {
        return `Encountered an error while trying to delete user ${id}`;
      }
    },

    updateUsername: (id, user, newUsername) => {
      if (isValidUsername(user, newUsername)) {
        Accounts.setUsername(id, newUsername);
        return `Your username has been successfully changed from  ${user} to ${newUsername}`;
      } else {
        return `The provided username, ${newUsername}, is invalid`;
      }
    },

    updateEmail: (id, email, newEmail) => {
      if (isValidEmail(email, newEmail)) {
        Accounts.removeEmail(id, email);
        Accounts.addEmail(id, newEmail);
        Accounts.sendVerificationEmail(id, newEmail);
        return `Your email has been successfully changed from  ${email} to ${newEmail}`;
      } else {
        return `The provided email, ${newEmail}, is invalid`;
      }
    },

    addToFavorites: (user, noradID) => {
      let favorites = Meteor.user().favorites;
      if (favorites.indexOf(noradID) === -1) {
        favorites.push(noradID);
      } else {
        favorites.splice(favorites.indexOf(noradID), 1);
      }
      Meteor.users.update(user, { $set: { favorites: favorites } });
      return Meteor.user().favorites;
    },

    removeRole: (id, role) => {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        Roles.removeUsersFromRoles(id, role);
        return `User ${id} added to role ${role}`;
      } else {
        return `Encountered an error while trying to add user ${id} to role ${role}`;
      }
    },

    checkIfBanned: (user) => {
      let userFinder =
        Accounts.findUserByUsername(user) || Accounts.findUserByEmail(user);
      return Roles.userIsInRole(userFinder?._id, "dummies");
    },
    sendEmail: (id, email) => {
      Accounts.sendVerificationEmail(id, email);
    },
  });

  Accounts.onCreateUser((options, user) => {
    const username = options.username;
    const email = options.email;
    if (!isValidEmail(email) || !isValidUsername(username)) {
      return "Invalid username or email";
    } else {
      user.favorites = [];
      user.roles = [];
      return user;
    }
  });

  // Seed admin account for testing
  Meteor.call("userExists", "admin", (_, res) => {
    if (res) {
      return;
    } else {
      Accounts.createUser({
        email: "admin@gmail.com",
        username: "admin",
        password: "12345678aA!",
      });
      Roles.addUsersToRoles(Accounts.findUserByUsername("admin"), "admin");
    }
  });

  // Satellite and schema publications and seed data
  // Seed schema data
  if (SchemaCollection.find().count() === 0) {
    var jsonObj = [];
    files = fs.readdirSync("./assets/app/schema");
    files.forEach(function (file) {
      data = fs.readFileSync("./assets/app/schema/" + file, "ascii");
      jsonObj.push(JSON.parse(data));
    });
    jsonObj.forEach(function (data) {
      SchemaCollection.insert(data);
    });
  }

  // Seed satellite data
  if (SatelliteCollection.find().count() === 0) {
    var jsonObj = [];
    files = fs.readdirSync("./assets/app/satellite");
    files.forEach(function (file) {
      data = fs.readFileSync("./assets/app/satellite/" + file, "ascii");
      jsonObj.push(JSON.parse(data));
    });
    jsonObj.forEach(function (data) {
      SatelliteCollection.insert(data);
    });
  }

  // Publish satellites collection
  Meteor.publish("satellites", () => {
    return SatelliteCollection.find({});
  });
  // Publish schemas collection
  Meteor.publish("schemas", () => {
    return SchemaCollection.find({});
  });

  // Satellite methods
  Meteor.methods({
    addNewSatellite: (values, user) => {
      console.log(user);
      SatelliteCollection.insert(values);
    },
    updateSatellite: (values, user) => {
      console.log(user);
      SatelliteCollection.update({ _id: values._id }, values);
    },
    deleteSatellite: (values, user) => {
      console.log(user);
      SatelliteCollection.remove(initValues._id);
    },
  });

  // Schema methods
  Meteor.methods({
    addNewSchema: (values, user) => {
      console.log(user);
      SchemaCollection.insert(values);
    },
    updateSchema: (values, user) => {
      console.log(user);
      SchemaCollection.update({ _id: values._id }, values);
    },
    deleteSchema: (values, user) => {
      console.log(user);
      SchemaCollection.remove(values._id);
    },
  });
});
