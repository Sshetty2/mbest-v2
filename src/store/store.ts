import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './groupSlice';
import dateReducer from './dateSlice';
import eventReducer from './eventSlice';

export const store = configureStore({
  reducer: {
    group : groupReducer,
    date  : dateReducer,
    events: eventReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
