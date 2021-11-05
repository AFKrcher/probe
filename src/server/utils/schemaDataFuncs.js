import { SchemaCollection } from "/imports/api/schemas";

export function getSchemas(req, res) {
  let error;
  res.setHeader("Content-Type", "application/json");
  try {
    let schemaName = req.query.name;
    if (schemaName && schemaName !== "") {
      res.writeHead(200);
      res.end(JSON.stringify(SchemaCollection.find({ name: `${req.query.name}` }).fetch()));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify(SchemaCollection.find().fetch()));
    }
  } catch (err) {
    error = { error: "Could not fetch schemas" };
    res.writeHead(500);
    res.end(JSON.stringify(error));
  }
}
