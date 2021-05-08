import React from 'react';
import { Table } from './Table.jsx';
import { Info } from './Info.jsx';
import { Nav } from "./Nav.jsx";

//import { SchemaModal } from './SchemaModal/SchemaModal.jsx';

export const App = () => (
  <div>
    <Nav/>
    <Table/>
    <Info/>
    {/* <SchemaModal show={true} onClick={() => { return; }} /> */}
  </div>
);
