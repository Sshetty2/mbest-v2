import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { endOfDay, formatISO, startOfDay } from 'date-fns';

interface DateState {
  startDate: string | null; // ISO string
  endDate: string | null; // ISO string
}

const today = new Date();

const formattedStartDate = formatISO(startOfDay(today));
const formattedEndDate = formatISO(endOfDay(today));

const initialState: DateState = {
  startDate: formattedStartDate,
  endDate  : formattedEndDate
};

export const dateSlice = createSlice({
  name    : 'date',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    clearDateRange: state => {
      state.startDate = null;
      state.endDate = null;
    }
  }
});

export const { setDateRange, clearDateRange } = dateSlice.actions;

export default dateSlice.reducer;
