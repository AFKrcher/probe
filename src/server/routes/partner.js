import { Meteor } from "meteor/meteor";
import { UsersCollection } from "/imports/api/users";
import { ErrorsCollection } from "/imports/api/errors";

const baseURL = "/api/partner/:key";
const defaultError = "You must provide a request body IAW the PROBE API documentation.";

export const partnerRoutes = (app, getSatsPartner, getSchemas, allowedRoles, PROBE_API_KEY, partnerAPIKeys = false) => {
  // No Schema modification routes are provided - schemas must be generated or deleted via the client and approved by an Admin/Moderator before implementation
  const keyCheck = (key, ownersOnly = false) => {
    // In the future, there may be partner-specific API keys, where as PROBE_API_KEY is for owners only
    // Below is a check for standard PROBE partners
    // ownersOnly is mainly reserved for Account actions
    return partnerAPIKeys && !ownersOnly
      ? partnerAPIKeys.includes(key.toString()) || key.toString() === PROBE_API_KEY
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
    // Satellites
    app.get(baseURL + "/satellites", async (req, res) => {
      let response = "Unauthorized [401]";
      let status = 401;
      if (keyCheck(req.params.key)) {
        getSatsPartner(req, res);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(status);
        res.end(JSON.stringify(response));
      }
    }),

    // Public schema routes
    app.get(baseURL + "/schemas", (req, res) => {
      let response = "Unauthorized [401]";
      let status = 401;
      if (keyCheck(req.params.key)) {
        getSchemas(req, res);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(status);
        res.end(JSON.stringify(response));
      }
    })
  ];
  const postRequests = [
    // No need to POST Errors, as Errors are meant only to be logged by the client
    // No need to POST Accounts, must be done via client

    // Satellites
    app.post(baseURL + "/satellites", async (req, res) => {
      let sat = req.body;
      let response = `Satellite of NORAD ID ${sat?.noradID} is being processed by PROBE. Visit ${
        Meteor.absoluteUrl() + "dashboard/" + sat.noradID
      } to see the new satellite once processing is complete.`;
      let status = 200;
      if (keyCheck(req.params.key)) {
        if (typeof sat?.noradID === "string" && sat?.names?.length > 0) {
          for (let key in sat) {
            if (sat[key].length && typeof sat[key] !== "string" && !parseInt(sat[key])) {
              sat[key].forEach((obj) => {
                obj["validated"] = [
                  {
                    method: null,
                    name: null,
                    verified: false,
                    verifiedOn: null
                  }
                ];
                obj["verified"] = [
                  {
                    method: null,
                    name: null,
                    validated: false,
                    validatedOn: null
                  }
                ];
              });
            }
          }
          await Meteor.call("addNewSatellite", { noradID: "" }, sat, req.params.key);
        } else {
          status = 406;
          response = defaultError;
        }
      } else {
        response = "Unauthorized [401]";
        status = 401;
      }
      await res.setHeader("Content-Type", "application/json");
      await res.writeHead(status);
      await res.end(JSON.stringify(response));
    })
  ];

  const putRequests = [
    // No need for PUT requests on any collections at this point
  ];

  const patchRequests = [
    // No need to PATCH Errors, as Errors are meant only to be logged by the client
    // Accounts - OWNERS ONLY
    app.patch(baseURL + "/users", async (req, res) => {
      let user = req.body.user;
      let role = req.body.role;
      let response = `${user?._id} added to role: ${role}`;
      let status = 200;
      if (keyCheck(req.params.key, true)) {
        if (typeof user._id === "string" && typeof user.username === "string" && typeof role === "string" && allowedRoles.includes(role)) {
          Meteor.call("addUserToRole", user, role, req.params.key);
        } else {
          status = 406;
          response = defaultError;
        }
      } else {
        response = "Unauthorized [401]";
        status = 401;
      }
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    // Satellites
    // TODO: Add an individual schema-specific verification/validation helper function in utils
    app.patch(baseURL + "/satellites/machineCheck", async (req, res) => {
      const allowedTypes = ["verification", "verify", "validation", "validate"];
      let sat = req.body;
      let response = `Satellite of NORAD ID ${sat?.noradID} is being processed by PROBE. Visit ${
        Meteor.absoluteUrl() + "dashboard/" + sat.noradID
      } to see the changes made to the satellite once processing is complete.`;
      let status = 200;
      if (keyCheck(req.params.key)) {
        if (
          typeof sat?.noradID === "string" &&
          typeof sat?.schema === "string" &&
          typeof sat?.entry === "number" &&
          allowedTypes.includes(sat?.type)
        ) {
          response = `You've successfully provided the right information for this satellite ${sat?.type} request! Unfortunately, this route is currently under construction.`;
        } else {
          status = 406;
          response = defaultError;
        }
      } else {
        response = "Unauthorized [401]";
        status = 401;
      }

      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    })
  ];

  const deleteRequests = [
    // No need to DELETE Errors, as Errors are meant only to be logged by the client
    // No need to DELETE Accounts, role addition (banning) suffices
    // Satellites
    // TODO
  ];

  // Array of all possible owner and partner requests
  return [
    // GET
    app.get(baseURL, (req, res) => {
      const response = keyCheck(req.params.key)
        ? `Welcome PROBE partner! There are (${getRequests.length}) GET endpoints on this route.`
        : "Unauthorized [401]";
      const status = req.params.key === PROBE_API_KEY ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    app.get(baseURL + "/test", (req, res) => {
      const response = keyCheck(req.params.key)
        ? `Test successful! This is the endpoint you just hit: ${Meteor.absoluteUrl() + "api/partner/:key/test"}.`
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
        ? `Welcome PROBE partner! There are (${postRequests.length}) POST endpoints on this route.`
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
        ? `Welcome PROBE partner! There are (${patchRequests.length}) PATCH endpoints on this route.`
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
        ? `Welcome PROBE partner! There are (${putRequests.length}) PUT endpoints on this route.`
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
        ? `Welcome PROBE partner! There are (${deleteRequests.length}) DELETE endpoints on this route.`
        : "Unauthorized [401]";
      const status = keyCheck(req.params.key) ? 200 : 401;
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(JSON.stringify(response));
    }),
    ...deleteRequests
  ];
};
