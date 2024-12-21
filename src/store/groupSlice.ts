import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Group {
  id: string;
  name: string;
  urlname: string;
}

interface GroupState {
  selectedGroup: Group | null;
}

const initialState: GroupState = { selectedGroup: null };

const groupSlice = createSlice({
  name    : 'group',
  initialState,
  reducers: {
    setSelectedGroup: (state, action: PayloadAction<Group | null>) => {
      state.selectedGroup = action.payload;
    }
  }
});

export const { setSelectedGroup } = groupSlice.actions;

export default groupSlice.reducer;
