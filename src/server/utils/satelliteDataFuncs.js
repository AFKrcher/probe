import { SatelliteCollection } from "/imports/api/satellites";
import { findAndFetch, specificError, defaultError } from "./commonDataFuncs";

const collection = "satellites";
const api = SatelliteCollection;
const defaultResponseLimit = 20;
const publicResponseLimit = 100;
const defaultPage = 0;

const modifiedAfterFilter = async (res, parameter, queryName, limit, page) => {
  let queryObject = {};
  queryObject["modifiedOn"] = { $gte: new Date(parameter) };
  let paginationObject;
  if (limit) {
    const skipper = limit * page;
    paginationObject = { limit: limit, skip: skipper };
  }
  try {
    const result = paginationObject
      ? await api.find(queryObject, paginationObject).fetch()
      : await api.find(queryObject).fetch();
    const returned = result.length;
    if (returned > 0) {
      const total = api.find(queryObject).count();
      const currentPage = `${page ? page + 1 : 1} / ${Math.ceil(total / returned)}`;
      const finalResponse = { total: total, returned: returned, page: currentPage, result: result };
      res.writeHead(200);
      res.end(JSON.stringify(finalResponse));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify(specificError(collection, queryName, true)));
    }
  } catch (err) {
    res.writeHead(404);
    res.end(JSON.stringify(defaultError(collection)));
  }
};

export async function getSats(req, res) {
  const q = req.query;
  res.setHeader("Content-Type", "application/json");
  // for human readability, the API docs ask for page numbers starting at page #1; however, MongoDB starts at page #0 hence the following
  let page = q.page;
  if (parseInt(page)) {
    page = parseInt(q.page) > 0 ? parseInt(q.page) - 1 : parseInt(q.page);
  } else {
    page = defaultPage;
  }
  // restrict users from querying too many satellites per request: 20 default, 100 max per page
  let limit = q.limit;
  if (parseInt(limit)) {
    limit = parseInt(q.limit) > publicResponseLimit ? publicResponseLimit : parseInt(q.limit);
  } else {
    limit = defaultResponseLimit;
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
