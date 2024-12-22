import { useState, useCallback } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { MeetupApi } from '../api/MeetupApi';
import { useDispatch } from 'react-redux';
import { setSelectedGroup } from '../store/groupSlice';

interface Group {
  id: string;
  name: string;
  urlname: string;
}

interface AutosuggestProps {
  onGroupSelect?: (group: Group | null) => void;
  size?: 'small' | 'medium';
}

export const AutosuggestField = ({ onGroupSelect, size = 'small' }: AutosuggestProps) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const meetupApi = new MeetupApi();

  const fetchGroups = useCallback(
    debounce(async (searchText: string) => {
      if (!searchText) {
        setOptions([]);

        return;
      }

      try {
        setLoading(true);
        const groups = await meetupApi.fetchGroups(searchText);
        setOptions(groups);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option: Group) => option.name}
      inputValue={inputValue}
      onInputChange={(_, newValue) => {
        setInputValue(newValue);
        fetchGroups(newValue);
      }}
      onChange={(_, group) => {
        if (group) {
          dispatch(setSelectedGroup(group));
          onGroupSelect?.(group);
        }
      }}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label="Group Name"
          fullWidth
          size={size}
          placeholder="Type to search groups"
        />
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      filterOptions={x => x}
      noOptionsText={inputValue ? 'No groups found' : 'Type to search groups'}
    />
  );
};
