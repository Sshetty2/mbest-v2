import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main : '#3700B3',
      light: '#6200EE',
      dark : '#23036A'
    },
    secondary: {
      main : '#03DAC6',
      light: '#66fff9',
      dark : '#00a896'
    },
    background: {
      default: '#FFFFFF',
      paper  : '#F5F5F5'
    },
    text: {
      primary  : '#1C1B1F',
      secondary: '#49454F'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5        : {
      fontWeight   : 500,
      letterSpacing: 0.5
    },
    subtitle1: { fontWeight: 500 },
    button   : {
      textTransform: 'none',
      fontWeight   : 500
    }
  },
  shape     : { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' }
        }
      }
    },
    MuiDialog   : { styleOverrides: { paper: { boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)' } } },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiCheckbox : { defaultProps: { color: 'primary' } }
  }
});
