import React, { useContext } from "react";
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

  const buttonClick = (
    <span
      onClick={() => {
        window.location.href = "/";
      }}
    >
      CLOSE
    </span>
  );

  Accounts.verifyEmail(token, (err, res) => {
    if (err || res) {
      setAlert({
        title: "Error Encountered",
        text: err?.reason,
        actions: null,
        closeAction: buttonClick,
      });
      setOpenAlert(true);
    } else {
      setAlert({
        title: "Success!",
        text: `Welcome, ${
          Meteor.user().username
        }! Your email has been successfully verified. You can now use add, update, and delete data on the website as a user.`,
        closeAction: buttonClick,
      });
      setOpenAlert(true);
    }
  });

  return (
    <React.Fragment>
      <AlertDialog bodyAlert={alert} />
      <Home />
    </React.Fragment>
  );
};
