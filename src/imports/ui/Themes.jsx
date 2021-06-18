import { createMuiTheme } from '@material-ui/core/styles';

export const darkTheme = createMuiTheme({
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