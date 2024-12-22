import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MeetupApi } from '../api/MeetupApi';
import { RootState } from './store';

interface Event {
  id: string;
  title: string;
  eventUrl: string;
  dateTime: string;
  endTime: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  selected?: boolean;
}

export interface CalendarConfirmation {
  status: string;
  summary: string;
  description: string;
  htmlLink: string;
  start: {
    dateTime: string;
  };
}

interface EventState {
  events: Event[];
  confirmations: CalendarConfirmation[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events       : [],
  confirmations: [],
  loading      : false,
  error        : null
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

export const scheduleEvents = createAsyncThunk(
  'events/scheduleEvents',
  (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const selectedEvents = state.events.events.filter(event => event.selected !== false);

      if (selectedEvents.length === 0) {
        throw new Error('No events selected');
      }

      return new Promise<CalendarConfirmation[]>((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            type  : 'SCHEDULE_EVENTS',
            events: selectedEvents
          },
          response => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);

              return;
            }

            if (!response.success) {
              reject(new Error(response.error));

              return;
            }

            resolve(response.result);
          }
        );
      });
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const eventSlice = createSlice({
  name    : 'events',
  initialState,
  reducers: {
    clearEvents: state => {
      state.events = [];
      state.error = null;
    },
    clearConfirmations: state => {
      state.confirmations = [];
    },
    toggleEventSelection: (state, action) => {
      const event = state.events.find(e => e.id === action.payload);

      if (event) {
        event.selected = event.selected === undefined ? false : !event.selected;
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
      })
      .addCase(scheduleEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.confirmations = action.payload;
        state.events = [];
      });
  }
});

export const { clearEvents, clearConfirmations, toggleEventSelection } = eventSlice.actions;

export default eventSlice.reducer;
