import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { SatelliteCollection } from '../api/satellite';

export const Sats = () => {
  const sat = useTracker(() => {
    return SatelliteCollection.find().fetch();
  });

  return (
    <div>
      <h2>Woah satellites!</h2>
      <ul>{sat.map(
        sat => <li key={sat._id}>
            <p> Name: {sat.name + '\t'}  NoradID: {sat.noradID}  </p>
        </li>
      )}</ul>
    </div>
  );
};
