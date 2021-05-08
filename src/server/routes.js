import { SatelliteCollection } from '/imports/api/satellite';
import { SchemaCollection } from '/imports/api/schema';

WebApp.connectHandlers.use('/api/satellite', (req, res, next) => {
  
    async function getSats() {
    
        res.setHeader('Content-Type', 'application/json');
        // Try and fetch from the database, else return an error
  
        try {
            const sats = await SatelliteCollection.find().fetch();
            res.writeHead(200);
            res.end( JSON.stringify( sats));
    
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
  
        try {
            const sats = await SchemaCollection.find().fetch();
            res.writeHead(200);
            res.end( JSON.stringify( sats));
    
        }
        catch(err) {
            error = {error:"Could not fetch schema"}
            res.writeHead(500);
            res.end( JSON.stringify( error ));
        }
    };
  
    getSchema();
    
  });
  
  
  WebApp.connectHandlers.use('/hello', (req, res, next) => {
    res.writeHead(200);
    res.end(`Hello world from: ${Meteor.release}`);
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


  
  