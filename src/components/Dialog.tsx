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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: 200,
          m        : 1
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            color     : 'text.primary',
            textShadow: theme => `${theme.palette.primary.light}40 1px 0 10px`,
            fontSize  : '1.1rem'
          }}
        >
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
                  flexDirection : 'column',
                  alignItems    : 'flex-start',
                  gap           : 1,
                  py            : 1.5,
                  borderBottom  : '1px solid',
                  borderColor   : 'divider',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <Box sx={{
                  width     : '100%',
                  display   : 'flex',
                  alignItems: 'center',
                  gap       : 1
                }}>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    sx={{ flex: 1 }}
                  >
                    {event.venue.name}
                  </Typography>
                  <Checkbox
                    checked={event.selected === undefined ? true : event.selected}
                    onChange={() => handleCheckboxChange(event.id)}
                    id={event.id}
                    size="small"
                  />
                </Box>
                <Typography
                  component="a"
                  href={event.eventUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="body2"
                  sx={{
                    color         : 'primary.main',
                    textDecoration: 'none',
                    '&:hover'     : { textDecoration: 'underline' }
                  }}
                >
                  {event.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {formatDate(event.dateTime)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{
        px: 2,
        py: 1.5
      }}>
        <Button
          onClick={handleClose}
          color="primary"
          size="small"
        >
          {events.length > 0 ? 'Cancel' : 'Close'}
        </Button>
        {events.length > 0 && (
          <Button
            onClick={onConfirm}
            color="primary"
            variant="contained"
            size="small"
          >
            Schedule
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
