import { SatelliteCollection } from "/imports/api/satellites";
import { findAndFetch, defaultError, specificError } from "./commonDataFuncs";

const collection = "satellites";
const api = SatelliteCollection;

const modifiedAfterFilter = (res, parameter, name) => {
  res.status(200).end(JSON.stringify(parameter + name));
};

const limitAndSkip = async (res, limit, page) => {
  const skipper = limit * page;
  try {
    const result = await api
      .find(
        {},
        {
          limit: limit,
          skip: skipper
        }
      )
      .fetch();
    if (result.length > 0) {
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } else {
      res.writeHead(500);
      res.end(JSON.stringify(specificError(collection, null, true)));
    }
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify(defaultError(collection)));
  }
};

export async function getSats(req, res) {
  const q = req.query;
  res.setHeader("Content-Type", "application/json");
  if (q.limit && q.page) {
    // for human readability, the API docs ask for page numbers starting at page #1; however, MongoDB starts at page #0 hence the following
    const page = parseInt(q.page) > 0 ? parseInt(q.page) - 1 : parseInt(q.page);
    limitAndSkip(res, parseInt(q.limit), page);
  } else if (q.noradID?.length > 0) {
    findAndFetch(res, api, collection, q.noradID, "NORAD ID", "noradID", "i");
  } else if (q.name?.length > 0) {
    findAndFetch(res, api, collection, q.name, "name", "names.name", "i");
  } else if (q.type?.length > 0) {
    findAndFetch(res, api, collection, q.type, "type", "types.type", "i");
  } else if (q.orbit?.length > 0) {
    findAndFetch(res, api, collection, q.orbit, "orbit", "orbits.orbit", "i");
  } else if (q.modifiedAfter) {
    modifiedAfterFilter(res, api, collection, q.modifiedAfter, "modifiedAfter");
  } else {
    // default limit is 20 satellites per page starting at page #0
    limitAndSkip(res, 20, 0);
  }
}
