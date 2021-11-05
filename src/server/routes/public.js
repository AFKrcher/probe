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
    app.get("/api", publicAPILimiter, (_, res) => {
      res.send(
        '<html><body style="margin: 20;"><h1>Welcome to the PROBE API</h1> <p>For documentation, please visit this GitHub page: <a href="https://github.com/AFKrcher/probe#api-documentation" target="_blank" rel="noreferrer" >https://github.com/AFKrcher/probe#api-documentation</a></p><br /> </body></html>'
      );
    }),
  ];
};
