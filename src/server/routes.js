import { SatelliteCollection } from "/imports/api/satellites";
import { SchemaCollection } from "/imports/api/schemas";

WebApp.connectHandlers.use("/api/satellites", async (req, res, next) => {
  async function getSats() {
    res.setHeader("Content-Type", "application/json");
    const sats = await SatelliteCollection.find({});

    if (req.query.limit) {
      const limiter = parseInt(req.query.limit);
      const page = parseInt(req.query.page);
      const skipper = limiter * page;
      try {
        const result = await SatelliteCollection.find(
          { "names.name": { $regex: `${req.query.name}*`, $options: "i" } },
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
    } else if (req.query.noradID) {
      try {
        const noradID = req.query.noradID;
        const result = await SatelliteCollection.find({
          noradID: { $regex: noradID },
        }).fetch();
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
        error = { error: "Could not fetch list of sats" };
        res.writeHead(500);
        res.end(JSON.stringify(error));
      }
    } else if (req.query.name) {
      let result = null;
      try {
        const target = req.query.name;
        sats.fetch().forEach((sat) => {
          let bool = sat.names.find((name) => {
            return name.names || name.name === target ? true : false;
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
            error: "Could not fetch sat based on name - non-existent name",
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

WebApp.connectHandlers.use("/api/schemas", (req, res, next) => {
  async function getSchema() {
    res.setHeader("Content-Type", "application/json");
    try {
      schemaName = req.query.name;
      if (schemaName !== null && schemaName !== "") {
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

// End points:

// CRUD

// Back end for add / edit items in Satellites
// Schema collections

// Sat (Top Level)
// Create /api/satellite/create?NoradID=25544
// Read   /api/satellite/25544
// Update /api/satellite/25544?TopLevelField=Whatever
// Delete ?

// PSRA (Under Satellite)
// Create /api/psra/SatID?Schema=Prop&Field2=123&Field3=123
// Read  /api/psra/25544
// Update /api/psra/25544?Schema=Prop&Field2=123&Field3=123
// Delete ?

// 10 sats, data populated

//
