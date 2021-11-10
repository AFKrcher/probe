import { SchemaCollection } from "/imports/api/schemas";
import { findAndFetch, defaultError } from "./commonDataFuncs";

const collection = "schemas";
const api = SchemaCollection;

export async function getSchemas(req, res) {
  const q = req.query;
  res.setHeader("Content-Type", "application/json");
  if (q.name?.length > 0) {
    findAndFetch(res, api, collection, q.name, "name", "name", "i");
  } else {
    try {
      const result = await api.find().fetch();
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify(defaultError(collection)));
    }
  }
}
