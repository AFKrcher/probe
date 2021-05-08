import React from 'react';
import { Nav } from "./Nav.jsx";
import { SatsTable } from './SatsTable.jsx';
import { About } from "./About.jsx";
import { Footer } from "./Footer.jsx";
import { SchemaModal } from './SchemaModal/SchemaModal.jsx';
import '../../bootstrap_theme/bootstrap.min.css';

export const App = () => (
  <div>
    <Nav/>
    <About/>
    <SatsTable/>
    <SchemaModal show={false} onClick={() => { return; }} />
    <Footer/>
  </div>
);