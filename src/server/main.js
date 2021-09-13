import { Meteor } from "meteor/meteor";
import validator from "validator";
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import "./routes";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";
import { gridColumnsTotalWidthSelector } from "@material-ui/data-grid";

var fs = Npm.require("fs");

Meteor.startup(() => {
  console.log("users: ", Meteor.users.find().fetch());
  Roles.createRole("admin", { unlessExists: true });
  Roles.createRole("moderator", { unlessExists: true });
  Roles.createRole("user", { unlessExists: true });
  Roles.createRole("dummies", { unlessExists: true });

  Accounts.config({
    // sendVerificationEmail: true,
    sendVerificationEmail: false,
  });
  Accounts.urls.resetPassword = (token) => {
    return Meteor.absoluteUrl(`/reset?token=${token}`);
  };

  Accounts.onCreateUser((options, user) => {
    let username = options.username;
    let email = options.email;
    if (!email || !validator.isEmail(email) || !username || !options.password)
      return;
    return user;
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
      Meteor.users.remove({ _id: id });
      console.log(`user ${id} deleted`);
      return "success";
    },
  });

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
