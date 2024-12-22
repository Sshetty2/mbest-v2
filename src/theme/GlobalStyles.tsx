import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

export const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      '@font-face': {
        fontFamily: 'Rock Salt',
        fontStyle : 'normal',
        fontWeight: 400,
        src       : `url(${chrome.runtime.getURL('src/assets/fonts/RockSalt-Regular.ttf')}) format('truetype')`
      }
    }}
  />
);
