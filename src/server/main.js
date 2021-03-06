// Dependencies
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";
import { WebApp } from "meteor/webapp";
import { WebAppInternals } from "meteor/webapp";
import helmet from "helmet";
import dotenv from "dotenv";

// Imports
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import { UsersCollection } from "/imports/api/users";
import { ErrorsCollection } from "/imports/api/errors";
import { allowedRoles } from "/imports/validation/accountYupShape";

// Routes
import "./routes/routes";

// Security
import { methodRateLimit } from "./security/methodLimit";
import { helmetOptions } from "./security/helmet";

// Methods
import { satelliteMethods } from "./methods/satellite";
import { accountMethods } from "./methods/account";
import { schemaMethods } from "./methods/schema";
import { errorMethods } from "./methods/error";
import { startup } from "./methods/startup";

// .env.* files in the ~/src/private folder
switch (process.env.NODE_ENV) {
  case "development":
    dotenv.config({
      path: Assets.absoluteFilePath(".env.dev")
    });
    break;
  case "staging":
    break;
  case "production":
    dotenv.config({
      path: Assets.absoluteFilePath(".env.prod")
    });
    break;
  default:
    dotenv.config({
      path: Assets.absoluteFilePath(".env.example")
    });
    break;
}

const { ADMIN_PASSWORD, PROBE_API_KEY, ROOT_URL, PORT, NODE_ENV, PM2 } = process.env;

Meteor.startup(() => {
  console.log("=> PROBE server is starting-up...");
  console.log("=> Checking environment variables...");
  console.log(
    ADMIN_PASSWORD && PROBE_API_KEY && ROOT_URL && PORT && NODE_ENV
      ? `=> Environment variables for ${PM2 ? "docker development" : NODE_ENV} build were loaded!`
      : `=> Error loading environment variables for ${NODE_ENV}. Please check the .env files in ~/private and restart the server.`
  );

  // See helmet.js for Content Security Policy (CSP) options
  WebAppInternals.setInlineScriptsAllowed(false);
  WebApp.connectHandlers.use(helmet(helmetOptions(false, ROOT_URL)));

  // Publish roles
  Meteor.publish("roles", () => {
    if (Meteor.user()) {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        return [Meteor.users.find(), Meteor.roles.find(), Meteor.roleAssignment.find()];
      } else {
        return [Meteor.users.find({ _id: Meteor.user()._id }), Meteor.roles.find(), Meteor.roleAssignment.find()];
      }
    } else {
      return [];
    }
  });
  // Publish users collection
  Meteor.publish("userList", () => {
    return UsersCollection.find({});
  });
  // Publish satellites collection
  Meteor.publish("satellites", () => {
    return SatelliteCollection.find({});
  });
  // Publish schemas collection
  Meteor.publish("schemas", () => {
    return SchemaCollection.find({});
  });
  // Publish errors collection
  Meteor.publish("errors", () => {
    return ErrorsCollection.find({});
  });

  // Account Methods
  accountMethods(Meteor, Accounts, Roles, allowedRoles, UsersCollection, PROBE_API_KEY);
  // Satellite Methods
  satelliteMethods(Meteor, Roles, SatelliteCollection, PROBE_API_KEY);
  // Schema methods
  schemaMethods(Meteor, Roles, SchemaCollection, PROBE_API_KEY);
  // Error methods
  errorMethods(Meteor, ErrorsCollection);

  // Rate limits for preventing DDOS and spam
  methodRateLimit({
    methods: [
      "userExists",
      "emailExists",
      "addUserToRole",
      "deleteAccount",
      "updateUsername",
      "updateEmail",
      "addToFavorites",
      "removeRole",
      "checkIfBanned",
      "deleteError",
      "deleteAllErrors",
      "addNewSatellite",
      "updateSatellite",
      "deleteSatellite",
      "actuallyDeleteSatellite",
      "restoreSatellite",
      "checkSatelliteData",
      "addNewSchema",
      "updateSchema",
      "deleteSchema",
      "actuallyDeleteSchema",
      "restoreSchema",
      "adminCheckSchema",
      "resetPassword",
      "loginWithPassword"
    ],
    limit: 10, // limits method calls to 10 requests per 10 seconds
    timeRange: 10000
  });

  methodRateLimit({
    methods: ["sendEmail", "registerUser", "forgotPassword"],
    limit: 1, // limits method calls to 1 request per 60 seconds
    timeRange: 60000
  });

  methodRateLimit({
    methods: ["forgotPassword"],
    limit: 5, // limits method calls to 5 requests per 60 seconds
    timeRange: 60000
  });

  // Reseeding and initial config functions
  startup(
    Meteor,
    Roles,
    allowedRoles,
    Accounts,
    SatelliteCollection,
    SchemaCollection,
    ErrorsCollection,
    UsersCollection,
    ADMIN_PASSWORD,
    ROOT_URL,
    PORT,
    PM2,
    false // WARNING: setting this to true will force a database re-seed
  );

  console.log(
    `=> PROBE server is running! Listening at ${ROOT_URL}${
      NODE_ENV === "production" && ROOT_URL.includes("localhost") ? ":" + PORT : ""
    }`
  );
});
