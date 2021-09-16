import React, { useState } from "react";
// Imports
import { Accounts } from "meteor/accounts-base";
import { useTracker } from "meteor/react-meteor-data";
import { useHistory } from "react-router";

// @material-ui
import { Grid, Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(4),
    width: "300px",
  },
  formContainer: {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  textField: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
}));

export const Register = () => {
  const classes = useStyles();
  const history = useHistory();
  // const [disabled, setDisabled] = useState(true);
  const [passErr, setPassErr] = useState();
  const [passHelper, setPassHelper] = useState("");
  const [confirmErr, setConfirmErr] = useState();
  const [confirmHelper, setConfirmHelper] = useState("");
  const [emailErr, setEmailErr] = useState();
  const [emailHelper, setEmailHelper] = useState("");
  const [userErr, setUserErr] = useState();
  const [userHelper, setUserHelper] = useState("");
  const redirect = () => {
    history.push("/");
  };
  const loginRedirect = () => {
    history.push("/login");
  };

  const [disabled] = useTracker(() => {
    let disabled = true;
    if (
      emailErr === false &&
      userErr === false &&
      passErr === false &&
      confirmErr === false
    ) {
      disabled = false;
    } else {
      disabled = true;
    }
    return [disabled];
  });

  const validateEmail = () => {
    let email = document.getElementById("email")?.value;
    if (email) {
      if (
        email.indexOf("@") > 1 &&
        email.indexOf(".") > 1 &&
        // !/^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2}/
        !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(email)
      ) {
        Meteor.call("emailExists", email, (res, err) => {
          if (err) {
            setEmailErr(true);
            setEmailHelper(err);
          } else {
            setEmailErr(false);
            setEmailHelper("");
          }
        });
      } else {
        setEmailErr(true);
        setEmailHelper("Invalid email address");
      }
    }
  };

  const validateUsername = () => {
    let username = document.getElementById("username")?.value;
    if (username) {
      if (
        username.length > 3 &&
        !/[~`!#$@.%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username)
      ) {
        Meteor.call("userExists", username, function (res, err) {
          if (err) {
            setUserErr(true);
            setUserHelper(err);
          } else {
            setUserErr(false);
            setUserHelper("");
          }
        });
      } else {
        setUserErr(true);
        setUserHelper("Needs 4+ length & NO special characters!");
      }
    }
  };

  const validate = () => {
    let pass = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    let regex = new RegExp(
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
    );
    if (pass) {
      if (!regex.test(pass)) {
        setPassErr(true);
        setPassHelper("Needs 8+ length, upper, lower, & special characters!");
      } else {
        setPassErr(false);
        setPassHelper("");
      }
      if (pass && confirm) {
        if (confirm === pass) {
          setConfirmErr(false);
          setConfirmHelper("");
        } else {
          // setDisabled(true);
          setConfirmErr(true);
          setConfirmHelper("Passwords do not match!");
        }
      }
    }
  };

  let timer;
  const waitValidate = (arg) => {
    // Clears any outstanding timer
    clearTimeout(timer);
    // Then sets new timer that may or may not get cleared
    if (arg === "email") {
      timer = setTimeout(() => validateEmail(), 1000);
    } else {
      timer = setTimeout(() => validateUsername(), 1000);
    }
  };

  const registerUser = (e) => {
    e.preventDefault();
    // In server/main.js, Accounts.onCreateUser is called & user is assigned a role.
    Accounts.createUser(
      {
        email: e.target.email.value,
        username: e.target.username.value,
        password: e.target.password.value,
      },
      (error) => {
        console.log(error);
      }
    );
    redirect();
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      {Meteor.loggingIn() || Meteor.user()?._id ? (
        redirect(<div>You are already logged in.</div>)
      ) : (
        <FormControl className={classes.margin}>
          <form onSubmit={registerUser} className={classes.flexContainer}>
            <TextField
              id="email"
              error={emailErr}
              helperText={emailHelper}
              label="Email"
              type="email"
              onBlur={validateEmail}
              onChange={() => waitValidate("email")}
              ref={(input) => (email = input)}
              fullWidth
              className={classes.textField}
            />
            <TextField
              id="username"
              error={userErr}
              helperText={userHelper}
              label="Username"
              onBlur={validateUsername}
              onChange={() => waitValidate("username")}
              ref={(input) => (username = input)}
              fullWidth
              className={classes.textField}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              error={passErr}
              helperText={passHelper}
              onChange={validate}
              ref={(input) => (password = input)}
              fullWidth
              className={classes.textField}
            />
            <TextField
              error={confirmErr}
              id="confirm"
              helperText={confirmHelper}
              label="Confirm password"
              onChange={validate}
              type="password"
              fullWidth
              className={classes.textField}
            />
            <Button
              id="register-button"
              variant="outlined"
              color="primary"
              type="submit"
              fullWidth
              disabled={disabled}
              className={classes.button}
            >
              Register User
            </Button>
            <Button
              id="login-button"
              fullWidth
              className={classes.button}
              onClick={loginRedirect}
            >
              Login Instead
            </Button>
          </form>
        </FormControl>
      )}
    </Grid>
  );
};
