import { forwardRef } from 'react';
import {
  Dialog,
  CircularProgress,
  Box,
  Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

interface LoadingDialogProps {
  open: boolean;
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

export const LoadingDialogComponent = ({ open }: LoadingDialogProps) => (
  <Dialog
    open={open}
    keepMounted
    TransitionComponent={Transition}
    aria-labelledby="loading-dialog"
    PaperProps={{
      sx: {
        bgcolor  : 'transparent',
        boxShadow: 'none',
        overflow : 'hidden'
      }
    }}
  >
    <Box sx={{
      display       : 'flex',
      alignItems    : 'center',
      justifyContent: 'center',
      p             : 3
    }}>
      <CircularProgress
        size={80}
        thickness={3}
        sx={{ color: 'white' }}
      />
    </Box>
  </Dialog>
);
