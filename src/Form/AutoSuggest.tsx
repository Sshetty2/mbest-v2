import { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface AutosuggestProps {
  getInputData: (value: string) => void;
  textFieldValue: string;
}

type GroupNameArray = Array<[string, string]>;

export default function AutosuggestField ({ getInputData, textFieldValue }: AutosuggestProps) {
  const [grpNameArray, setGrpNameArray] = useState<GroupNameArray>([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const item = localStorage.getItem('grpNameArray');

      if (item != undefined) {
        setGrpNameArray(JSON.parse(item));
      }

      return;
    }

    chrome.storage.local.get(['grpNameArray'], result => {
      if (result.grpNameArray) {
        setGrpNameArray(result.grpNameArray);
      }
    });
  }, []);

  return (
    <Autocomplete
      options={grpNameArray}
      getOptionLabel={(option: [string, string]) => option[1]}
      inputValue={textFieldValue}
      onInputChange={(_, newValue) => {
        getInputData(newValue);
      }}
      renderInput={params => (
        <TextField
          {...params}
          label="Group Name"
          fullWidth
          placeholder="Type A Group Name"
        />
      )}
      isOptionEqualToValue={(option, value) => option[0] === value[0]}
    />
  );
}
