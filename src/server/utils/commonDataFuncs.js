export const defaultError = (collection) =>
  `Could not fetch ${collection} based on query parameters. Please make sure your query was structured IAW the PROBE API documentation.`;

export const specificError = (collection, query) =>
  `Could not fetch ${collection} based on provided ${query}. Please try a different ${query}.`;

export const findAndFetch = async (res, api, collection, parameter, queryName, key, options, limit, page) => {
  let queryObject = {};
  if (key) queryObject[key] = { $regex: parameter, $options: options };
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
