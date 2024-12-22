import { ChromeStorageService } from './api/auth/storage';
import { GoogleAuthService } from './api/GoogleAuthService';
import { GoogleCalendarService } from './api/GoogleCalendarService';

const storage = new ChromeStorageService();

// Handle both OAuth flows
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'INITIATE_AUTH') {
    handleMeetupAuth().then(sendResponse)
      .catch(error => {
        console.error('Meetup Auth error:', error);
        sendResponse({ error: error.message });
      });

    return true; // Required for async response
  }

  if (message.type === 'SCHEDULE_EVENTS') {
    handleGoogleCalendarEvents(message.events)
      .then(result => sendResponse({
        success: true,
        result
      }))
      .catch(error => sendResponse({
        success: false,
        error  : error.message
      }));

    return true; // Required for async response
  }
});

// Meetup OAuth flow
// eslint-disable-next-line max-statements
async function handleMeetupAuth () {
  try {
    // Construct auth URL directly
    const authParams = new URLSearchParams({
      client_id    : import.meta.env.VITE_MEETUP_CLIENT_ID,
      response_type: 'code',
      redirect_uri : import.meta.env.VITE_REDIRECT_URI,
      scope        : 'basic group_read event_read'
    });

    const authUrl = `https://secure.meetup.com/oauth2/authorize?${authParams}`;

    // Launch OAuth flow
    const authResult = await chrome.identity.launchWebAuthFlow({
      url        : authUrl,
      interactive: true
    });

    if (!authResult) {
      throw new Error('No auth result received');
    }

    // Extract code from redirect URL
    const url = new URL(authResult);
    const code = url.searchParams.get('code');

    if (!code) {
      throw new Error('No authorization code received');
    }

    // Exchange code for tokens directly with Meetup
    const tokenResponse = await fetch('https://secure.meetup.com/oauth2/access', {
      method : 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body   : new URLSearchParams({
        client_id    : import.meta.env.VITE_MEETUP_CLIENT_ID,
        client_secret: import.meta.env.VITE_MEETUP_CLIENT_SECRET,
        grant_type   : 'authorization_code',
        redirect_uri : import.meta.env.VITE_REDIRECT_URI,
        code
      })
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Failed to exchange code for tokens: ${error}`);
    }

    const tokens = await tokenResponse.json();

    // Add expiration time to tokens
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    const tokenData = {
      ...tokens,
      expires_at: expiresAt
    };

    await storage.storeTokens(tokenData);

    return { success: true };
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
}

// Google Calendar event scheduling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleGoogleCalendarEvents (events: any[]) {
  const authService = new GoogleAuthService();
  const calendarService = new GoogleCalendarService();

  try {
    const token = await authService.authorize();

    const results = await Promise.all(
      events.map(event => {
        const formattedEvent = calendarService.formatMeetupEvent(event);

        return calendarService.createEvent(token, formattedEvent);
      })
    );

    return results;
  } catch (error) {
    console.error('Failed to schedule events:', error);
    throw error;
  }
}
