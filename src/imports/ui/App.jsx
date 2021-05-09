import React, { useState } from 'react';
import { Nav } from "./Nav.jsx";
import { Table } from './Table.jsx';
import { SchemaModal } from './SchemaModal/SchemaModal.jsx';
import Container from "react-bootstrap/container";
import '../../bootstrap_theme/bootstrap.min.css';

export const App = () => {
  const [showSchemaModal, setShowSchemaModal] = useState(true);

  return (
    <div>
      <Nav/>
      <Container variant="dark">
        <Table/>
        <SchemaModal show={showSchemaModal} handleClose={() => { setShowSchemaModal(false) }} />
      </Container>
    </div>
  )
};