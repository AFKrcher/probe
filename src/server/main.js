import { Meteor } from "meteor/meteor";
import * as Yup from "yup";
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import "./routes";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";
var fs = Npm.require("fs");

const isValidEmail = (value) => {
  const schema = Yup.string().email();
  return schema.isValidSync(value);
};

const isValidUsername = (value) => {
  const regex = /^[a-zA-Z0-9]{4,}$/g;
  return regex.test(value);
};

const isValidPassword = (value) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
  return regex.test(value);
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

  Accounts.onCreateUser((options, user) => {
    const username = options.username;
    const email = options.email;
    const password = options.password;
    if (
      !isValidEmail(email) ||
      !isValidUsername(username) ||
      !isValidPassword(password)
    ) {
      return "failure";
    } else {
      user.roles = [];
      user.favorites = [];
      return user;
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
        password: "admin",
      });
      Roles.addUsersToRoles(Accounts.findUserByUsername("admin"), "admin");
    }
  });

  Meteor.methods({
    addToFavorites: (user, noradid) => {
      let favorites = Meteor.user().favorites;
      if (favorites.indexOf(noradid) === -1) {
        favorites.push(noradid);
      } else {
        favorites.splice(favorites.indexOf(noradid), 1);
      }
      Meteor.users.update(user, { $set: { favorites: favorites } });
      return Meteor.user().favorites;
    },
  });

  Meteor.methods({
    addUserToRole: (user, role) => {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        Roles.addUsersToRoles(Accounts.findUserByUsername(user), role);
        return `${user} added to ${role}`;
      }
    },
  });

  Meteor.methods({
    emailExists: (email) => {
      if (Accounts.findUserByEmail(email)) {
        return "Email already in use.";
      }
    },
  });

  Meteor.methods({
    updateEmail: (id, email, newEmail) => {
      Accounts.addEmail(id, newEmail);
      Accounts.sendVerificationEmail(id, newEmail);
      console.log(`user ${id} email changed from ${email} to ${newEmail}`);
      return "success";
      // Accounts.removeEmail(id, email, callback => "Old email removed")
    },
  });

  Meteor.methods({
    updateUsername: (id, newUsername) => {
      Accounts.setUsername(id, newUsername);
      console.log(`user ${id} changed name to ${newUsername}`);
      return "success";
    },
  });

  Meteor.methods({
    deleteAccount: (id) => {
      if (
        Meteor.userId() === id ||
        Roles.userIsInRole(Meteor.userId(), "admin")
      ) {
        Meteor.users.remove({ _id: id });
        console.log(`user ${id} deleted`);
        return "success";
      } else {
        return "nice try";
      }
    },
  });

  Meteor.methods({
    removeRole: (id, role) => {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        Roles.removeUsersFromRoles(id, role);
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
