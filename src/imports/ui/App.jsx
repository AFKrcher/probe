import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Nav } from "./Nav.jsx";
import { SatellitesTable } from './SatellitesTable.jsx';
import { SchemasTable } from './SchemasTable.jsx';
import { Home } from "./Home.jsx";
import { About } from "./About.jsx";
import { DataSourcesTable } from "./DataSourcesTable";
import { Footer } from "./Footer.jsx";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { darkTheme } from './Themes.jsx';
import { CssBaseline } from '@material-ui/core';



export const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
    </ThemeProvider>
  )
};
