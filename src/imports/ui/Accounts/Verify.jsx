import React, { useContext, useEffect } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { useLocation, useHistory } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import HelpersContext from "../Dialogs/HelpersContext.jsx";

// Components
import { Home } from "../Home.jsx";
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";

export const Verify = () => {
  const location = useLocation();
  const history = useHistory();

  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } = useContext(HelpersContext);

  const token = location.search.slice(7, location.search.length);

  useEffect(() => {
    if (Meteor.user()?.emails[0]?.verified) {
      setAlert({
        title: "Error Encountered",
        text: "Your email has already been verified!",
        closeAction: buttonClick
      });
      setOpenAlert(true);
    } else {
      Accounts.verifyEmail(token, (err, res) => {
        if (Meteor.user().emails[0].verified) {
          setSnack("Your email has been successfully verified!");
          setOpenSnack(true);
          history.push("/");
        } else if (err || res) {
          setAlert({
            title: "Error Encountered",
            text: err?.reason || res?.toString(),
            actions: null,
            closeAction: buttonClick
          });
          setOpenAlert(true);
        }
      });
    }
  }, []);

  const buttonClick = (
    <span
      onClick={() => {
        history.push("/");
      }}>
      CLOSE
    </span>
  );

  return (
    <React.Fragment>
      <AlertDialog bodyAlert={alert} />
      <SnackBar bodySnack={snack} />
      <Home />
    </React.Fragment>
  );
};
