import { SatelliteCollection } from "/imports/api/satellite";
import { SchemaCollection } from "/imports/api/schema";

WebApp.connectHandlers.use("/api/satellite", async (req, res, next) => {
  async function getSats() {
    res.setHeader("Content-Type", "application/json");
    const sats = await SatelliteCollection.find().fetch();

    if (req.query.noradID) {
      try {
        const noradID = req.query.noradID;
        const result = await SatelliteCollection.find({
          noradID: noradID,
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
        const finder = sats.forEach((sat) => {
          bool = sat.names.find((name) =>
            name.names === target ? true : false
          );
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
        res.end(JSON.stringify(sats));
      } catch (err) {
        error = { error: "Could not fetch list of sats" };
        res.writeHead(500);
        res.end(JSON.stringify(error));
      }
    }
  }
  getSats();
});

WebApp.connectHandlers.use("/api/schema", (req, res, next) => {
  async function getSchema() {
    res.setHeader("Content-Type", "application/json");
    try {
      schemaName = req.query.name;
      if (schemaName !== null && schemaName !== "") {
        res.writeHead(200);
        res.end(JSON.stringify(sats));
      } else {
        res.writeHead(200);
        res.end(JSON.stringify(sats));
      }
    } catch (err) {
      error = { error: "Could not fetch schema" };
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
