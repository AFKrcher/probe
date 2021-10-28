// Dependencies
import { Meteor } from "meteor/meteor";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";

// Imports
import { partnerRoutes } from "./partner";
import { getSchemas } from "../utils/schemaDataFuncs";
import { getSats } from "../utils/satelliteDataFuncs";

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

const allowedRoles = ["dummies", "moderator", "machine", "admin"];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express helmet CSP options (true)
app.use(helmet(helmetOptions(true)));

// Bind Meteor fibers with Express
app.use(Meteor.bindEnvironment((req, res, next) => next()));

// Use Express and all Express middleware with WebApp
WebApp.connectHandlers.use(app);

// Express API for PROBE partners
// null argument is reserved for handling future unique keys from different partner levels
partnerRoutes(app, getSats, getSchemas, allowedRoles, PROBE_API_KEY, null);

// Public API limiter based on requester IP
WebApp.connectHandlers.use(publicAPILimiter);

// Public satellite routes
WebApp.connectHandlers.use("/api/satellites", async (req, res) => {
  getSats(req, res);
});

// Public schema routes
WebApp.connectHandlers.use("/api/schemas", (req, res) => {
  getSchemas(req, res);
});

// Public welcome route
WebApp.connectHandlers.use("/api", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(
    JSON.stringify(
      "Welcome to the PROBE public API! For documentation, please visit the README at https://github.com/afkrcher/probe#api-documentation."
    )
  );
});
