import React from 'react';
import { Nav } from "./Nav.jsx";
import { Table } from './Table.jsx';
//import { SchemaModal } from './SchemaModal/SchemaModal.jsx';

export const App = () => (
  <div>
    <Nav/>
    <Table/>
    {/* <SchemaModal show={true} onClick={() => { return; }} /> */}
  </div>
);
