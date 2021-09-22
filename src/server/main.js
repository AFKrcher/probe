import { Meteor } from "meteor/meteor";
import * as Yup from "yup";
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import "./routes";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";
var fs = Npm.require("fs");

const isValidEmail = (oldEmail, newEmail) => {
  const schema = Yup.string().email();
  return schema.isValidSync(newEmail) && oldEmail !== newEmail;
};

const isValidUsername = (oldUsername, newUsername) => {
  const regex = /^[a-zA-Z0-9]{4,}$/g;
  return regex.test(newUsername) && oldUsername !== newUsername;
};

Meteor.startup(() => {
  // Satellite update methods

  // Account methods
  Roles.createRole("admin", { unlessExists: true });
  Roles.createRole("moderator", { unlessExists: true });
  Roles.createRole("dummies", { unlessExists: true });

  Accounts.config({
    sendVerificationEmail: false,
  });

  Accounts.urls.resetPassword = (token) => {
    return Meteor.absoluteUrl(`/reset?token=${token}`);
  };

  Accounts.urls.verifyEmail = (token) =>{
    return Meteor.absoluteUrl(`/verify?token=${token}`)
  }

  Accounts.onCreateUser((options, user) => {
    const username = options.username;
    const email = options.email;
    if (!isValidEmail(email) || !isValidUsername(username)) {
      return "Invalid username or email";
    } else {
      user.roles = [];
      user.favorites = [];
      return user
    }
  });

  Meteor.publish("roles", () => {
    if (Meteor.user()) {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        return [
          Meteor.users.find(),
          Meteor.roles.find(),
          Meteor.roleAssignment.find(),
        ];
      } else {
        return Meteor.roleAssignment.find({ "user._id": Meteor.user()._id });
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

  Meteor.methods({
    sendEmail: (id, email) => {
      Accounts.sendVerificationEmail(id, email);
    },
  });

  Meteor.methods({
    userExists: (username) => {
      if (Accounts.findUserByUsername(username)) {
        return "Username already exists.";
      }
    },
  });

  // seed admin account for testing
  Meteor.call("userExists", "admin", (res, err) => {
    if (err) {
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

  Meteor.methods({
    checkIfBanned: (user) => {
      let userFinder =
        Accounts.findUserByUsername(user) || Accounts.findUserByEmail(user);
      return Roles.userIsInRole(userFinder?._id, "dummies");
    },
  });

  Meteor.methods({
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
  });

  Meteor.methods({
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
  });

  Meteor.methods({
    emailExists: (email) => {
      if (Accounts.findUserByEmail(email)) {
        return `Email, ${email}, already in use.`;
      } else {
        return 
      }
    },
  });

  Meteor.methods({
    updateEmail: (id, email, newEmail) => {
      if (isValidEmail(email, newEmail)) {
        Accounts.removeEmail(id, email);
        Accounts.addEmail(id, newEmail);
        Accounts.sendVerificationEmail(id, newEmail);
        return `Your email has been successfully changed from  ${email} to ${newEmail}`;
      } else {
        return `The provided email, ${newEmail}, is invalid.`;
      }
    },
  });

  Meteor.methods({
    updateUsername: (id, user, newUsername) => {
      if (isValidUsername(user, newUsername)) {
        Accounts.setUsername(id, newUsername);
        return `Your username has been successfully changed from  ${user} to ${newUsername}`;
      } else {
        return `The provided username, ${newUsername}, is invalid.`;
      }
    },
  });

  Meteor.methods({
    deleteAccount: (id) => {
      if (
        Meteor.userId() === id ||
        Roles.userIsInRole(Meteor.userId(), "admin")
      ) {
        Meteor.users.remove({ _id: id });
        return `User ${id} deleted.`;
      } else {
        return `Encountered an error while trying to delete user ${id}.`;
      }
    },
  });

  Meteor.methods({
    removeRole: (id, role) => {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        Roles.removeUsersFromRoles(id, role);
        return `User ${id} added to role ${role}.`;
      } else {
        return `Encountered an error while trying to add user ${id} to role ${role}`;
      }
    },
  });

  // Start-up seed data methods
  if (SchemaCollection.find().count() === 0) {
    var jsonObj = [];

    files = fs.readdirSync("./assets/app/schema");

    // Insert seed schema data
    files.forEach(function (file) {
      data = fs.readFileSync("./assets/app/schema/" + file, "ascii");
      jsonObj.push(JSON.parse(data));
    });

    // Write to Mongo
    jsonObj.forEach(function (data) {
      SchemaCollection.insert(data);
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

  // Insert seed satellite data
  if (SatelliteCollection.find().count() === 0) {
    var jsonObj = [];

    files = fs.readdirSync("./assets/app/satellite");

    // Insert seed satellite data
    files.forEach(function (file) {
      data = fs.readFileSync("./assets/app/satellite/" + file, "ascii");
      jsonObj.push(JSON.parse(data));
    });

    // Write to Mongo
    jsonObj.forEach(function (data) {
      SatelliteCollection.insert(data);
    });
  }
});
