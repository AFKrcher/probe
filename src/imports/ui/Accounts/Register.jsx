import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { useTracker } from "meteor/react-meteor-data";

export const Register = () => {
  const registerUser = (e) => {
    e.preventDefault();
    console.log("register: ", username.value, password.value);
    fetch('http://localhost:3000/api/accounts', {
      method: 'POST',
      body: [username.value, password.value]
    })
    // Accounts.createUser(
    //   {
    //     username: username.value,
    //     password: password.value,
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
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
