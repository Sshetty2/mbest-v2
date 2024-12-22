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
        Successfully scheduled {confirmations.length} events!
      </Typography>
    </DialogTitle>
    <DialogContent sx={{
      px: 2,
      py: 0
    }}>
      <DialogContentText component="div">
        <List sx={{ p: 0 }}>
          {confirmations.map((confirmation, index) => (
            <ListItem
              key={index}
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
                display   : 'flex',
                width     : '100%',
                alignItems: 'center',
                gap       : 1
              }}>
                <Typography
                  variant="subtitle2"
                  component="a"
                  href={confirmation.htmlLink}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color         : 'primary.main',
                    textDecoration: 'none',
                    flex          : 1,
                    '&:hover'     : { textDecoration: 'underline' }
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
                variant="caption"
                color="text.secondary"
              >
                {new Date(confirmation.start.dateTime).toLocaleString()}
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
        onClick={dialogClose}
        color="primary"
        size="small"
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
