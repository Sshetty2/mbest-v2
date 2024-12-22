import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Provider } from 'react-redux';
import { Value } from 'react-calendar/src/shared/types.js';
import { CalendarComponent } from './components/Calendar';
import { SuccessDialogComponent } from './SuccessDialog';
import { DialogComponent } from './components/Dialog';
import { LoadingDialogComponent } from './components/LoadingDialog';
import { MeetupApi } from './api/MeetupApi';
import { AuthProvider } from './api/auth/AuthContext';
import { store } from './store/store';

import './App.css';
import 'react-calendar/dist/Calendar.css';
import { Form } from './components/Form';

interface MeetupEvent {
	venue: { [key: string]: { name: string } };
	group: { [key: string]: { name: string } };
	checked: boolean;
	id: number;
	time?: number;
}

interface AppState {
	meetupEventData: MeetupEvent[];
	date: Value;
	open: boolean;
	urlGroupName: string;
	successBox: boolean;
	disabled: boolean;
	isLoading: boolean;
}

const handleFetchEvents = async (urlname: string, startDate: Date, endDate: Date) => {
  try {
    const meetupApi = new MeetupApi();
    const allEvents = await meetupApi.fetchGroupEvents(urlname);
    const filteredEvents = meetupApi.filterEventsByDateRange(allEvents, startDate, endDate);

    // Do something with the filtered events
    console.log('Filtered events:', filteredEvents);
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }
};

export default function App () {
  const [state, setState] = useState<AppState>({
    meetupEventData: [],
    date           : [new Date(), new Date()],
    open           : false,
    urlGroupName   : '',
    successBox     : false,
    disabled       : false,
    isLoading      : false
  });

  useEffect(() => {
    // @ts-ignore
    if (!state.date?.[0] || !state.date?.[1]) {
      return;
    }

    // @ts-ignore
    handleFetchEvents('new-york-philosophy', state.date[0], state.date[1]);
  }, [state.date]);

  const formatReadableDate = useCallback((date: Value) => {
    if (!date || !Array.isArray(date)) {
      return '';
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year   : 'numeric',
      month  : 'long',
      day    : 'numeric'
    };

    if (Array.isArray(date)) {
      return `${date[0]?.toLocaleDateString('en-US', options)} - ${date[1]?.toLocaleDateString('en-US', options)}`;
    }

    return '';
  }, []);

  const handleConfirmation = useCallback(() => {
    const parsedDataObj = state.meetupEventData.filter(x => x.checked);
    chrome.runtime.sendMessage({
      type: 'googleAuthFlow',
      parsedDataObj
    });
    setState(prev => ({
      ...prev,
      open           : false,
      meetupEventData: [],
      disabled       : true
    }));
  }, [state.meetupEventData]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const item = localStorage.getItem('urlGroupName');

      if (item != undefined) {
        setState(prev => ({
          ...prev,
          textField   : item || '',
          urlGroupName: item || ''
        }));
      }

      return;
    }

    chrome.storage.local.get(['urlGroupName'], (result: { urlGroupName?: string }) => {
      setState(prev => ({
        ...prev,
        textField   : result.urlGroupName || '',
        urlGroupName: result.urlGroupName || ''
      }));
    });

    const handleMessage = (
      request: { type: string; urlGroupName?: string; meetupEventData?: MeetupEvent[]; error?: string },
      _: chrome.runtime.MessageSender,
      sendResponse: (response: string) => void
    ) => {
      switch (request.type) {
        case 'resetTextField':
        case 'urlGroupName':
          setState(prev => ({
            ...prev,
            urlGroupName: request.type === 'urlGroupName' ? request.urlGroupName || '' : ''
          }));
          break;

        case 'meetupEventData':
          if (request.meetupEventData) {
            setState(prev => ({
              ...prev,
              meetupEventData: request.meetupEventData?.map(event => ({
                ...event,
                checked: true
              })) || [],
              open     : true,
              disabled : false,
              isLoading: false
            }));
            sendResponse('meetupEventData received');
          }
          break;

        case 'success':
          setState(prev => ({
            ...prev,
            successBox: true,
            disabled  : false,
            isLoading : false
          }));
          sendResponse('success received');
          break;

        case 'error':
          // eslint-disable-next-line max-len, no-alert
          alert(typeof request.error === 'object' ? `Error: ${JSON.stringify(request.error)}` : `Error: ${request.error}`);
          setState(prev => ({
            ...prev,
            disabled : false,
            isLoading: false
          }));
          break;

        default:
          // eslint-disable-next-line no-console
          console.log('Unknown message type:', request.type);
          break;
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <Container
          maxWidth="sm"
          sx={{
            width : '300px',
            height: '600px'
          }}>
          <Box sx={{
            display      : 'flex',
            flexDirection: 'column',
            gap          : 3,
            py           : 3
          }}>
            <DialogComponent
              open={state.open}
              handleConfirmation={handleConfirmation}
              dialogClose={() => setState(prev => ({
                ...prev,
                open           : false,
                date           : new Date(),
                disabled       : false,
                meetupEventData: []
              }))}

              // @ts-ignore
              meetupEventData={state.meetupEventData}
              onCheck={e => {
                const id = e.target.id;
                setState(prev => ({
                  ...prev,
                  meetupEventData: prev.meetupEventData

                  // @ts-ignore
                    .map(event => (event.id === id ? {
                      ...event,
                      checked: !event.checked
                    } : event))
                    .sort((a, b) => (a.time || 0) - (b.time || 0))
                }));
              }}
            />
            <SuccessDialogComponent
              open={state.successBox}
              dialogClose={() => setState(prev => ({
                ...prev,
                successBox: false
              }))}
            />
            <LoadingDialogComponent open={state.isLoading} />
            <Typography
              variant="h5"
              className="rock-salt"
              sx={{
                fontFamily: '\'Rock Salt\' !important',
                color     : '#3700B3',
                textAlign : 'center',
                textShadow: '#0072ff8c 1px 0 24px'
              }}>
					Meetup Batch Event Set Tool
            </Typography>
            <Form
              date={formatReadableDate(state.date)}

              // onFormSubmit={handleFormSubmit}
              // textFieldValue={state.textField}
              disabled={state.disabled}
            />
            <CalendarComponent />
          </Box>
        </Container>
      </AuthProvider>
    </Provider>
  );
}
