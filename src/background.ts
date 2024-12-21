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
    // Get auth URL from Lambda
    const _url = `${import.meta.env.VITE_LAMBDA_API_URL}/meetup-auth`;
    const response = await fetch(_url);
    const data = await response.json();

    const parsedBody = JSON.parse(data.body);

    const authUrl = parsedBody.authUrl;

    if (!authUrl) {
      throw new Error('No auth URL received');
    }

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

    // Exchange code for tokens
    const tokenResponse = await fetch(`${import.meta.env.VITE_LAMBDA_API_URL}/meetup-access`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ code })
    });

    const tokens = await tokenResponse.json();
    const parsedTokens = JSON.parse(tokens.body);

    await storage.storeTokens(parsedTokens);

    return { success: true };
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
}
