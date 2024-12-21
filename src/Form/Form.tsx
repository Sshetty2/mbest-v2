import { Box, Button, TextField } from '@mui/material';
import AutosuggestField from './AutoSuggest';

interface FormProps {
	date: string;

	// onFormSubmit: () => void;
	disabled: boolean;
}

export default function Form ({
  date,

  //   onFormSubmit,
  disabled
}: FormProps) {
  return (
    <Box sx={{
      display      : 'flex',
      flexDirection: 'column',
      gap          : 2
    }}>
      <AutosuggestField
      />

      <TextField
        id="date-range"
        name="date-range"
        label="Date Range"
        fullWidth
        value={date}
        InputProps={{ readOnly: true }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={disabled}

        // onClick={onFormSubmit}
        id="mbest-form-button"
        sx={{ mt: 1 }}
      >
				Schedule
      </Button>
    </Box>
  );
}
