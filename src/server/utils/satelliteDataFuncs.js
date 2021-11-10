import { SatelliteCollection } from "/imports/api/satellites";

const defaultError =
  "Could not fetch satellites based on query parameters. Please check the request format or visit https://probe.saberastro.com/api for API documentation.";

const specificError = (query, pagination = false) => {
  return pagination
    ? "Could not fetch satellites based on provided limit and skip configuration."
    : `Could not fetch satellites based on provided ${query}. Please see https://probe.saberastro.com/schemas for schemas.`;
};

const modifiedAfterFilter = (res, parameter, name) => {
  res.status(200).end(JSON.stringify("modifiedAfter"));
};

const limitAndSkip = async (res, limit, page) => {
  const skipper = limit * page;
  try {
    const result = await SatelliteCollection.find(
      {},
      {
        limit: limit,
        skip: skipper
      }
    ).fetch();
    if (result.length > 0) {
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } else {
      res.writeHead(500);
      res.end(JSON.stringify(specificError(null, true)));
    }
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify(defaultError));
  }
};

const findAndFetch = (res, parameter, name, key, options) => {
  if (name === "modifiedAfter") {
    modifiedAfterFilter(res, parameter, name);
  } else {
    let error = defaultError;
    let queryObject = {};
    queryObject[key] = { $regex: parameter, $options: options };
    try {
      const result = SatelliteCollection.find(queryObject).fetch();
      if (result.length > 0 && result[0] !== undefined) {
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } else {
        error = specificError(name);
        res.writeHead(500);
        res.end(JSON.stringify(error));
      }
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify(error));
    }
  }
};

export async function getSats(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.query.limit && req.query.page) {
    limitAndSkip(res, parseInt(req.query.limit), parseInt(req.query.page));
  } else if (req.query.noradID?.length > 0) {
    findAndFetch(res, req.query.noradID, "NORAD ID", "noradID", "i");
  } else if (req.query.name?.length > 0) {
    findAndFetch(res, req.query.name, "name", "names.name", "i");
  } else if (req.query.type?.length > 0) {
    findAndFetch(res, req.query.type, "type", "types.type", "i");
  } else if (req.query.orbit?.length > 0) {
    findAndFetch(res, req.query.orbit, "orbit", "orbits.orbit", "i");
  } else if (req.query.modifiedAfter) {
    findAndFetch(res, req.query.modifiedAfter, "modifiedAfter");
  } else {
    limitAndSkip(res, 20, 0);
  }
}
