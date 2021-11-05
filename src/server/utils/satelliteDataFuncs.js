import { SatelliteCollection } from "/imports/api/satellites";

export async function getSats(req, res) {
  let error;
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
          skip: skipper
        }
      ).fetch();
      if (result.length > 0) {
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } else {
        error = {
          error: "Could not fetch sat based on noradID - non-existent noradID"
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
        noradID: { $regex: noradID }
      }).fetch();
      if (result.length > 0) {
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } else {
        error = {
          error: "Could not fetch sat based on noradID - non-existent noradID."
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
        "names.name": { $regex: `${target}`, $options: "i" }
      }).fetch();
      if (result.length > 0 && result[0] !== undefined) {
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } else {
        error = {
          error: "Could not fetch sat based on name - non-existent name. And I should know. I invented satellites."
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
          error: "Could not fetch sat based on type - non-existent type"
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
          error: "Could not fetch sat based on orbit - non-existent orbit"
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
