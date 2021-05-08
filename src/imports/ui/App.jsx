import React from 'react';
import { Nav } from "./Nav.jsx";
import { Table } from './Table.jsx';
import { SchemaModal } from './SchemaModal/SchemaModal.jsx';
import Container from "react-bootstrap/container";
import '../../bootstrap_theme/bootstrap.min.css';

export const App = () => (
  <div>
    <Nav/>
    <Container varient="dark">
      <Table/>
      <SchemaModal show={false} onClick={() => { return; }} />
    </Container>
  </div>
);