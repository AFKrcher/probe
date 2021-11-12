import { SatelliteCollection } from "/imports/api/satellites";
import { findAndFetch } from "./commonDataFuncs";

const collection = "satellites";
const api = SatelliteCollection;

const modifiedAfterFilter = (res, parameter, limit, page, queryName) => {
  res.status(200).end(JSON.stringify(parameter + queryName));
};

export async function getSats(req, res) {
  const q = req.query;
  res.setHeader("Content-Type", "application/json");
  // for human readability, the API docs ask for page numbers starting at page #1; however, MongoDB starts at page #0 hence the following
  let page = q.page;
  if (parseInt(page)) {
    page = parseInt(q.page) > 0 ? parseInt(q.page) - 1 : parseInt(q.page);
  } else {
    page = 0;
  }
  // restrict users from querying too many satellites per request: 20 default, 100 max per page
  let limit = q.limit;
  if (parseInt(limit)) {
    limit = parseInt(q.limit) > 100 ? 100 : parseInt(q.limit);
  } else {
    limit = 20;
  }
  if (q.noradID?.length > 0) {
    findAndFetch(res, api, collection, q.noradID, "NORAD ID", "noradID", "i", limit, page);
  } else if (q.name?.length > 0) {
    findAndFetch(res, api, collection, q.name, "name", "names.name", "i", limit, page);
  } else if (q.type?.length > 0) {
    findAndFetch(res, api, collection, q.type, "type", "types.type", "i", limit, page);
  } else if (q.orbit?.length > 0) {
    findAndFetch(res, api, collection, q.orbit, "orbit", "orbits.orbit", "i", limit, page);
  } else if (q.modifiedAfter) {
    modifiedAfterFilter(res, q.modifiedAfter, "modified after date", limit, page);
  } else {
    findAndFetch(res, api, collection, null, null, null, null, limit, page);
  }
}

export async function getSatsPartner(req, res) {
  const q = req.query;
  res.setHeader("Content-Type", "application/json");
  // for human readability, the API docs ask for page numbers starting at page #1; however, MongoDB starts at page #0 hence the following
  let page = q.page;
  if (parseInt(page)) {
    page = parseInt(q.page) > 0 ? parseInt(q.page) - 1 : parseInt(q.page);
  } else {
    page = 0;
  }
  // partners have no limit per request: no default, no max per page
  let limit = q.limit;
  if (parseInt(limit)) {
    limit = parseInt(q.limit);
  }
  if (q.noradID?.length > 0) {
    findAndFetch(res, api, collection, q.noradID, "NORAD ID", "noradID", "i", limit, page);
  } else if (q.name?.length > 0) {
    findAndFetch(res, api, collection, q.name, "name", "names.name", "i", limit, page);
  } else if (q.type?.length > 0) {
    findAndFetch(res, api, collection, q.type, "type", "types.type", "i", limit, page);
  } else if (q.orbit?.length > 0) {
    findAndFetch(res, api, collection, q.orbit, "orbit", "orbits.orbit", "i", limit, page);
  } else if (q.modifiedAfter) {
    modifiedAfterFilter(res, q.modifiedAfter, "modified after date", limit, page);
  } else {
    findAndFetch(res, api, collection, null, null, null, null, limit, page);
  }
}
