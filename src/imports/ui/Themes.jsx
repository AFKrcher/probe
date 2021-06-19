import { createMuiTheme } from '@material-ui/core/styles';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#64B5F6',
    },
    navigation: {
      main: '#424242',
      hover: '#515151',
    }
  },
});

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    // primary: {
    //   main: '#64B5F6',
    // },
    navigation: {
      main: '#EEEEEE',
      hover: '#DDDDDD',
    }
  },
});

export const themes = {
  light: lightTheme,
  dark: darkTheme
}
