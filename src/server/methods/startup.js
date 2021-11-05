const fs = Npm.require("fs");

let count = 0;

export const startup = (
  Meteor,
  Roles,
  allowedRoles,
  Accounts,
  SatelliteCollection,
  SchemaCollection,
  ErrorsCollection,
  UsersCollection,
  ADMIN_PASSWORD,
  ROOT_URL,
  PORT,
  PM2,
  reseed = false
) => {
  if (reseed && count === 0) {
    // For a one time server start-up re-seed
    SatelliteCollection.remove({});
    SchemaCollection.remove({});
    UsersCollection.remove({});
    Meteor.users.remove({});
    ErrorsCollection.remove({});
    count++;
  }

  // Role creation
  allowedRoles.forEach((role) => Roles.createRole(role, { unlessExists: true }));

  // Accounts config
  Accounts.config({
    sendVerificationEmail: true
  });

  // Email verification and password reset emails
  Accounts.urls.resetPassword = (token) => {
    return ROOT_URL.includes("localhost") && PM2 ? `${ROOT_URL}:${PORT}/reset?token=${token}` : Meteor.absoluteUrl(`/reset?token=${token}`);
  };
  Accounts.urls.verifyEmail = (token) => {
    return ROOT_URL.includes("localhost") && PM2 ? `${ROOT_URL}:${PORT}/verify?token=${token}` : Meteor.absoluteUrl(`/verify?token=${token}`);
  };

  // Email template settings
  Accounts.emailTemplates.from = "PROBE <no-reply@probe.saberastro.com>";
  Accounts.emailTemplates.resetPassword = {
    subject() {
      return "PROBE Password Reset";
    },
    text(user, url) {
      return `${user.username},
        \nPlease visit this page to reset your password: ${url}
        \nIf you did not request this, someone may be attempting to gain unauthorized access your account. Please click the "Contact Us" button on PROBE to notify us if this email was sent to you without your permission.
        \nThank you,\nThe PROBE Team`;
    }
  };
  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return "PROBE Email Verification";
    },
    text(user, url) {
      return `${user.username},
        \nPlease visit this page to verify your email: ${url}
        \nUpon successful email verification, you will be able to access all of PROBE's features!
        \nIf you did not request this, someone may be attempting to gain unauthorized access to your account. Please click the "Contact Us" button on PROBE to notify us if this email was sent to you without your permission.
        \nThank you,\nThe PROBE Team`;
    }
  };

  // User creation after-actions
  Accounts.onCreateUser((_, user) => {
    user["favorites"] = [];
    UsersCollection.insert({
      _id: user._id,
      createdAt: user.createdAt,
      username: user.username,
      emails: user.emails,
      favorites: user.favorites
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
    console.log("=> SchemaCollection Seeded");
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
    console.log("=> SatelliteCollection Seeded");
  }

  // Seed admin account for testing
  if (UsersCollection.find().count() < 1) {
    const name = "admin";
    const email = "no-reply@saberastro.com";
    Meteor.call("userExists", name, (err, res) => {
      if (err || res) {
        if (err && err.message !== "Username already exists.") console.log(`> ${err.message}`);
        return;
      } else if (UsersCollection.find().count() < 1) {
        Accounts.createUser({
          email: email,
          username: name,
          password: ADMIN_PASSWORD // only for dev testing - password changed on deployment
        });
        console.log("=> Development Account Seeded");
        Roles.addUsersToRoles(Accounts.findUserByUsername(name), "admin");
        const id = Accounts.findUserByUsername(name)._id;
        Meteor.users.update(id, { $set: { emails: [{ address: email, verified: true }] } }, { multi: true });
        console.log("=> Development Account Verified");
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
            createdAt: 1
          }
        }
      )
      .fetch();
    users.forEach((user) => UsersCollection.insert(user));
    console.log("=> UsersCollection Seeded");
  }

  // Seed sample error
  if (ErrorsCollection.find().count() < 1) {
    ErrorsCollection.remove({});
    const errors = {
      user: "Not Logged-In",
      time: new Date().toISOString(),
      msg: "Database Reset",
      source: "Test Error",
      error: {}
    };
    ErrorsCollection.insert(errors);
    console.log("=> ErrorsCollection Seeded");
  }
};
