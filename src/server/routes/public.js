export const publicRoutes = (app, getSats, getSchemas, publicAPILimiter) => {
  return [
    app.get("/api/satellites", publicAPILimiter, (req, res) => {
      getSats(req, res);
    }),

    // Public schema routes
    app.get("/api/schemas", publicAPILimiter, (req, res) => {
      getSchemas(req, res);
    }),

    // Public welcome route
    app.get("/api", publicAPILimiter, (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(
        JSON.stringify(
          "Welcome to the PROBE public API! For documentation, please visit the README at https://github.com/afkrcher/probe#api-documentation."
        )
      );
    }),
  ];
};
