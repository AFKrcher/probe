import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { SatelliteCollection } from '/imports/api/satellite';
import './routes'

function insertLink({ title, url }) {
  LinksCollection.insert({title, url, createdAt: new Date()});
}

function insertSat({ name, noradID }) {
  SatelliteCollection.insert({name, noradID, createdAt: new Date()});
}

function insertSatEx({ name, noradID, observation }) {
  SatelliteCollection.insert({name, noradID, observation, createdAt: new Date()});
}




Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  if (LinksCollection.find().count() === 0) {
    insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app'
    });

    insertLink({
      title: 'Follow the Guide',
      url: 'http://guide.meteor.com'
    });

    insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com'
    });

    insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com'
    });
  }

  if (SatelliteCollection.find().count() === 0 ){
    // Add some data 

    insertSat({
      name: 'ISS - Zarya',
      noradID: '25544'
    });

  }
});

// insertSatEx({
//   name: ['ISS - Zarya','ISS','Floaty Space Ship'],
//   noradID: '25544',
//   observation: {json:'whack json string'}
// });

function updateEntry(){
  // SatelliteCollection.update({_id: '2r8rrAwXct5xP9amg'},  { $set: {"new_field": 1} },)
  
  // Multi doesn't work from client
  // SatelliteCollection.update({},    [{ $set: { new_field: ["1"] } }],  {multi: true })
  // SatelliteCollection.update({_id: '2r8rrAwXct5xP9amg'},  { $convert: {input: new_field, to: array } })
  // SatelliteCollection.update({_id: '2r8rrAwXct5xP9amg'},  { $push: {new_field: 2} })
}
updateEntry();