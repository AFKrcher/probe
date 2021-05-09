import { Meteor } from 'meteor/meteor';
import { SchemaCollection } from '/imports/api/schema';
import { SatelliteCollection } from '/imports/api/satellite';
import './routes'
var fs = Npm.require('fs');

Meteor.startup(() => {

//   // From schema output data format
//   schema = {
//     "Name": "Transponder",
//     "Fields": [
//         {
//             "Name": "Ref",
//             "Type": "string"
//         },
//         {
//             "Name": "Band",
//             "Type": "string"
//         },
//         {
//             "Name": "Scale",
//             "Type": "string",
//             "AllowedValues": [
//                 "Mhz",
//                 "Khz",
//                 "Hz"
//             ]
//         },
//         {
//             "Name": "Direction",
//             "Type": "string",
//             "AllowedValues": [
//                 "up",
//                 "down",
//                 "both"
//             ]
//         }
//     ]
//   }

//   schema2 = {
//     "Name": "Manufacturer",
//     "Fields": [
//           {
//               "Name": "Ref",
//               "Type": "string"
//           },
//       {
//         "Name": "Manufacturers",
//         "Type": [
//           {
//             "Name": "Name",
//             "Type": "string"
//           }
//         ]
//       }
//     ]
// }

  // schemaName = schema["Name"]
  // output = {
  //   schemaName : "1234"

  // };
  
  // for(var attributename in schema["Fields"]){
  //   propName =   schema["Fields"][attributename]["Name"]
  //   console.log(attributename+": "+ propName);
  //   output[propName] = "EmptyVal"
  // }

  // console.log(output);


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

    SatelliteCollection.insert(
      data
    );

  }


});
