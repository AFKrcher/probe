import { Meteor } from "meteor/meteor";
import { SchemaCollection } from "/imports/api/schemas";
import { SatelliteCollection } from "/imports/api/satellites";
import "./routes";
import { Roles } from "meteor/alanning:roles";

var fs = Npm.require("fs");
import { Accounts } from "meteor/accounts-base";
Meteor.startup(() => {
  Accounts.onCreateUser((options, user) =>{
    Roles.addUsersToRoles(user, 'user')
    console.log("id ", user._id)
    return user
  })
  Roles.createRole("user", {unlessExists: true});
  Roles.createRole("admin", {unlessExists: true});
  Roles.createRole("moderator", {unlessExists: true})
  Roles.createRole("dummies", {unlessExists: true});
  // Roles.addUsersToRoles("9wTy6NJYiDTMDAYgH", 'user')
  console.log('is he there?', Roles.getUsersInRole('user').fetch())
  // console.log('users: ', Meteor.users.find({}).fetch())
  // console.log('hi', Roles.getAllRoles().fetch())




  if (SchemaCollection.find().count() === 0) {
    var jsonObj = new Array();

    files = fs.readdirSync("./assets/app/schema");

    // Insert seed schema data
    files.forEach(function (file) {
      data = fs.readFileSync("./assets/app/schema/" + file, "ascii");
      jsonObj.push(JSON.parse(data));
    });

    // Write to Mongo
    jsonObj.forEach(function (data) {
      SchemaCollection.insert(data);
    });
  }

  // Publish satellites collection
  Meteor.publish("satellites", () => {
    return SatelliteCollection.find({});
  });
  // Publish schemas collection
  Meteor.publish("schemas", () => {
    return SchemaCollection.find({});
  });

 // Insert seed satellite data
  if (SatelliteCollection.find().count() === 0) {

    data = fs.readFileSync("./assets/app/satellite/28479.json", "ascii");
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync("./assets/app/satellite/33591.json", "ascii");
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync("./assets/app/satellite/39762.json", "ascii");
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync("./assets/app/satellite/39765.json", "ascii");
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync("./assets/app/satellite/44485.json", "ascii");
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync("./assets/app/satellite/45856.json", "ascii");
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync("./assets/app/satellite/46458.json", "ascii");
    SatelliteCollection.insert(JSON.parse(data));

    data = fs.readFileSync("./assets/app/satellite/46479.json", "ascii");
    SatelliteCollection.insert(JSON.parse(data));
  }
});