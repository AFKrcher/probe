import React, { useState } from 'react';
import { Nav } from "./Nav.jsx";
import { SatsTable } from './SatsTable.jsx';
import { SchemasTable } from './SchemasTable.jsx';
import { About } from "./About.jsx";
import { Footer } from "./Footer.jsx";
import { SchemaModal } from './SchemaModal/SchemaModal.jsx';
import '../../bootstrap_theme/bootstrap.min.css';

export const App = () => {
  const [showSchemaModal, setShowSchemaModal] = useState(true);
  return (
    <div>
      <Nav/>
      <About/>
      <SatsTable/>
      <SchemasTable/>
      <SchemaModal show={showSchemaModal} handleClose={() => { setShowSchemaModal(false) }} />
      <Footer/>
    </div>
  )
};
