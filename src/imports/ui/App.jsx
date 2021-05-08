import React from 'react';
import { Nav } from "./Nav.jsx";
import { Table } from './Table.jsx';
import Container from "react-bootstrap/container";
//import './bootstrap_theme/bootstrap.min.css';
//import { SchemaModal } from './SchemaModal/SchemaModal.jsx';

export const App = () => (
  <div>
    <Nav/>
    <Container varient="dark">
      <Table/>
      {/* <SchemaModal show={true} onClick={() => { return; }} /> */}
    </Container>
  </div>
);
