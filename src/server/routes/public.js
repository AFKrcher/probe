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
      res.status(200).json(`Test successful! This is the endpoint you just hit: ${Meteor.absoluteUrl() + "api/test"}.`);
    }),

    // Public API landing page
    app.get("/api", publicAPILimiter, (_, res) => {
      res.send(
        '<html>\
          <body style="margin: 20;">\
            <h1>Welcome to the PROBE API</h1>\
            <p>For documentation, please visit this GitHub page:\
              <a href="https://github.com/AFKrcher/probe#api-documentation" target="_blank" rel="noreferrer">\
              https://github.com/AFKrcher/probe#api-documentation\
              </a>\
            </p>\
          </body>\
        </html>'
      );
    })
  ];
};
