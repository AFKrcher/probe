import { createTheme } from "@material-ui/core/styles";
import { grey, blue, green, red } from "@material-ui/core/colors";

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
      main: red[600]
    },
    grid: {
      text: "white",
      background: "#424242",
    },
    button: {
      shadow: grey[900]
    },
    navigation: {
      main: grey[800],
      hover: grey[700],
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
    grid: {
      text: "black",
      background: grey[100],
    },
    button: {
      shadow: "none"
    },
    navigation: {
      main: grey[200],
      hover: grey[300],
    },
  },
});

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
