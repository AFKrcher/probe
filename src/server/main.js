import { Meteor } from 'meteor/meteor';
import { SchemaCollection } from '/imports/api/schema';
import { SatelliteCollection } from '/imports/api/satellite';
import './routes'
var fs = Npm.require('fs');

function insertSchema({ schema }) {
  SchemaCollection.insert({"schema": schema});
}

function insertSat({ name, noradID }) {
  SatelliteCollection.insert({name, noradID});
}

function insertSatEx({ name, noradID, observation }) {
  SatelliteCollection.insert({name, noradID, observation});
}




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
    console.log("whack");
    data = {

      "NoradID":25544,
      "Bus": [
        {
          "Ref": "Placeholder",
          "Bus": "Placeholder"
        }
      ],
      //TODO verify: Contractor diff to name?
      "Contractor" : [
        {
          "Ref" : "Placeholder",
          "Contractor" : "Placeholder"
        }
      ],
      
      "CosparID" : [
        {
          "Ref" : "Placeholder",
          "CosparID" : "Placeholder"
        }
      ],
      "DescriptionLong" : [
        {
          "Ref" : "Placeholder",
          "DescriptionLong" : "Placeholder"
        }
      ],
      "DescriptionShort" : [
        {
          "Ref" : "Placeholder",
          "Description" : "Placeholder"
        }
      ],

      "DimensionDescription" : [
        {
          "Ref" : "Placeholder",
          "DimensionDescription" : "Placeholder"
        }
      ],

      "DimensionVolumeM3" : [
        {
          "Ref" : "Placeholder",
          "CubicMeters" : 1234
        }
      ],

      "LaunchMassKg" : [
        {
          "Ref" : "Placeholder",
          "LaunchMassKg" : 1234
        }
      ],

      "LaunchSites" : [
        {
          "Ref" : "Placeholder",
          "Name" : "Placeholder",
          // TODO: Lat long as E 37.123 OR -37.123
          "Latitude" : "Placeholder",
          "Longitude" : "Placeholder",
        }
      ],

      "Manufacturer" : [
        {
          "Ref" : "Placeholder",
          "Manufacturers" : 
            [
              {
                "Name" : "Placeholder",
                "Name" : "Placeholder",
                "Name" : "Placeholder",
              }
            ]
        }
      ],




      "" : [
        {
          "Ref" : "Placeholder",
          "" : "Placeholder"
        }
      ],



      "Transponder": [
        {
          "Ref": "Placeholder",
          "Band": "Placeholder",
          "Scale": "Placeholder",
          "Direction": "Placeholder"
         },
      ],
      "Name": [      
        {
          "Ref": "Placeholder",
          "Name": "Placeholder"
        },
        {
          "Ref": "Placeholder",
          "Name": "Placeholder"
        }
      ]
    };

    SatelliteCollection.insert(

      data
    );

    // insertSatEx({
    //   name: ['ISS - Zarya','ISS','Floaty Space Ship'],
    //   noradID: '25544',
    //   observation: "{name:'whack json string'}"
    // });
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