import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Nav } from "./Nav.jsx";
import { SatellitesTable } from './SatellitesTable.jsx';
import { SchemasTable } from './SchemasTable.jsx';
import { Home } from "./Home.jsx";
import { About } from "./About.jsx";
import { DataSourcesTable } from "./DataSourcesTable";
import { Footer } from "./Footer.jsx";
import '../../bootstrap_theme/bootstrap.min.css';

export const App = () => {
  return (
    <Router>
      <div>
        <Nav/>
        <Switch>
          <Route path="/satellites">
            <SatellitesTable />
          </Route>
          <Route path="/schemas">
            <SchemasTable />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          {/* <Route path="/sources">
            <DataSourcesTable />
          </Route> */}
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
        <Footer/>
      </div>
    </Router>
  )
};
