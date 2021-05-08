import { SatelliteCollection } from '/imports/api/satellite';

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
  
  
  WebApp.connectHandlers.use('/hello', (req, res, next) => {
    res.writeHead(200);
    res.end(`Hello world from: ${Meteor.release}`);
  });