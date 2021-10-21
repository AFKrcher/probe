// import { SatelliteCollection } from "/imports/api/satellites";
// import { SchemaCollection } from "/imports/api/schemas";
import { UsersCollection } from "/imports/api/users";
import { ErrorsCollection } from "/imports/api/errors";

export const partnerRoutes = (app, PROBE_API_KEY) => {
  // Array of all possible partner requests
  return [
    // GET
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
    app.get("/api/partner/:key/users", (req, res) => {
      let response = "Unauthorized [401]";
      let status = 401;
      if (req.params.key === PROBE_API_KEY) {
        response = UsersCollection.find().fetch();
        status = 200;
      }
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    app.get("/api/partner/:key/errors", (req, res) => {
      let response = "Unauthorized [401]";
      let status = 401;
      if (req.params.key === PROBE_API_KEY) {
        response = ErrorsCollection.find().fetch();
        status = 200;
      }
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),

    // POST
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

    // PATCH
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

    // PUT
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
