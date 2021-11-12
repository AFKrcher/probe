import { SchemaCollection } from "/imports/api/schemas";
import { findAndFetch } from "./commonDataFuncs";

const collection = "schemas";
const api = SchemaCollection;

export async function getSchemas(req, res) {
  // pagination for an all schemas request is not necessary, as schemas will likely never exceed 100 entries
  const q = req.query;
  res.setHeader("Content-Type", "application/json");
  if (q.name?.length > 0) {
    findAndFetch(res, api, collection, q.name, "name", "name", "i");
  } else {
    findAndFetch(res, api, collection);
  }
}
