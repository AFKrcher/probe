const fs = Npm.require("fs");

let count = 0;

export const reseed = (
  Meteor,
  Roles,
  allowedRoles,
  Accounts,
  SatelliteCollection,
  SchemaCollection,
  ErrorsCollection,
  UsersCollection,
  ADMIN_PASSWORD,
  reseed = false
) => {
  if (reseed && count === 0) {
    SatelliteCollection.remove({});
    SchemaCollection.remove({});
    UsersCollection.remove({});
    Meteor.users.remove({});
    ErrorsCollection.remove({});
    count++;
  }

  // Role creation
  allowedRoles.forEach((role) =>
    Roles.createRole(role, { unlessExists: true })
  );

  // Email verification and password reset emails
  Accounts.config({
    sendVerificationEmail: false,
  });
  Accounts.urls.resetPassword = (token) => {
    return Meteor.absoluteUrl(`/reset?token=${token}`);
  };
  Accounts.urls.verifyEmail = (token) => {
    return Meteor.absoluteUrl(`/verify?token=${token}`);
  };

  Accounts.emailTemplates.from = "PROBE <no-reply@probe.saberastro.com>";

  Accounts.emailTemplates.resetPassword = {
    subject() {
      return "PROBE Password Reset";
    },
    text(user, url) {
      return `${user.username}, please visit this page to reset your password: ${url}
        \n If you did not request this, someone may be attempting unauthorized access your account.`;
    },
  };

  // User creation after-actions
  Accounts.onCreateUser((_, user) => {
    user["favorites"] = [];
    UsersCollection.insert({
      _id: user._id,
      createdAt: user.createdAt,
      username: user.username,
      emails: user.emails,
      favorites: user.favorites,
    });
    return user;
  });

  // Seed schema data
  if (SchemaCollection.find().count() < 26) {
    SchemaCollection.remove({});
    let jsonObj = [];
    let files = fs.readdirSync("./assets/app/schema");
    files.forEach(function (file) {
      let data = fs.readFileSync("./assets/app/schema/" + file, "ascii");
      jsonObj.push(JSON.parse(data));
      14;
    });
    jsonObj.forEach(function (data) {
      SchemaCollection.insert(data);
    });
    console.log("> SchemaCollection Seeded");
  }

  // Seed satellite data
  if (SatelliteCollection.find().count() < 14) {
    SatelliteCollection.remove({});
    let jsonObj = [];
    let files = fs.readdirSync("./assets/app/satellite");
    files.forEach(function (file) {
      let data = fs.readFileSync("./assets/app/satellite/" + file, "ascii");
      jsonObj.push(JSON.parse(data));
    });
    jsonObj.forEach(function (data) {
      SatelliteCollection.insert(data);
    });
    console.log("> SatelliteCollection Seeded");
  }

  // Seed admin account for testing
  if (UsersCollection.find().count() < 1) {
    Meteor.call("userExists", "admin", (err, res) => {
      if (err || res) {
        if (err && err.message !== "Username already exists.")
          console.log(`> ${err.message}`);
        return;
      } else if (UsersCollection.find().count() < 1) {
        Accounts.createUser({
          email: "admin@saberastro.com",
          username: "admin",
          password: ADMIN_PASSWORD, // only for local dev testing - password changed on deployment
        });
        Roles.addUsersToRoles(Accounts.findUserByUsername("admin"), "admin");
        console.log("> Development Account Seeded");
      }
    });
  }

  // Seed user data
  if (UsersCollection.find().count() < 1) {
    UsersCollection.remove({});
    const users = Meteor.users
      .find(
        {},
        {
          fields: {
            _id: 1,
            username: 1,
            emails: 1,
            favorites: 1,
            createdAt: 1,
          },
        }
      )
      .fetch();
    users.forEach((user) => UsersCollection.insert(user));
    console.log("> UsersCollection Seeded");
  }

  // Seed sample error
  if (ErrorsCollection.find().count() < 1) {
    ErrorsCollection.remove({});
    console.log("> ErrorsCollection Seeded");
    const errors = {
      user: "Not Logged-In",
      time: new Date().toISOString(),
      msg: "Database Reset",
      source: "Test Error",
      error: {},
    };
    ErrorsCollection.insert(errors);
  }
};
