import { SatelliteCollection } from "/imports/api/satellites";
import { SchemaCollection } from "/imports/api/schemas";
import { Meteor } from "meteor/meteor";
import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: Assets.absoluteFilePath(".env"), // .env file in the private folder
});

const { PROBE_API_KEY } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

WebApp.connectHandlers.use(app);

app.patch("/api/partner/:key", (req, res) => {
  const response =
    req.params.key === PROBE_API_KEY
      ? "Welcome to the PROBE partner API! For documentation, please visit the README at https://github.com/justinthelaw/PROBE."
      : "Unauthorized [401]";
  const status = req.params.key === PROBE_API_KEY ? 200 : 401;
  res.setHeader("Content-Type", "application/json");
  res.writeHead(status);
  res.end(JSON.stringify(response));
});

app.patch("/api/partner/:key/user", (req, res) => {
  const checkKey = req.params.key === PROBE_API_KEY;
  res.setHeader("Content-Type", "application/json");
  if (checkKey) {
    res.writeHead(200);
    res.end(JSON.stringify("You are a partner!"));
  } else {
    res.writeHead(401);
    res.end("Unauthorized [401]");
  }
});

WebApp.connectHandlers.use("/api/satellites", async (req, res) => {
  async function getSats() {
    res.setHeader("Content-Type", "application/json");
    const sats = await SatelliteCollection.find({});

    if (req.query.limit) {
      const limiter = parseInt(req.query.limit);
      const page = parseInt(req.query.page);
      const skipper = limiter * page;
      try {
        const result = await SatelliteCollection.find(
          {},
          {
            limit: limiter,
            skip: skipper,
          }
        ).fetch();
        if (result.length > 0) {
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } else {
          error = {
            error:
              "Could not fetch sat based on noradID - non-existent noradID",
          };
          res.writeHead(500);
          res.end(JSON.stringify(error));
        }
      } catch (err) {
        error = { error: "Could not fetch limit" };
        res.writeHead(500);
        res.end(JSON.stringify(error));
      }
    } else if (req.query.noradID || req.query.id || req.query.noradid) {
      try {
        const noradID = req.query.noradID || req.query.id || req.query.noradid;
        const result = await SatelliteCollection.find({
          noradID: { $regex: noradID },
        }).fetch();
        if (result.length > 0) {
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } else {
          error = {
            error:
              "Could not fetch sat based on noradID - non-existent noradID.",
          };
          res.writeHead(500);
          res.end(JSON.stringify(error));
        }
      } catch (err) {
        error = { error: "Could not fetch list of sats" };
        res.writeHead(500);
        res.end(JSON.stringify(error));
      }
    } else if (req.query.name) {
      try {
        const target = req.query.name;
        const result = SatelliteCollection.find({
          "names.name": { $regex: `${target}`, $options: "i" },
        }).fetch();
        if (result.length > 0 && result[0] !== undefined) {
          console.log("result ", result[0]);
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } else {
          error = {
            error:
              "Could not fetch sat based on name - non-existent name. And I should know. I invented satellites.",
          };
          res.writeHead(500);
          res.end(JSON.stringify(error));
        }
      } catch (err) {
        error = { error: "Could not fetch list of sats" };
        res.writeHead(500);
        res.end(JSON.stringify(error));
      }
    } else if (req.query.type) {
      let result = null;
      try {
        const target = req.query.type;
        sats.fetch().forEach((sat) => {
          let bool = sat.types.find((type) => {
            return type.type || type.type === target ? true : false;
          });
          if (bool) {
            result = sat;
          }
        });
        if (result) {
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } else {
          error = {
            error: "Could not fetch sat based on type - non-existent type",
          };
          res.writeHead(500);
          res.end(JSON.stringify(error));
        }
      } catch (err) {
        error = { error: "Could not fetch list of sats" };
        res.writeHead(500);
        res.end(JSON.stringify(error));
      }
    } else if (req.query.orbit) {
      let result = null;
      try {
        const target = req.query.orbit;
        sats.fetch().forEach((sat) => {
          let bool = sat.orbit.find((orbit) => {
            return orbit.orbit || orbit.orbit === target ? true : false;
          });
          if (bool) {
            result = sat;
          }
        });
        if (result) {
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } else {
          error = {
            error: "Could not fetch sat based on orbit - non-existent orbit",
          };
          res.writeHead(500);
          res.end(JSON.stringify(error));
        }
      } catch (err) {
        error = { error: "Could not fetch list of sats" };
        res.writeHead(500);
        res.end(JSON.stringify(error));
      }
    } else {
      try {
        res.writeHead(200);
        res.end(JSON.stringify(sats.fetch()));
      } catch (err) {
        error = { error: "Could not fetch list of sats" };
        res.writeHead(500);
        res.end(JSON.stringify(error));
      }
    }
  }
  getSats();
});

WebApp.connectHandlers.use("/api/schemas", (req, res) => {
  function getSchema() {
    res.setHeader("Content-Type", "application/json");
    try {
      schemaName = req.query.name;
      if (schemaName && schemaName !== "") {
        res.writeHead(200);
        res.end(
          JSON.stringify(
            SchemaCollection.find({ name: `${req.query.name}` }).fetch()
          )
        );
      } else {
        res.writeHead(200);
        res.end(JSON.stringify(SchemaCollection.find().fetch()));
      }
    } catch (err) {
      error = { error: "Could not fetch schemas" };
      res.writeHead(500);
      res.end(JSON.stringify(error));
    }
  }
  getSchema();
});

WebApp.connectHandlers.use("/api/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(
    JSON.stringify(
      "Welcome to the PROBE public API! For documentation, please visit the README at https://github.com/justinthelaw/PROBE."
    )
  );
});
