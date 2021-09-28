// Dependencies
import * as Yup from "yup";
import helmet from "helmet";
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";

// Imports
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import { helmetOptions } from "./helmet";
import { schemaValidatorShaper } from "./validators/schemaDataFuncs";
import "./routes";

const fs = Npm.require("fs");

const isValidEmail = (oldEmail, newEmail) => {
  const oldCheck = oldEmail ? oldEmail !== newEmail : true;
  const schema = Yup.string().email();
  return schema.isValidSync(newEmail) && oldCheck && newEmail.length < 128;
};

const isValidUsername = (oldUsername, newUsername) => {
  const oldCheck = oldUsername ? oldUsername !== newUsername : true;
  const regex = /^[a-zA-Z0-9]{4,}$/g;
  return regex.test(newUsername) && oldCheck && newUsername.length < 32;
};

isValidPassword = (oldPassword, newPassword) => {
  const oldCheck = oldPassword ? oldPassword !== newPassword : true;
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
  return regex.test(newPassword) && oldCheck && newPassword.length < 128;
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
        return `That email is already in use`;
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
      } else {
        return "Unauthorized [401]";
      }
    },

    getAllUsers: () => {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        return Meteor.users.find({}).fetch();
      } else {
        return [];
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
        return "Unauthorized [401]";
      }
    },

    updateUsername: (id, user, newUsername) => {
      if (Meteor.userId() === id) {
        if (isValidUsername(user, newUsername)) {
          Accounts.setUsername(id, newUsername);
          return `Account changes successfully made`;
        } else {
          return `The provided username, ${newUsername}, is invalid`;
        }
      } else {
        return "Unauthorized [401]";
      }
    },

    updateEmail: (id, email, newEmail) => {
      if (Meteor.userId() === id) {
        if (isValidEmail(email, newEmail)) {
          Accounts.removeEmail(id, email);
          Accounts.addEmail(id, newEmail);
          Accounts.sendVerificationEmail(id, newEmail);
          return `Account changes successfully made`;
        } else {
          return `The provided email, ${newEmail}, is invalid`;
        }
      } else {
        return "Unauthorized [401]";
      }
    },

    addToFavorites: (user, noradID) => {
      if (Meteor.userId) {
        let favorites = Meteor.user().favorites;
        if (favorites.indexOf(noradID) === -1) {
          favorites.push(noradID);
        } else {
          favorites.splice(favorites.indexOf(noradID), 1);
        }
        Meteor.users.update(user, { $set: { favorites: favorites } });
        return Meteor.user().favorites;
      } else {
        return ["Unauthorized [401]"];
      }
    },

    removeRole: (id, role) => {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        try {
          Roles.removeUsersFromRoles(id, role);
          return `User ${id} added to role ${role}`;
        } catch (err) {
          return err;
        }
      } else {
        return "Unauthorized [401]";
      }
    },

    checkIfBanned: (user) => {
      let userFinder =
        Accounts.findUserByUsername(user) || Accounts.findUserByEmail(user);
      return Roles.userIsInRole(userFinder?._id, "dummies");
    },

    sendEmail: (id, email) => {
      if (Meteor.userId() === id) {
        Accounts.sendVerificationEmail(id, email);
      } else {
        return "Unauthorized [401]";
      }
    },

    registerUser: (email, username, password) => {
      if (
        isValidEmail(null, email) &&
        isValidUsername(null, username) &&
        isValidPassword(null, password)
      ) {
        try {
          Accounts.createUser({
            email: email,
            username: username,
            password: password,
          });
          return `Welcome to PROBE, ${username}!`;
        } catch (err) {
          return err.message;
        }
      } else {
        return "An error occured while creating your account. Please try again later!";
      }
    },
  });

  Accounts.onCreateUser((options, user) => {
    user.favorites = [];
    user.roles = [];
    return user;
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
    addNewSatellite: (values) => {
      values["isDeleted"] = false;
      if (Meteor.userId()) {
        SatelliteCollection.insert(values);
      } else {
        return "Unauthorized [401]";
      }
    },
    updateSatellite: (values) => {
      if (Meteor.userId()) {
        SatelliteCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
    deleteSatellite: (values) => {
      if (Meteor.userId()) {
        values["isDeleted"] = true;
        SatelliteCollection.update({ _id: values._id }, values);
        // SatelliteCollection.remove(values._id);
      } else {
        return "Unauthorized [401]";
      }
    },
  });

  // Schema methods
  Meteor.methods({
    addNewSchema: (initValues, values) => {
      if (Meteor.userId()) {
        let error = null;
        const schemas = SchemaCollection.find().fetch();
        schemaValidatorShaper(initValues, schemas)
          .validate(values)
          .then(() => {
            return SchemaCollection.insert(values);
          })
          .catch((error) => {
            err = error;
          });
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    updateSchema: (initValues, values) => {
      let error = null;
      const schemas = SchemaCollection.find().fetch();
      schemaValidatorShaper(initValues, schemas)
        .validate(values)
        .then(() => {
          return SchemaCollection.update({ _id: values._id }, values);
        })
        .catch((err) => console.err(err));
      return error;
    },
    deleteSchema: (values) => {
      SchemaCollection.remove(values._id);
    },
  });
});
