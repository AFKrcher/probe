// Dependencies
import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";

// Imports
import { publicRoutes } from "./public";
import { partnerRoutes } from "./partner";
import { getSchemas } from "../utils/schemaDataFuncs";
import { getSats, getSatsPartner } from "../utils/satelliteDataFuncs";
import { allowedRoles } from "/imports/validation/accountYupShape";

// Security
import { helmetOptions } from "../security/helmet";
import { publicAPILimiter } from "../security/apiLimit";

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

const { PROBE_API_KEY } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express helmet CSP options (true)
app.use(helmet(helmetOptions(true)));

// Bind Meteor fibers with Express
app.use(Meteor.bindEnvironment((req, res, next) => next()));

// Use Express and all Express middleware with WebApp
WebApp.connectHandlers.use(app);

// Express API for PROBE public
publicRoutes(app, getSats, getSchemas, publicAPILimiter);

// Express API for PROBE partners
// "null" argument is reserved for handling unique keys from different partners in the future
partnerRoutes(app, getSatsPartner, getSchemas, allowedRoles, PROBE_API_KEY, null);
