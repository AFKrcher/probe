export const defaultError = (collection) =>
  `Could not fetch ${collection} based on query parameters. Please make sure your query was structured IAW the PROBE API documentation.`;

export const specificError = (collection, query, pagination = false) => {
  return pagination
    ? `Could not fetch ${collection} based on provided limit and skip configuration.`
    : `Could not fetch ${collection} based on provided ${query}. Please try a different ${query}.`;
};

export const findAndFetch = (res, api, collection, parameter, name, key, options) => {
  let error = defaultError(collection);
  let queryObject = {};
  queryObject[key] = { $regex: parameter, $options: options };
  try {
    const result = api.find(queryObject).fetch();
    if (result.length > 0 && result[0] !== undefined) {
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } else {
      error = specificError(collection, name);
      res.writeHead(500);
      res.end(JSON.stringify(error));
    }
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify(error));
  }
};
