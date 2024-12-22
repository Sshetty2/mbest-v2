import { useCallback, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Container, Button, TextField, Dialog } from '@mui/material';
import { CalendarComponent } from './components/Calendar';
import { AutosuggestField } from './components/AutoSuggest';
import { LoadingDialogComponent } from './components/LoadingDialog';
import { fetchEvents } from './store/eventSlice';
import { AppDispatch, RootState, store } from './store/store';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedGroup } = useSelector((state: RootState) => state.group);
  const { startDate, endDate } = useSelector((state: RootState) => state.date);
  const { loading, error } = useSelector((state: RootState) => state.events);
  const { events } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleScheduleClick = useCallback(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <Container
      maxWidth="sm"
      sx={{ width: '300px' }}>
      <Box sx={{
        display      : 'flex',
        flexDirection: 'column',
        gap          : 3,
        py           : 1
      }}>
        <Typography
          variant="h5"
          className="rock-salt"
          sx={{
            fontFamily: '\'Rock Salt\' !important',
            color     : '#3700B3',
            textAlign : 'center',
            textShadow: '#0072ff8c 1px 0 24px'
          }}>
          {'Meetup Batch Event Set Tool'}
        </Typography>

        <Box sx={{
          display      : 'flex',
          flexDirection: 'column',
          gap          : 2
        }}>
          <AutosuggestField
            size="small"
          />
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
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading || !selectedGroup || !startDate || !endDate}
            onClick={handleScheduleClick}
            sx={{ mt: 1 }}
          >
            {loading ? 'Loading...' : 'Schedule'}
          </Button>
        </Box>
        <Box sx={{ mb: 2 }}>
          <CalendarComponent />
        </Box>
        {/* Dialogs */}
        <LoadingDialogComponent open={loading} />
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
  );
};

export default function AppWithProvider () {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
