import React, { useState } from "react";
// Imports
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HelpersContext from "./Dialogs/HelpersContext.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

// Components
import { Admin } from "./Admin/Admin";
import { Nav } from "./Navigation/Nav.jsx";
import { SatellitesTable } from "./DataDisplays/SatellitesTable.jsx";
import { SchemasTable } from "./DataDisplays/SchemasTable.jsx";
import { Dashboard } from "./DataDisplays/Dashboard.jsx";
import { Home } from "./Home.jsx";
import { About } from "./About.jsx";
import { Footer } from "./Navigation/Footer.jsx";
import { PrivacyPolicy } from "./Navigation/PrivacyPolicy.jsx";
import { Terms } from "./Navigation/Terms.jsx";
import { Login } from "./Accounts/Login";
import { Register } from "./Accounts/Register";
import { ResetPassword } from "./Accounts/ResetPassword";
import { DropDown } from "./Navigation/DropDown";
import { Settings } from "./Accounts/Settings";
import { Verify } from "./Accounts/Verify";

// @material-ui
import { ThemeProvider } from "@material-ui/core/styles";
import { themes } from "./css/Themes.jsx";
import { CssBaseline, Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  body: {
    minHeight: "calc(100vh - 120px)",
  },
  main: {
    marginTop: 95,
    marginBottom: 60,
  },
  bottom: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  footer: {
    position: "relative",
    bottom: 0,
    width: "100%",
  },
}));

export const App = () => {
  const [theme, setTheme] = useState(themes.dark);
  const [openAlert, setOpenAlert] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [openVisualize, setOpenVisualize] = useState(false);
  const [alert, setAlert] = useState({
    title: "", //dialog title
    text: "", //dialog body text
    actions: "", //components for user input
    closeAction: "", //name of closing action button, e.g. "Cancel"
  });
  const [snack, setSnack] = useState(""); //snackbar body text

  const classes = useStyles();

  const toggleTheme = () => {
    setTheme((theme) => (theme === themes.dark ? themes.light : themes.dark));
  };

  window.onerror = function (msg, source) {
    const user = Meteor.userId() || "Not Logged-In";
    const obj = {
      user: user,
      time: new Date(),
      msg: msg,
      source: source,
    };
    Meteor.call("addError", obj);
    return true;
  };

  return (
    <HelpersContext.Provider
      value={{
        snack,
        setSnack,
        alert,
        setAlert,
        openAlert,
        setOpenAlert,
        openSnack,
        setOpenSnack,
        openVisualize,
        setOpenVisualize,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Nav theme={theme} toggleTheme={toggleTheme} />
          <Container maxWidth="lg" className={classes.body}>
            <main className={classes.main}>
              <Switch>
                <Route exact={true} path="/login">
                  <ProtectedRoute component={Login} loginRequired={false} />
                </Route>
                <Route exact={true} path="/register">
                  <ProtectedRoute component={Register} loginRequired={false} />
                </Route>
                <Route path="/reset">
                  <ProtectedRoute
                    component={ResetPassword}
                    loginRequired={false}
                  />
                </Route>
                <Route exact={true} path="/verify">
                  <Verify />
                </Route>
                <Route exact={true} path="/settings">
                  <ProtectedRoute component={Settings} loginRequired={true} />
                </Route>
                <Route exact={true} path="/menu">
                  <DropDown />
                </Route>
                <Route exact={true} path="/admin">
                  <ProtectedRoute
                    component={Admin}
                    loginRequired={true}
                    requiredRoles={["admin", "moderator"]}
                  />
                </Route>
                <Route exact={true} path="/satellites">
                  <SatellitesTable />
                </Route>
                <Route exact={true} path="/schemas">
                  <SchemasTable />
                </Route>
                <Route exact={true} path="/about">
                  <About />
                </Route>
                <Route exact={true} path="/privacypolicy">
                  <PrivacyPolicy />
                </Route>
                <Route exact={true} path="/terms">
                  <Terms />
                </Route>
                <Route exact={true} path="/">
                  <Home />
                </Route>
                <Route path="/:id">
                  <Dashboard />
                </Route>
                <Route path="*">
                  <Home />
                </Route>
              </Switch>
            </main>
          </Container>
          <div className={classes.bottom}>
            <footer className={classes.footer}>
              <Footer />
            </footer>
          </div>
        </Router>
      </ThemeProvider>
    </HelpersContext.Provider>
  );
};
