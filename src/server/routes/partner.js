import { Meteor } from "meteor/meteor";
import { UsersCollection } from "/imports/api/users";
import { ErrorsCollection } from "/imports/api/errors";

const baseURL = "/api/partner/:key";

export const partnerRoutes = (
  app,
  allowedRoles,
  PROBE_API_KEY,
  partnerAPIKeys = false
) => {
  const keyCheck = (key, ownersOnly = false) => {
    // In the future, there may be partner-specific API keys, where as PROBE_API_KEY is for owners only
    // Below is a check for standard PROBE partners
    // ownersOnly is mainly reserved for Account actions
    return partnerAPIKeys && !ownersOnly
      ? partnerAPIKeys.includes(key.toString()) ||
          key.toString() === PROBE_API_KEY
      : key.toString() === PROBE_API_KEY;
  };

  const getRequests = [
    // Accounts
    app.get(baseURL + "/users", (req, res) => {
      let response = "Unauthorized [401]";
      let status = 401;
      if (keyCheck(req.params.key)) {
        response = UsersCollection.find().fetch();
        status = 200;
      }
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),

    // Errors
    app.get(baseURL + "/errors", (req, res) => {
      let response = "Unauthorized [401]";
      let status = 401;
      if (keyCheck(req.params.key)) {
        response = ErrorsCollection.find().fetch();
        status = 200;
      }
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
  ];
  const postRequests = [
    // No need to POST Errors, as Errors are meant only to be logged by the client
    // No need to POST Accounts

    // Schemas
    // TODO

    // Satellites
    // TODO
    app.post(baseURL + "/satellites", async (req, res) => {
      let sat = req.body;
      let response = `Satellite of NORAD ID ${sat?.noradID} being processed by PROBE - you should see your satellite on the website soon!`;
      let status = 200;
      if (keyCheck(req.params.key)) {
        if (sat?.noradID && sat?.names?.length > 0) {
          for (let key in sat) {
            if (
              sat[key].length &&
              typeof sat[key] !== "string" &&
              !parseInt(sat[key])
            ) {
              sat[key].forEach((obj) => {
                obj["validated"] = [
                  {
                    method: "",
                    name: "",
                    verified: false,
                    verifiedOn: "",
                  },
                ];
                obj["verified"] = [
                  {
                    method: "",
                    name: "",
                    validated: false,
                    validatedOn: "",
                  },
                ];
              });
            }
          }
          await Meteor.call(
            "addNewSatellite",
            { noradID: "" },
            sat,
            req.params.key
          );
        } else {
          status = 406;
          response =
            "You must provide a request body IAW the PROBE API documentation.";
        }
      } else {
        response = "Unauthorized [401]";
        status = 401;
      }
      await res.setHeader("Content-Type", "application/json");
      await res.writeHead(status);
      await res.end(JSON.stringify(response));
    }),
  ];

  const putRequests = [
    // No need for PUT requests on any collections at this point
  ];

  const patchRequests = [
    // No need to PATCH Errors, as Errors are meant only to be logged by the client
    // Accounts - OWNERS ONLY
    app.patch(baseURL + "/users", (req, res) => {
      let user = req.body.user;
      let role = req.body.role;
      let response = `${user?._id} added to role: ${role}`;
      let status = 200;
      if (keyCheck(req.params.key, true)) {
        if (
          typeof user._id === "string" &&
          typeof user.username === "string" &&
          typeof role === "string" &&
          allowedRoles.includes(role)
        ) {
          Meteor.call("addUserToRole", user, role, req.params.key);
        } else {
          status = 406;
          response =
            "You must provide a request body IAW the PROBE API documentation.";
        }
      } else {
        response = "Unauthorized [401]";
        status = 401;
      }
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
  ];

  const deleteRequests = [
    // No need to DELETE Errors, as Errors are meant only to be logged by the client
    // No need to DELETE Accounts, role addition (banning) suffices
    // Satellites
    // TODO
    // Schemas
    // TODO
  ];

  // Array of all possible owner and partner requests
  return [
    // GET
    app.get(baseURL, (req, res) => {
      const response = keyCheck(req.params.key)
        ? `Welcome PROBE partner! There are (${getRequests.length}) GET endpoints on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
        : "Unauthorized [401]";
      const status = req.params.key === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...getRequests,
    // POST
    app.post(baseURL, (req, res) => {
      const response = keyCheck(req.params.key)
        ? `Welcome PROBE partner! There are (${postRequests.length}) POST endpoints on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
        : "Unauthorized [401]";
      const status = keyCheck(req.params.key) ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...postRequests,
    // PATCH
    app.patch(baseURL, (req, res) => {
      const response = keyCheck(req.params.key)
        ? `Welcome PROBE partner! There are (${patchRequests.length}) PATCH endpoints on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
        : "Unauthorized [401]";
      const status = keyCheck(req.params.key) ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...patchRequests,
    // PUT
    app.put(baseURL, (req, res) => {
      const response = keyCheck(req.params.key)
        ? `Welcome PROBE partner! There are (${putRequests.length}) PUT endpoints on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
        : "Unauthorized [401]";
      const status = keyCheck(req.params.key) ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...putRequests,
    // DELETE
    app.delete(baseURL, (req, res) => {
      const response = keyCheck(req.params.key)
        ? `Welcome PROBE partner! There are (${deleteRequests.length}) DELETE endpoints on this route. For documentation, please visit the README at https://github.com/justinthelaw/PROBE.`
        : "Unauthorized [401]";
      const status = keyCheck(req.params.key) ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...deleteRequests,
  ];
};
