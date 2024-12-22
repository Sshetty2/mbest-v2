import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './groupSlice';
import dateReducer from './dateSlice';

export const store = configureStore({
  reducer: {
    group: groupReducer,
    date : dateReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
