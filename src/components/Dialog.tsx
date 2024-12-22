import { useCallback, forwardRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography,
  List,
  ListItem,
  Checkbox,
  Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleEventSelection, clearEvents } from '../store/eventSlice';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showNoResults?: boolean;
}

const Transition = forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide
    direction="down"
    ref={ref}
    {...props} />;
});

export const DialogComponent = ({
  open,
  onClose,
  onConfirm,
  showNoResults = false
}: DialogProps) => {
  const dispatch = useDispatch();
  const { events } = useSelector((state: RootState) => state.events);
  const { selectedGroup } = useSelector((state: RootState) => state.group);

  const formatDate = useCallback((dateTimeStr: string) => new Date(dateTimeStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year   : 'numeric',
    month  : 'long',
    day    : 'numeric'
  }), []);

  const handleCheckboxChange = (eventId: string) => {
    dispatch(toggleEventSelection(eventId));
  };

  const handleClose = () => {
    dispatch(clearEvents());
    onClose();
  };

  // Only show dialog if there are events OR showNoResults is true
  if (!events.length && !showNoResults) {
    return null;
  }

  // Modify greeting to handle both cases
  // eslint-disable-next-line max-len
  const greeting = events.length > 0 ? `Here's what I found for ${selectedGroup?.name}!` : `No events found for ${selectedGroup?.name} in the selected date range`;

  // Only show followUp if we have events
  const followUp = events.length > 0 ? 'Would you like to schedule these events?' : null;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{
        py: 2.5,
        px: 3
      }}>
        <Typography
          variant="h5"
          sx={{ fontSize: '1.2rem' }}
          className="habibi">
          {greeting}
          {followUp && (
            <>
              <br />
              {followUp}
            </>
          )}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{
        px: 2,
        py: 0
      }}>
        <DialogContentText component="div">
          <List sx={{ p: 0 }}>
            {events.map(event => (
              <ListItem
                key={event.id}
                sx={{
                  flexDirection: 'column',
                  alignItems   : 'flex-start',
                  pb           : 2.25,
                  px           : 0
                }}
              >
                <Box sx={{
                  width         : '100%',
                  display       : 'flex',
                  justifyContent: 'space-between',
                  alignItems    : 'center'
                }}>
                  <Typography color="text.primary">
                    {event.venue.name}
                  </Typography>
                  <Checkbox
                    checked={event.selected ?? true}
                    onChange={() => handleCheckboxChange(event.id)}
                    id={event.id}
                  />
                </Box>
                <Typography
                  component="a"
                  href={event.eventUrl}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color         : 'text.primary',
                    textDecoration: 'underline'
                  }}
                >
                  {event.title}
                </Typography>

                <Typography color="text.primary">
                  {formatDate(event.dateTime)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary">
          {events.length > 0 ? 'Cancel' : 'Close'}
        </Button>
        {events.length > 0 && (
          <Button
            onClick={onConfirm}
            color="primary">
            Schedule
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
