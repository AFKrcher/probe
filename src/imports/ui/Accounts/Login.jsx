import React from "react";

export const Login = () => {
  const loginUser = (e) => {
    e.preventDefault();
    console.log("login: ", username.value, password.value);
    Meteor.loginWithPassword(
      {
        username: username.value,
      },

      password.value,
      (error) => {
        console.log(error);
      }
    );
  };
  return (
    <>
      <form onSubmit={loginUser}>
        <input type="text" ref={(input) => (username = input)} />
        <input type="password" ref={(input) => (password = input)} />
        <button type="submit">Login</button>
      </form>
    </>
  );
};
