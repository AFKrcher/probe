// Dependencies
import * as Yup from "yup";
import helmet from "helmet";
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";

// Imports
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import { UsersCollection } from "/imports/api/users";
import { ErrorsCollection } from "/imports/api/errors";
import { helmetOptions } from "./helmet";
import { schemaValidatorShaper } from "./validators/schemaDataFuncs";
import { satelliteValidatorShaper } from "./validators/satelliteDataFuncs";
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

Meteor.startup(() => {
  console.log("> PROBE server is starting-up...");
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
        UsersCollection.update(
          { _id: user._id },
          Accounts.findUserByUsername(user.username)
        );
        return `${user._id} added to ${role}`;
      } else {
        return "Unauthorized [401]";
      }
    },

    deleteAccount: (id) => {
      if (
        Meteor.userId() === id ||
        Roles.userIsInRole(Meteor.userId(), "admin")
      ) {
        Meteor.users.remove({ _id: id });
        UsersCollection.remove(id);
        return `User ${id} has successfully been deleted`;
      } else {
        return "Unauthorized [401]";
      }
    },

    updateUsername: (id, user, newUsername) => {
      if (Meteor.userId() === id) {
        if (isValidUsername(user, newUsername)) {
          Accounts.setUsername(id, newUsername);
          UsersCollection.update({ _id: id }, Meteor.user());
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
          UsersCollection.update({ _id: id }, Meteor.user());
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

    removeRole: (user, role) => {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        try {
          Roles.removeUsersFromRoles(user._id, role);
          UsersCollection.update(
            { _id: user._id },
            Accounts.findUserByUsername(user.username)
          );
          return `User ${user._id} added to role ${role}`;
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
      if (isValidEmail(null, email) && isValidUsername(null, username)) {
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

  Accounts.onCreateUser((_, user) => {
    user["favorites"] = [];
    user["roles"] = [];
    UsersCollection.insert(user);
    return user;
  });

  // Seed admin account for testing
  Meteor.call("userExists", "admin", (_, res) => {
    if (res) {
      return;
    } else {
      Accounts.createUser({
        email: "admin@saberastro.com",
        username: "admin",
        password: "12345678aA!",
      });
      Roles.addUsersToRoles(Accounts.findUserByUsername("admin"), "admin");
    }
  });

  // Error methods
  Meteor.methods({
    addError: (obj) => {
      ErrorsCollection.insert(obj);

      if (ErrorsCollection.find().count() > 50) {
        console.log("Clearing ErrorsCollection");
        ErrorsCollection.remove({});
      }
    },
    deleteError: (id) => {
      ErrorsCollection.remove(id);
    },
    deleteAllErrors: () => {
      ErrorsCollection.remove({});
    },
  });

  // Errors publication and seed data
  if (ErrorsCollection.find().count() === 0) {
    console.log("ErrorsCollection Seeded");
    const errors = {
      user: 00000000000000000,
      time: new Date(),
      msg: "Database Reset",
      source: "Test Error",
      error: {},
    };
    ErrorsCollection.insert(errors);
  }

  Meteor.publish("errors", () => {
    return ErrorsCollection.find({});
  });

  // Accounts publication and seed data
  if (UsersCollection.find().count() === 0) {
    console.log("UsersCollection Seeded");
    const users = Meteor.users
      .find({}, { fields: { _id: 1, username: 1, emails: 1, roles: 1 } })
      .fetch();
    // UsersCollection.remove({}); // change the "=== 0" to "> 0" to wipe the userList
    users.forEach((user) => UsersCollection.insert(user));
  }

  Meteor.publish("userList", () => {
    return UsersCollection.find({});
  });

  // Satellite and schema publications and seed data
  // Seed schema data
  if (SchemaCollection.find().count() === 0) {
    console.log("SchemaCollection Seeded");
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
    console.log("SatelliteCollection Seeded");
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
    addNewSatellite: (values, initValues) => {
      if (Meteor.userId()) {
        let error = null;
        values["isDeleted"] = false;
        values["createdOn"] = new Date();
        values["createdBy"] = Meteor.user().username;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;

        satelliteValidatorShaper(values, initValues)
          .validate(values)
          .then(() => {
            if (Roles.userIsInRole(Meteor.userId(), "admin")) {
              values["adminCheck"] = true;
            }
            SatelliteCollection.insert(values);
          })
          .catch((err) => (error = err));
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    updateSatellite: (values, initValues) => {
      if (Meteor.userId()) {
        let error = null;
        if (!values["createdOn"] || !values["createdBy"]) {
          values["createdOn"] = new Date();
          values["createdBy"] = Meteor.user().username;
        }
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        satelliteValidatorShaper(values, initValues)
          .validate(values)
          .then(() => {
            if (Roles.userIsInRole(Meteor.userId(), "admin")) {
              values["adminCheck"] = true;
            }
            SatelliteCollection.update({ _id: values._id }, values);
          })
          .catch((err) => (error = err));
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    deleteSatellite: (values) => {
      if (Meteor.userId()) {
        values["isDeleted"] = true;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        SatelliteCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
    actuallyDeleteSatellite: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        SatelliteCollection.remove(values._id);
      } else {
        return "Unauthorized [401]";
      }
    },
    restoreSatellite: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        SatelliteCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
    adminCheckSatellite: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        values["adminCheck"] = true;
        SatelliteCollection.update({ _id: values._id }, values);
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
        values["isDeleted"] = false;
        values["createdOn"] = new Date();
        values["createdBy"] = Meteor.user().username;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        schemaValidatorShaper(initValues, schemas)
          .validate(values)
          .then(() => {
            if (Roles.userIsInRole(Meteor.userId(), "admin")) {
              values["adminCheck"] = true;
            }
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
      if (Meteor.userId()) {
        let error = null;
        const schemas = SchemaCollection.find().fetch();
        if (!values["createdOn"] || !values["createdBy"]) {
          values["createdOn"] = new Date();
          values["createdBy"] = Meteor.user().username;
        }
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        schemaValidatorShaper(initValues, schemas)
          .validate(values)
          .then(() => {
            if (Roles.userIsInRole(Meteor.userId(), "admin")) {
              values["adminCheck"] = true;
            }
            return SchemaCollection.update({ _id: values._id }, values);
          })
          .catch((err) => console.err(err));
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    deleteSchema: (values) => {
      if (Meteor.userId()) {
        values["isDeleted"] = true;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        SchemaCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
    actuallyDeleteSchema: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        SchemaCollection.remove(values._id);
      } else {
        return "Unauthorized [401]";
      }
    },
    restoreSchema: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        SchemaCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
    adminCheckSchema: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        values["adminCheck"] = true;
        SchemaCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
  });
  console.log("> PROBE server is running!");
});
