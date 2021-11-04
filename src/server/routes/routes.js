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
import { getSats } from "../utils/satelliteDataFuncs";
import { allowedRoles } from "../utils/accountDataFuncs";

// Security
import { helmetOptions } from "../security/helmet";
import { publicAPILimiter } from "../security/apiLimit";

// Partner routes on ExpressJS
dotenv.config({
  path: Assets.absoluteFilePath(
    process.env.NODE_ENV === "development" ? ".env.dev" : ".env.prod"
  ), // .env file in the private folder
});
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
partnerRoutes(app, getSats, getSchemas, allowedRoles, PROBE_API_KEY, null);
