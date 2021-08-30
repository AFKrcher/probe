import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";
Accounts.onCreateUser((options, user) =>{
  console.log("user2: ", user)
  console.log('options2:', options)
})
