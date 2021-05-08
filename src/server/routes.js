import { SatelliteCollection } from '/imports/api/satellite';
import { SchemaCollection } from '/imports/api/schema';

WebApp.connectHandlers.use('/api/satellite', (req, res, next) => {
  
    async function getSats() {
        // Check for HTTP type, get POST etc 
        // req.method
        res.setHeader('Content-Type', 'application/json');
    
        try {
            // TODO: Parse params middelware ? 
            satName = req.query.name;
            if (satName !== null && satName !== '') {
                const sats = await SatelliteCollection.find({"name":satName}).fetch();
                // TODO: Find way of refactoring this, doesn't like the res and const outside of same block 
                res.writeHead(200);
                res.end( JSON.stringify( sats ));
            }
            else {
                const sats = await SatelliteCollection.find().fetch();
                res.writeHead(200);
                res.end( JSON.stringify( sats ));
            }
        }
        catch(err) {
            error = {error:"Could not fetch sats"}
            res.writeHead(500);
            res.end( JSON.stringify( error ));
        }
    };
    getSats();
});

WebApp.connectHandlers.use('/api/schema', (req, res, next) => {
  
    async function getSchema() {
        res.setHeader('Content-Type', 'application/json');
        // Try and fetch from the database, else return an error
        // TODO: Parser params middelware ? 
        try {
            schemaName = req.query.name;
            if (schemaName !== null && schemaName !== '') {
                const sats = await SchemaCollection.find({"Name":schemaName}).fetch();
                res.writeHead(200);
                res.end( JSON.stringify( sats));
            }
            else {
                const sats = await SchemaCollection.find().fetch();
                res.writeHead(200);
                res.end( JSON.stringify( sats));
            }
        }
        catch(err) {
            error = {error:"Could not fetch schema"}
            res.writeHead(500);
            res.end( JSON.stringify( error ));
        }
    };
    getSchema();
  });

  
  // End points:

  // CRUD 

  // Back end for add / edit items in Satellites 
  // Schema collections 

  // Sat (Top Level)
  // Create /api/satellite/create?NoradID=25544
  // Read   /api/satellite/25544
  // Update /api/satellite/25544?TopLevelField=Whatever
  // Delete ? 
  
  
  // PSRA (Under Satellite)
  // Create /api/psra/SatID?Schema=Prop&Field2=123&Field3=123
  // Read  /api/psra/25544 
  // Update /api/psra/25544?Schema=Prop&Field2=123&Field3=123
  // Delete ? 


  // 10 sats, data populated
  
  // 