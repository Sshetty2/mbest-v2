import { ChromeStorageService } from './api/auth/storage';

const storage = new ChromeStorageService();

// Handle OAuth flow
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'INITIATE_AUTH') {
    handleAuth().then(sendResponse)
      .catch(error => {
        console.error('Auth error:', error);
        sendResponse({ error: error.message });
      });

    return true; // Required for async response
  }
});

// eslint-disable-next-line max-statements
async function handleAuth () {
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
