import { Meteor } from 'meteor/meteor';
import { SchemaCollection } from '/imports/api/schema';
import { SatelliteCollection } from '/imports/api/satellite';
import './routes'
var fs = Npm.require('fs');

Meteor.startup(() => {

  if (SchemaCollection.find().count() === 0 ){
    var jsonObj = new Array();
  
    files = fs.readdirSync('./assets/app/schema' );
  
    // create the large JSON array 
    files.forEach(function (file) {
      data = fs.readFileSync('./assets/app/schema/' + file,'ascii');
      jsonObj.push(JSON.parse(data));
    })
  
    // Write to Mongo
    jsonObj.forEach(function (data) {
      SchemaCollection.insert(data);
    })
    
  }

  // write example sat
  if (SatelliteCollection.find().count() === 0 ){
    // Add some data 

    // SatelliteCollection.insert(
    //   data
    // );

  }

});
