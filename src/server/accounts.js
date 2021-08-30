import { Roles } from "meteor/alanning:roles";

Roles.createRole("user", {unlessExists: true});
Roles.createRole("admin", {unlessExists: true});

WebApp.connectHandlers.use("/api/accounts", async (req, res, next) => {
    Accounts.createUser(
        {
        username: req.username.value,
        password: req.password.value,
        },
        (error) => {
        console.log(error);
        }
    )
})