import React from "react";
import { Accounts } from "meteor/accounts-base";

export const Register = () => {
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
    <>
      <form onSubmit={registerUser}>
        <input type="text" ref={(input) => (username = input)} />
        <input type="password" ref={(input) => (password = input)} />
        <button type="submit">Sign up</button>
      </form>
    </>
  );
};
