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

export const DialogComponent = ({ open, onClose, onConfirm }: DialogProps) => {
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

  // Only show dialog if there are events
  if (!events.length) {
    return null;
  }

  // eslint-disable-next-line max-len
  const greeting = events.length > 0 ? `Here's what I found for ${selectedGroup?.name}!` : 'No events found. Try searching a different group or date range';

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
        px: 2.75,
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
      <Box sx={{ px: 2.5 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize  : '13px',
            textShadow: '#ff8a00bd 1px 0 7px'
          }}
        >
          Warning: You must be signed into chrome or allow syncing on request
          for the authentication flow to work properly
        </Typography>
      </Box>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary">
          Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};
