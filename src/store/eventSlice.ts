import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { MeetupApi } from '../api/MeetupApi';
import { RootState } from './store';

interface Event {
  id: string;
  title: string;
  eventUrl: string;
  dateTime: string;
  duration: number;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  selected?: boolean;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events : [],
  loading: false,
  error  : null
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { selectedGroup } = state.group;
      const { startDate, endDate } = state.date;

      if (!selectedGroup || !startDate || !endDate) {
        throw new Error('Missing required data: group or date range not selected');
      }

      const meetupApi = new MeetupApi();
      const events = await meetupApi.fetchGroupEvents(selectedGroup.urlname);

      // Filter events by date range on the client side
      return events.filter((event: Event) => {
        const eventDate = new Date(event.dateTime);

        return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
      });
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const toggleEventSelection = createAction<string>('events/toggleSelection');

export const eventSlice = createSlice({
  name    : 'events',
  initialState,
  reducers: {
    clearEvents: state => {
      state.events = [];
      state.error = null;
    },
    toggleEventSelection: (state, action) => {
      const event = state.events.find(e => e.id === action.payload);

      if (event) {
        event.selected = !event.selected;
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearEvents } = eventSlice.actions;

export default eventSlice.reducer;
