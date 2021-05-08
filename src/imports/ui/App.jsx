import React from 'react';
import { Table } from './Table.jsx';
import { Info } from './Info.jsx';
import { SchemaModal } from './SchemaModal/SchemaModal.jsx';

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Table/>
    <Info/>
    <SchemaModal show={true} onClick={() => { return; }} />
  </div>
);
