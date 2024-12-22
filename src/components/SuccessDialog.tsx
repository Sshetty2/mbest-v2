import { forwardRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  Typography,
  Slide,
  Box
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { CalendarConfirmation } from '../store/eventSlice';

interface SuccessDialogProps {
  open: boolean;
  dialogClose: () => void;
  confirmations: CalendarConfirmation[];
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

export const SuccessDialogComponent = ({
  open,
  dialogClose,
  confirmations
}: SuccessDialogProps) => (
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={dialogClose}
    aria-labelledby="success-dialog-title"
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle sx={{ pb: 1 }}>
      <Typography
        variant="h6"
        sx={{
          color     : 'text.primary',
          textShadow: '#0072ff99 1px 0 17px'
        }}
      >
        Successfully scheduled {confirmations.length} events!
      </Typography>
    </DialogTitle>
    <DialogContent>
      <DialogContentText component="div">
        <List sx={{ pt: 0 }}>
          {confirmations.map((confirmation, index) => (
            <ListItem
              key={index}
              sx={{
                flexDirection: 'column',
                alignItems   : 'flex-start',
                gap          : 0.5,
                py           : 1
              }}
            >
              <Box sx={{
                display   : 'flex',
                width     : '100%',
                alignItems: 'center',
                gap       : 1
              }}>
                <Typography
                  variant="subtitle1"
                  component="a"
                  href={confirmation.htmlLink}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color         : 'text.primary',
                    textDecoration: 'underline',
                    flex          : 1
                  }}
                >
                  {confirmation.summary}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color     : confirmation.status === 'confirmed' ? 'success.main' : 'warning.main',
                    fontWeight: 'medium'
                  }}
                >
                  {confirmation.status}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary">
                {new Date(confirmation.start.dateTime).toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={dialogClose}
        color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
