import React, {useState} from "react";
import { Accounts } from "meteor/accounts-base";
import { Formik, Form } from "formik";
// @material-ui
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));
// const [values, setValues] = useState({
//   amount: '',
//   password: '',
//   weight: '',
//   weightRange: '',
//   showPassword: false,
// });

// PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
{/* <ul>
  <li>Contain at least 8 characters long</li>
  <li>Contain at least 1 uppercase letter</li>
  <li>Contain at least 1 lowercase letter</li>
  <li>Contain at least 1 number</li>
  <li>Contain at least 1 special character: @ $ ! % * ? &</li>
</ul> */}

export const Login = () => {
  const classes = useStyles();

  const loginUser = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(
      {
        username: e.target.username.value,
      },

      e.target.password.value,
      (error) => {
        console.log(error);
      }
    );
  };
  const registerUser = (e) => {
    e.preventDefault();
    // In server>main.js, Accounts.onCreateUser is called & user is assigned a role.
    Accounts.createUser(
      {
        username: username.value,
        password: password.value,
      },
      (error) => {
        console.log(error);
      }
    );
  };
  return (
      <Grid       
        container
        justifyContent="center"
        alignItems="center"
      >
    {Meteor.user()?._id ? <div>You are already logged in.</div>
      :
     <FormControl className={classes.margin}>
      <form onSubmit={loginUser}>
        <TextField
          id="username"
          label="Username or Email"
          ref={(input) => (username = input)} 
        />
        <br/>
        <TextField
          id="password"
          label="Password"
          type="password"
          ref={(input) => (password = input)} 
        />
        <br/>
        <Button variant="outlined" color="primary"  type="submit" >Login</Button>
        <br/>
        <Button variant="outlined" color="secondary" onClick={registerUser}>Register New</Button>
      </form>
      </FormControl>
}    
      </Grid>
  );
};
