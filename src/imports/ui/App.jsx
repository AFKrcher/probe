import React from 'react';
import { Table } from './Table.jsx';
import { Info } from './Info.jsx';
import { Sats } from './Satellite';

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Table/>
    <Info/>
    <Sats/>
  </div>
);
