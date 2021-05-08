import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { SchemaModal } from './SchemaModal/SchemaModal.jsx';

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello/>
    <Info/>
    <SchemaModal show={true} onClick={() => { return; }} />
  </div>
);
