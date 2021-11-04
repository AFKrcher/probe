import * as Yup from "yup";

export const isValidEmail = (oldEmail, newEmail) => {
  const schema = Yup.string().email().max(128).notOneOf([oldEmail]).required();
  return schema.isValidSync(newEmail);
};

export const isValidUsername = (oldUsername, newUsername) => {
  const schema = Yup.string()
    .matches(/^[a-zA-Z0-9]{4,}$/g)
    .max(32)
    .notOneOf([oldUsername])
    .required();
  return schema.isValidSync(newUsername);
};

export const isValidPassword = (oldPassword, newPassword) => {
  const schema = Yup.string()
    .min(8)
    .max(128)
    .notOneOf([oldPassword])
    .required();
  return schema.isValidSync(newPassword);
};

export const isConfirmedPassword = (newPassword, confirm) => {
  return confirm && newPassword ? newPassword === confirm : true;
};
