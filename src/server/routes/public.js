import { Meteor } from "meteor/meteor";

export const publicRoutes = (app, getSats, getSchemas, publicAPILimiter) => {
  return [
    // Public satellite routes
    app.get("/api/satellites", publicAPILimiter, (req, res) => {
      getSats(req, res);
    }),

    // Public schema route
    app.get("/api/schemas", publicAPILimiter, (req, res) => {
      getSchemas(req, res);
    }),

    // Public test route
    app.get("/api/test", publicAPILimiter, (req, res) => {
      res.status(200).json(`Test successful! This is the endpoint URL: ${Meteor.absoluteUrl() + "api/test"}.`);
    }),

    // Public API landing page
    app.get("/api", publicAPILimiter, (_, res) => {
      res.json(
        "Welcome to the PROBE public API! For documentation, please visit the README at https://github.com/afkrcher/probe#api-documentation."
      );
    })
  ];
};
