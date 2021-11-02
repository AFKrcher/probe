import * as Yup from "yup";

const isValidEmail = (oldEmail, newEmail) => {
  const oldCheck = oldEmail ? oldEmail !== newEmail : true;
  const schema = Yup.string().email();
  return schema.isValidSync(newEmail) && oldCheck && newEmail.length < 128;
};

const isValidUsername = (oldUsername, newUsername) => {
  const oldCheck = oldUsername ? oldUsername !== newUsername : true;
  const regex = /^[a-zA-Z0-9]{4,}$/g;
  return regex.test(newUsername) && oldCheck && newUsername.length < 32;
};

export const accountMethods = (
  Meteor,
  Accounts,
  Roles,
  allowedRoles,
  UsersCollection,
  PROBE_API_KEY
) => {
  // Account creation and managment methods
  return Meteor.methods({
    userExists: (username) => {
      if (Accounts.findUserByUsername(username)) {
        return "Username already exists.";
      }
    },
    emailExists: (email) => {
      if (Accounts.findUserByEmail(email)) {
        return `That email is already in use`;
      } else {
        return;
      }
    },
    addUserToRole: (user, role, key = false) => {
      // key is only for PROBE owner API manipulation
      if (
        (Roles.userIsInRole(Meteor.userId(), "admin") &&
          allowedRoles.includes(role)) ||
        (key === PROBE_API_KEY && allowedRoles.includes(role))
      ) {
        Roles.addUsersToRoles(
          Accounts.findUserByUsername(user.username)._id,
          role
        );
        if (role === "dummies") {
          Meteor.users.update(
            user._id,
            { $set: { "services.resume.loginTokens": [] } },
            { multi: true }
          );
        }
        return `User ${user._id} added to role: ${role}`;
      } else {
        return "Unauthorized [401]";
      }
    },
    deleteAccount: (id) => {
      if (
        Meteor.userId() === id ||
        Roles.userIsInRole(Meteor.userId(), "admin")
      ) {
        Meteor.users.remove({ _id: id });
        UsersCollection.remove(id);
        return `User ${id} has successfully been deleted`;
      } else {
        return "Unauthorized [401]";
      }
    },
    updateUsername: (id, user, newUsername) => {
      if (Meteor.userId() === id) {
        if (isValidUsername(user, newUsername)) {
          Accounts.setUsername(id, newUsername);
          UsersCollection.update(
            { _id: id },
            { $set: { username: Meteor.user().username } }
          );
          return `Account changes successfully made`;
        } else {
          return `The provided username, ${newUsername}, is invalid`;
        }
      } else {
        return "Unauthorized [401]";
      }
    },
    updateEmail: (id, email, newEmail) => {
      if (Meteor.userId() === id) {
        if (isValidEmail(email, newEmail)) {
          Accounts.removeEmail(id, email);
          Accounts.addEmail(id, newEmail);
          Accounts.sendVerificationEmail(id, newEmail);
          UsersCollection.update(
            { _id: id },
            { $set: { emails: Meteor.user().emails } }
          );
          return `Account changes successfully made`;
        } else {
          return `The provided email, ${newEmail}, is invalid`;
        }
      } else {
        return "Unauthorized [401]";
      }
    },
    addToFavorites: (id, noradID) => {
      if (Meteor.userId()) {
        let favorites = Meteor.user().favorites;
        if (favorites.indexOf(noradID) === -1) {
          favorites.push(noradID);
        } else {
          favorites.splice(favorites.indexOf(noradID), 1);
        }
        Meteor.users.update(id, { $set: { favorites: favorites } });
        UsersCollection.update({ _id: id }, { $set: { favorites: favorites } });
        return Meteor.user().favorites;
      } else {
        return ["Unauthorized [401]"];
      }
    },
    removeRole: (user, role) => {
      if (Roles.userIsInRole(Meteor.userId(), "admin")) {
        try {
          Roles.removeUsersFromRoles(user._id, role);
          UsersCollection.update(
            { _id: user._id },
            {
              $set: {
                roles: Meteor.roleAssignment
                  .find({ _id: Meteor.userId() })
                  .fetch(),
              },
            }
          );
          return `User ${user._id} removed from role: ${role}`;
        } catch (err) {
          return err;
        }
      } else {
        return "Unauthorized [401]";
      }
    },
    checkIfBanned: (user) => {
      let userFinder =
        Accounts.findUserByUsername(user) || Accounts.findUserByEmail(user);
      return Roles.userIsInRole(userFinder?._id, "dummies");
    },
    sendEmail: (id, email) => {
      if (Meteor.userId() === id) {
        Accounts.sendVerificationEmail(id, email);
      } else {
        return "Unauthorized [401]";
      }
    },
    registerUser: (email, username, password) => {
      if (isValidEmail(null, email) && isValidUsername(null, username)) {
        try {
          Accounts.createUser({
            email: email,
            username: username,
            password: password,
          });
          return `Welcome to PROBE, ${username}! A verification email has been sent to ${email}.`;
        } catch (err) {
          return err.message;
        }
      } else {
        return "An error occured while creating your account. Please try again later!";
      }
    },
  });
};
