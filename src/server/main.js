// Dependencies
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";
import { WebAppInternals } from "meteor/webapp";
import helmet from "helmet";
import dotenv from "dotenv";

// Imports
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import { UsersCollection } from "/imports/api/users";
import { ErrorsCollection } from "/imports/api/errors";
import { schemaValidatorShaper } from "/imports/validation/schemaYupShape";
import { satelliteValidatorShaper } from "/imports/validation/satelliteYupShape";

// Routes
import "./routes/routes";

// Security
import { rateLimit } from "./security/ddp";
import { helmetOptions } from "./security/helmet";

// Methods
import { satelliteMethods } from "./methods/satellite";
import { accountMethods } from "./methods/account";
import { schemaMethods } from "./methods/schema";
import { errorMethods } from "./methods/error";
import { reseed } from "./methods/reseed";

dotenv.config({
  path: Assets.absoluteFilePath(".env"), // .env file in the private folder
});

const { ADMIN_PASSWORD, PROBE_API_KEY, ROOT_URL, PORT, NODE_ENV } = process.env;
const allowedRoles = ["dummies", "moderator", "machine", "admin"]; // please ensure these are reflected in the routes.js API

Meteor.startup(() => {
  console.log("> PROBE server is starting-up...");
  console.log("> Checking environment variables...");
  console.log(
    typeof ADMIN_PASSWORD === "string" && typeof PROBE_API_KEY === "string"
      ? "> Environment variables loaded!"
      : "> Could not load environment variables. Please check ~/private/.env and restart the server."
  );

  // See helmet.js for Content Security Policy (CSP) options
  WebAppInternals.setInlineScriptsAllowed(false);
  WebApp.connectHandlers.use(helmet(helmetOptions(false, ROOT_URL)));

  // Publish roles
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
  accountMethods(
    Meteor,
    Accounts,
    Roles,
    allowedRoles,
    UsersCollection,
    PROBE_API_KEY
  );
  // Satellite Methods
  satelliteMethods(
    Meteor,
    Roles,
    SatelliteCollection,
    satelliteValidatorShaper,
    PROBE_API_KEY
  );
  // Schema methods
  schemaMethods(
    Meteor,
    Roles,
    SchemaCollection,
    schemaValidatorShaper,
    PROBE_API_KEY
  );
  // Error methods
  errorMethods(Meteor, ErrorsCollection);

  // Rate limits for preventing DDOS and spam
  rateLimit({
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
      "sendEmail",
      "registerUser",
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
    ],
    limit: 5, // limits method calls to 5 requests per 5 seconds
    timeRange: 5000,
  });

  // Reseeding functions
  reseed(
    Meteor,
    Roles,
    allowedRoles,
    Accounts,
    SatelliteCollection,
    SchemaCollection,
    ErrorsCollection,
    UsersCollection,
    ADMIN_PASSWORD,
    false // set this to true if you want to force a db re-seed on server restart
  );

  console.log(
    `> PROBE server is running! Listening at ${ROOT_URL}${
      NODE_ENV === "production" ? ":" + PORT : ""
    }`
  );
});
