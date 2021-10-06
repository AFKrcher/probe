import { createTheme } from "@material-ui/core/styles";
import { grey, blue, green, red, blueGrey } from "@material-ui/core/colors";

const darkTheme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "12px",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: grey[700],
          borderRadius: "5px",
        },
      },
    },
  },
  palette: {
    type: "dark",
    primary: {
      main: blue[400],
    },
    secondary: {
      main: red[600],
    },
    tertiary: {
      main: blue[100],
      shadow: grey[900],
    },
    grid: {
      text: "white",
      background: "#424242",
    },
    button: {
      shadow: grey[900],
    },
    navigation: {
      main: grey[800],
      hover: grey[700],
    },
    popper: {
      background: grey[800],
      text: "white",
    },
  },
});

const lightTheme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "15px",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: grey[400],
          borderRadius: "5px",
        },
      },
    },
  },
  palette: {
    type: "light",
    primary: {
      main: green[500],
    },
    tertiary: {
      main: blueGrey[700],
      shadow: grey[400],
    },
    grid: {
      text: "black",
      background: grey[200],
    },
    button: {
      shadow: "none",
    },
    navigation: {
      main: grey[300],
      hover: grey[400],
    },
    popper: {
      background: grey[600],
      text: "white",
    },
  },
});

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
