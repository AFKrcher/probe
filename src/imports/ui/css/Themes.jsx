import { createTheme } from "@material-ui/core/styles";
import { grey, blue, red, indigo } from "@material-ui/core/colors";

const darkTheme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "12px"
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: grey[700],
          borderRadius: "5px"
        }
      }
    }
  },
  palette: {
    type: "dark",
    logo: {
      main: "ffc708"
    },
    primary: {
      main: blue[400]
    },
    secondary: {
      main: red[600]
    },
    tertiary: {
      main: "#ffc708",
      shadow: grey[900]
    },
    grid: {
      text: "white",
      background: "#424242"
    },
    button: {
      shadow: grey[900]
    },
    navigation: {
      main: grey[800]
    },
    popper: {
      background: grey[900],
      text: "white"
    }
  }
});

const lightTheme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "15px"
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: grey[400],
          borderRadius: "5px"
        }
      }
    }
  },
  palette: {
    type: "light",
    primary: {
      main: indigo[500]
    },
    tertiary: {
      main: indigo[500],
      shadow: grey[400]
    },
    grid: {
      text: "black",
      background: grey[200]
    },
    button: {
      shadow: grey[300]
    },
    navigation: {
      main: grey[300]
    },
    popper: {
      background: grey[600],
      text: "white"
    }
  }
});

export const themes = {
  light: lightTheme,
  dark: darkTheme
};
