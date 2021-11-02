import React, { useContext, useEffect } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { useLocation } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import HelpersContext from "../Dialogs/HelpersContext.jsx";

// Components
import { Home } from "../Home.jsx";
import AlertDialog from "../Dialogs/AlertDialog.jsx";

export const Verify = () => {
  const location = useLocation();
  const { setOpenAlert, alert, setAlert } = useContext(HelpersContext);
  const token = location.search.slice(7, location.search.length);

  useEffect(() => {
    if (Meteor.user()?.emails[0]?.verified) {
      setAlert({
        title: "Error Encountered",
        text: "Your email has already been verified!",
        closeAction: buttonClick,
      });
      setOpenAlert(true);
    } else {
      Accounts.verifyEmail(token, (err, res) => {
        if (Meteor.user().emails[0].verified) {
          setAlert({
            title: "Email Verified",
            text: "Your email has been successfully verified!",
            closeAction: buttonClick,
          });
          setOpenAlert(true);
        } else if (err || res) {
          setAlert({
            title: "Error Encountered",
            text: err?.reason,
            actions: null,
            closeAction: buttonClick,
          });
          setOpenAlert(true);
        }
      });
    }
  }, []);

  const buttonClick = (
    <span
      onClick={() => {
        window.location.href = "/";
      }}
    >
      CLOSE
    </span>
  );

  return (
    <React.Fragment>
      <AlertDialog bodyAlert={alert} />
      <Home />
    </React.Fragment>
  );
};
