import React, { useState } from "react";
// Imports
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import HelpersContext from "./Dialogs/HelpersContext.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { Accounts } from "meteor/accounts-base";

// Components
import { Nav } from "./Navigation/Nav.jsx";
import { SatellitesTable } from "./DataDisplays/SatellitesTable.jsx";
import { SchemasTable } from "./DataDisplays/SchemasTable.jsx";
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
import { Admin } from './Accounts/Admin'
import { Verify } from './Accounts/Verify'

// @material-ui
import { ThemeProvider } from "@material-ui/core/styles";
import { themes } from "./css/Themes.jsx";
import { CssBaseline, Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  main: {
    position: "relative",
    marginTop: 30,
    marginBottom: 40,
    minHeight: "85vh",
  },
  footer: {
    position: "relative",
    bottom: 0,
    height: 0,
  },
}));

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
  const [snack, setSnack] = useState(""); //snackbar body text

  const [user, roles, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("roles");
    const roles = Roles.getRolesForUser(Meteor.userId());
    const user = Meteor.user()?.username;
    return [user, roles, !sub.ready()]
  })

  const classes = useStyles();
  const toggleTheme = () => {
    setTheme((theme) => (theme === themes.dark ? themes.light : themes.dark));
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
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Nav theme={theme} toggleTheme={toggleTheme} />
          <Container maxWidth="lg">
            <main className={classes.main}>
              <Switch>
                <Route exact={true} path="/satellites">
                  <SatellitesTable roles={roles}/>
                </Route>
                <Route exact={true} path="/login">
                  {user || isLoading ? <Home /> : <Login />}
                </Route>
                <Route exact={true} path="/register">
                  {user || isLoading ? <Home /> : <Register />}
                </Route>
                <Route path="/reset">
                  {user || isLoading ? <Home /> : <ResetPassword />}
                </Route>
                <Route path="/verify">
                  <Verify />
                  {/* {user || isLoading ? <Home /> : <Verify />} */}
                </Route>
                <Route exact={true} path="/settings">
                  {!user || isLoading ? <Home /> : <Settings />}
                </Route>
                <Route exact={true} path="/menu">
                  <DropDown />
                </Route>
                <Route exact={true} path="/admin">
                  <Admin />
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
                <Route path="*">
                  <Home />
                </Route>
              </Switch>
            </main>
            <footer className={classes.footer}>
              <Footer />
            </footer>
          </Container>
        </Router>
      </ThemeProvider>
    </HelpersContext.Provider>
  );
};
