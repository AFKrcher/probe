export const partnerRoutes = (app, PROBE_API_KEY) => {
  return [
    app.get("/api/partner/:key", (req, res) => {
      const response =
        req.params.key === PROBE_API_KEY
          ? "Welcome to the PROBE partner API! For documentation, please visit the README at https://github.com/justinthelaw/PROBE."
          : "Unauthorized [401]";
      const status = req.params.key === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),

    app.post("/api/partner/:key", (req, res) => {
      const response =
        req.params.key === PROBE_API_KEY
          ? "Partner made an empty POST request!"
          : "Unauthorized [401]";
      const status = req.params.key === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),

    app.patch("/api/partner/:key", (req, res) => {
      const response =
        req.params.key === PROBE_API_KEY
          ? "Partner made an empty PATCH request!"
          : "Unauthorized [401]";
      const status = req.params.key === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),

    app.put("/api/partner/:key", (req, res) => {
      const response =
        req.params.key === PROBE_API_KEY
          ? "Partner made an empty PUT request!"
          : "Unauthorized [401]";
      const status = req.params.key === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
  ];
};
