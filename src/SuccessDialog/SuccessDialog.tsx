import { forwardRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

interface SuccessDialogProps {
  open: boolean;
  dialogClose: () => void;
}

const Transition = forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide
    direction="up"
    ref={ref}
    {...props} />;
});

export default function SuccessDialogComponent ({ open, dialogClose }: SuccessDialogProps) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={dialogClose}
      aria-labelledby="success-dialog-title"
      aria-describedby="success-dialog-description"
    >
      <DialogContent>
        <DialogContentText
          id="success-dialog-description"
          sx={{
            color     : 'text.primary',
            textShadow: '#0072ff99 1px 0 17px'
          }}
        >
          <p>
            The Items were successfully posted to your Google Calendar and
            we&apos;ve attempted to RSVP for your events with a high chance of
            success!
          </p>
          <p>Thank you for using Meetup-Batch Event Set Tool!</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={dialogClose}
          color="primary">
          Thanks
        </Button>
      </DialogActions>
    </Dialog>
  );
}
