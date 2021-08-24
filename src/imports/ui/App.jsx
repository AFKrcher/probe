import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import HelpersContext from "./helpers/HelpersContext.jsx";

// Components
import { Nav } from "./Nav.jsx";
import { SatellitesTable } from "./SatellitesTable.jsx";
import { SchemasTable } from "./SchemasTable.jsx";
import { Home } from "./Home.jsx";
import { About } from "./About.jsx";
import { DataSourcesTable } from "./DataSourcesTable";
import { Footer } from "./Footer.jsx";

// @material-ui
import { ThemeProvider } from "@material-ui/core/styles";
import { themes } from "./Themes.jsx";
import { CssBaseline } from "@material-ui/core";

export const App = () => {
  const [theme, setTheme] = useState(themes.dark);
  const [openAlert, setOpenAlert] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alert, setAlert] = useState({
    title: "", //dialog title
    text: "", //dialog body text
    actions: "", //components for user input
    closeAction: "", //name of closing action button, e.g. "Cancel"
  });
  const [snack, setSnack] = useState(""); //body of the snackbar pop-up

  const toggleTheme = () => {
    setTheme((theme) => (theme === themes.dark ? themes.light : themes.dark));
  };

  return (
    <HelpersContext.Provider
      value={{
        // helper content states
        snack,
        setSnack,
        alert,
        setAlert,
        // helper open/close states
        openAlert,
        setOpenAlert,
        openSnack,
        setOpenSnack,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div>
            <Nav theme={theme} toggleTheme={toggleTheme} />
            <Switch>
              <Route exact={true} path="/satellites">
                <SatellitesTable />
              </Route>
              <Route exact={true} path="/schemas">
                <SchemasTable />
              </Route>
              <Route exact={true} path="/about">
                <About />
              </Route>
              {/* <Route path="/sources">
              <DataSourcesTable />
            </Route> */}
              <Route exact={true} path="/">
                <Home />
              </Route>
            </Switch>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </HelpersContext.Provider>
  );
};
