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

    // var jsonObj = new Array();
  
    // files = fs.readdirSync('./assets/app/satellite' );
  
    // // create the large JSON array 
    // files.forEach(function (file) {
    //   data = fs.readFileSync('./assets/app/satellite/' + file,'ascii');
    //   jsonObj.push(JSON.parse(data));
    // })
  
    // // Write to Mongo
    // jsonObj.forEach(function (data) {
    //   SatelliteCollection.insert(data);
    // })


    // mission type 
    // launch vehicle 
    // organisation 
    // news
    // status
    // power
    // payload
    // prop
    // images
    

    data = fs.readFileSync('./assets/app/exampleSatellite.json','ascii');
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync('./assets/app/satellite/28479.json','ascii');
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync('./assets/app/satellite/33591.json','ascii');
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync('./assets/app/satellite/39762.json','ascii');
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync('./assets/app/satellite/39765.json','ascii');
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync('./assets/app/satellite/44485.json','ascii');
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync('./assets/app/satellite/45856.json','ascii');
    SatelliteCollection.insert(JSON.parse(data));
    
    data = fs.readFileSync('./assets/app/satellite/46458.json','ascii');
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync('./assets/app/satellite/46479.json','ascii');
    SatelliteCollection.insert(JSON.parse(data));
  }

});
