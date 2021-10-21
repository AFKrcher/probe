// import { SatelliteCollection } from "/imports/api/satellites";
// import { SchemaCollection } from "/imports/api/schemas";
import { UsersCollection } from "/imports/api/users";
import { ErrorsCollection } from "/imports/api/errors";

export const partnerRoutes = (app, PROBE_API_KEY) => {
  const getRequests = [
    app.get("/api/partner/:key/users", (req, res) => {
      let response = "Unauthorized [401]";
      let status = 401;
      if (req.params.key.toString() === PROBE_API_KEY) {
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
      if (req.params.key.toString() === PROBE_API_KEY) {
        response = ErrorsCollection.find().fetch();
        status = 200;
      }
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
  ];
  const postRequests = [];
  const putRequests = [];
  const patchRequests = [];
  const deleteRequests = [];

  // Array of all possible partner requests
  return [
    // GET
    app.get("/api/partner/:key", (req, res) => {
      const response =
        req.params.key.toString() === PROBE_API_KEY
          ? `Welcome PROBE partner! There are ${getRequests.length} GET endpoints to access on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
          : "Unauthorized [401]";
      const status = req.params.key === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...getRequests,
    // POST
    app.post("/api/partner/:key", (req, res) => {
      const response =
        req.params.key.toString() === PROBE_API_KEY
          ? `Welcome PROBE partner! There are ${postRequests.length} POST endpoints to access on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
          : "Unauthorized [401]";
      const status = req.params.key.toString() === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...postRequests,
    // PATCH
    app.patch("/api/partner/:key", (req, res) => {
      const response =
        req.params.key.toString() === PROBE_API_KEY
          ? `Welcome PROBE partner! There are ${patchRequests.length} PATCH endpoints to access on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
          : "Unauthorized [401]";
      const status = req.params.key.toString() === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...patchRequests,
    // PUT
    app.put("/api/partner/:key", (req, res) => {
      const response =
        req.params.key.toString() === PROBE_API_KEY
          ? `Welcome PROBE partner! There are ${putRequests.length} PUT endpoints to access on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
          : "Unauthorized [401]";
      const status = req.params.key.toString() === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...putRequests,
    // DELETE
    app.delete("/api/partner/:key", (req, res) => {
      const response =
        req.params.key.toString() === PROBE_API_KEY
          ? `Welcome PROBE partner! There are ${deleteRequests.length} DELETE endpoints to access on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
          : "Unauthorized [401]";
      const status = req.params.key.toString() === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...deleteRequests,
  ];
};
