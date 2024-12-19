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

interface MeetupEvent {
  id: string | number;
  venue?: { name: string };
  group: { name: string };
  name: string;
  link: string;
  time: number;
  checked: boolean;
}

interface DialogProps {
  open: boolean;
  handleConfirmation: () => void;
  dialogClose: () => void;
  meetupEventData: MeetupEvent[];
  onCheck: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

export default function DialogComponent ({
  open,
  handleConfirmation,
  dialogClose,
  meetupEventData,
  onCheck
}: DialogProps) {
  const formatDate = useCallback((utcMilliseconds: number) => {
    const date = new Date(0);
    date.setUTCMilliseconds(utcMilliseconds);

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year   : 'numeric',
      month  : 'long',
      day    : 'numeric'
    });
  }, []);

  // eslint-disable-next-line max-len
  const greeting = meetupEventData.length > 0 ? `Here's what I found for ${meetupEventData[0].group.name}!` : 'I couldn\'t find anything! Please try searching a different group name or select a different date range';

  const followUp = meetupEventData.length > 0 ? 'Are you sure you\'d like to schedule the following events?' : null;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={dialogClose}
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
            {meetupEventData.map(event => (
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
                    {event.venue?.name || event.group.name}
                  </Typography>
                  <Checkbox
                    checked={event.checked}
                    onChange={onCheck}
                    id={String(event.id)}
                  />
                </Box>
                <Typography
                  component="a"
                  href={event.link}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color         : 'text.primary',
                    textDecoration: 'underline'
                  }}
                >
                  {event.name}
                </Typography>
                <Typography color="text.primary">
                  {formatDate(event.time)}
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
          onClick={dialogClose}
          color="primary">
          No
        </Button>
        <Button
          onClick={handleConfirmation}
          color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
