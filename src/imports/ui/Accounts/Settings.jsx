import React from 'react'
import { useTracker } from "meteor/react-meteor-data";
import { Accounts } from "meteor/accounts-base";

// @material-ui
import { Grid, Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(4),
    width: "300px"
  },
  formContainer: {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  textField: {
    marginBottom: 10
  },
  button: {
    marginTop: 20
  }
}));

export const Settings = () =>{
    const classes = useStyles();
    const [id, user, email] = useTracker(() => {
        const id = Meteor.user()?._id
        const user = Meteor.user()?.username
        const email = Meteor.user()?.emails[Meteor.user().emails.length -1].address
        return [id, user, email];
      });

    const deleteAccount = () =>{
        Meteor.call("deleteAccount", id, (res,err) =>{
          console.log(res, err)
        })
    }

    const sendEmail = () =>{
      Meteor.call("sendEmail", id, email, (res, err) =>{
        console.log(res,err)
      })
    }

    const update = (e) =>{
        e.preventDefault()
        let newEmail = e.target.newEmail?.value
        let newUsername = e.target.newUsername?.value
        let oldPassword = e.target.oldPassword?.value
        let newPassword = e.target.newPassword?.value
        let confirm = e.target.confirm?.value

        if(newEmail !== email){
            Meteor.call("updateEmail", id, email, newEmail, (res, err) => {
              console.log(res, err)
            })
        }

        if(newUsername !== user){
          Meteor.call("updateUsername", id, newUsername, (res, err) =>{
            console.log(res, err)
          })
        }

        if(newPassword && oldPassword && newPassword !== oldPassword && confirm === newPassword){
          console.log(oldPassword, newPassword)
          Accounts.changePassword(oldPassword, newPassword, (res, err) =>{
            console.log(res, err)
          })
        }
    }
    return(
        <>
        <div>
            {user?
            <Grid container justifyContent="center" alignItems="center">
              <FormControl className={classes.margin}>
                <form onSubmit={update} className={classes.flexContainer}>
                  <TextField
                    id="newEmail"
                    label="Email"
                    type="email"
                    ref={(input) => (newEmail = input)}
                    fullWidth
                    className={classes.textField}
                    defaultValue={email}
                  />
                    <TextField
                    id="newUsername"
                    label="Username"
                    type="username"
                    ref={(input) => (newUsername = input)}
                    fullWidth
                    className={classes.textField}
                    defaultValue={user}
                  />
                  <TextField
                    id="oldPassword"
                    label="Current Password"
                    type="password"
                    ref={(input) => (oldPassword = input)}
                    fullWidth
                    className={classes.textField}
                  />
                <TextField
                    id="newPassword"
                    label="New Password"
                    type="password"
                    ref={(input) => (newPassword = input)}
                    fullWidth
                    className={classes.textField}
                  />
                  <TextField
                    id="confirm"
                    label="Confirm new password"
                    type="password"
                    fullWidth
                    className={classes.textField}
                  />
                  <Button
                    id="updateButton"
                    variant="outlined"
                    color="primary"
                    type="submit"
                    fullWidth
                    className={classes.button}
                  >
                      Update your account
                  </Button>
                  <Button
                    id="verifyButton"
                    variant="outlined"
                    onClick={sendEmail}
                    fullWidth
                    className={classes.button}
                  >
                      Verify your email
                  </Button>
                  <Button
                    id="deleteButton"
                    variant="outlined"
                    color="secondary"
                    onClick={deleteAccount}
                    fullWidth
                    className={classes.button}
                  >
                      Delete your account
                  </Button>
                </form>
              </FormControl>
          </Grid>   
            : ":)"}
        </div>
        </>
    )
}