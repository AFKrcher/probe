import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { Sats } from './Satellite';

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello/>
    <Info/>
    <Sats/>
  </div>
);
