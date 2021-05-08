import { Meteor } from 'meteor/meteor';
import { SchemaCollection } from '/imports/api/schema';
import { SatelliteCollection } from '/imports/api/satellite';
import './routes'
var fs = Npm.require('fs');

function insertSchema({ schema }) {
  SchemaCollection.insert({schema, createdAt: new Date()});
}

function insertSat({ name, noradID }) {
  SatelliteCollection.insert({name, noradID, createdAt: new Date()});
}

function insertSatEx({ name, noradID, observation }) {
  SatelliteCollection.insert({name, noradID, observation, createdAt: new Date()});
}




Meteor.startup(() => {
  if (SatelliteCollection.find().count() === 0 ){
    // Add some data 

    insertSat({
      name: 'ISS - Zarya',
      noradID: '25544'
    });

    // insertSatEx({
    //   name: ['ISS - Zarya','ISS','Floaty Space Ship'],
    //   noradID: '25544',
    //   observation: "{name:'whack json string'}"
    // });

  }



  if (SchemaCollection.find().count() === 0 ){

    Meteor.bindEnvironment( () => {

      // Read from private folder, parse schemas into the database

    //   fs.readdir('./assets/app/schema', function(err, files) {
    //     if (err) {
    //       return console.log("Unable to read from schema dir " + err);
    //     }
  
    //     files.forEach(function (file) {
    //       fs.readFile('./assets/app/schema/' + file,'ascii', (err,data) => {
  
    //         schema = JSON.parse(data);

    //         insertSchema({data})
    //       })
          
    //     })
    //   });
    });
  }





});



function updateEntry(){
  // SatelliteCollection.update({_id: '2r8rrAwXct5xP9amg'},  { $set: {"new_field": 1} },)
  
  // Multi doesn't work from client
  // SatelliteCollection.update({},    [{ $set: { new_field: ["1"] } }],  {multi: true })
  // SatelliteCollection.update({_id: '2r8rrAwXct5xP9amg'},  { $convert: {input: new_field, to: array } })
  // SatelliteCollection.update({_id: '2r8rrAwXct5xP9amg'},  { $push: {new_field: 2} })
}
updateEntry();