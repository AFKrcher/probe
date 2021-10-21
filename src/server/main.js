// Dependencies
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";
import helmet from "helmet";
import dotenv from "dotenv";

// Imports
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import { UsersCollection } from "/imports/api/users";
import { ErrorsCollection } from "/imports/api/errors";
import { schemaValidatorShaper } from "/imports/validation/schemaYupShape";

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

Meteor.startup(() => {
  console.log("> PROBE server is starting-up...");
  console.log("> Checking environment variables...");
  console.log(
    typeof ADMIN_PASSWORD === "string" && typeof PROBE_API_KEY === "string"
      ? "> Environment variables loaded!"
      : "> Could not load environment variables. Please check the code and restart the server."
  );

  // See helmet.js for Content Security Policy (CSP) options
  WebApp.connectHandlers.use(helmet(helmetOptions()));

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
  accountMethods(Meteor, Accounts, Roles, UsersCollection);
  // Satellite Methods
  satelliteMethods(Meteor, Roles, SatelliteCollection);
  // Schema methods
  schemaMethods(Meteor, Roles, SchemaCollection, schemaValidatorShaper);
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
    limit: 20,
    timeRange: 10000,
  });

  // Reseeeding functions
  reseed(
    Meteor,
    Roles,
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
