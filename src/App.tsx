import { useCallback, useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Container, Button, TextField, Dialog } from '@mui/material';
import { CalendarComponent } from './components/Calendar';
import { AutosuggestField } from './components/AutoSuggest';
import { LoadingDialogComponent } from './components/LoadingDialog';
import { fetchEvents, scheduleEvents, clearConfirmations } from './store/eventSlice';
import { AppDispatch, RootState, store } from './store/store';
import { DialogComponent } from './components/Dialog';
import { SuccessDialogComponent } from './components/SuccessDialog';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { injectFonts } from './theme/fonts';
import { GlobalStyles } from './theme/GlobalStyles';
import './App.css';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedGroup } = useSelector((state: RootState) => state.group);
  const { startDate, endDate } = useSelector((state: RootState) => state.date);
  const { loading, error } = useSelector((state: RootState) => state.events);
  const { events, confirmations } = useSelector((state: RootState) => state.events);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    injectFonts();
  }, []);

  const handleScheduleClick = useCallback(() => {
    setShowNoResults(true);
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleConfirmation = useCallback(() => {
    dispatch(scheduleEvents())
      .unwrap()
      .then(() => {
        setShowNoResults(false);
      })
      .catch(_error => {
        console.error('Failed to schedule events:', _error);
      });
  }, [dispatch]);

  const handleSuccessClose = useCallback(() => {
    dispatch(clearConfirmations());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Container
        maxWidth="sm"
        sx={{
          width    : '300px',
          minHeight: '580px',
          p        : 1,
          border   : '1px solid #cac2c2',
          boxShadow: '0px 10px 15px 2px rgba(0,0,0,0.5)'
        }}>
        <Box sx={{
          display      : 'flex',
          flexDirection: 'column',
          gap          : 2
        }}>
          <Typography
            variant="h5"
            sx={{
              color     : 'primary.main',
              textAlign : 'center',
              fontWeight: 'medium',
              fontFamily: '\'Rock Salt\' !important',
              textShadow: _theme => `${_theme.palette.primary.light}40 1px 0 24px`
            }}>
            Meetup Batch Event Set Tool
          </Typography>

          <Box sx={{
            display      : 'flex',
            flexDirection: 'column',
            gap          : 2
          }}>
            <AutosuggestField size="small" />
            <TextField
              id="date-range"
              name="date-range"
              label="Date Range"
              fullWidth
              size="small"
              value={`${startDate ? new Date(startDate).toLocaleDateString() : ''} - ${
                endDate ? new Date(endDate).toLocaleDateString() : ''
              }`}
              slotProps={{ input: { readOnly: true } }}
            />
            <Button
              fullWidth
              variant="contained"
              disabled={loading || !selectedGroup || !startDate || !endDate}
              onClick={handleScheduleClick}
              sx={{
                mt    : 1,
                height: 40
              }}
            >
              {loading ? 'Loading...' : 'Schedule'}
            </Button>
          </Box>

          <Box sx={{
            '& .react-calendar': {
              width       : '100%',
              border      : '1px solid',
              borderColor : 'divider',
              borderRadius: 1,
              p           : 1,
              '& button'  : {
                borderRadius: 0.5,
                '&:hover'   : {
                  bgcolor: 'primary.light',
                  color  : 'white'
                },
                '&:disabled': { bgcolor: 'action.disabledBackground' }
              },
              '& .react-calendar__tile--active': {
                bgcolor  : 'primary.main',
                color    : 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }
            }
          }}>
            <CalendarComponent />
          </Box>

          {/* Dialogs */}
          <LoadingDialogComponent open={loading} />
          <DialogComponent
            open={loading || showNoResults || events.length > 0}
            onClose={() => setShowNoResults(false)}
            onConfirm={handleConfirmation}
            showNoResults={showNoResults}
          />
          <SuccessDialogComponent
            open={confirmations.length > 0}
            dialogClose={handleSuccessClose}
            confirmations={confirmations}
          />
          {error && (
            <Dialog
              open={!!error}
              title="Error"
              content={error}
              onClose={() => { /* handle error dialog close */ }}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default function AppWithProvider () {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
