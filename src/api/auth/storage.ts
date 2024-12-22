export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
}

export class ChromeStorageService {
  private readonly TOKEN_KEY = 'meetup_tokens';

  async storeTokens (tokens: TokenData): Promise<void> {
    await chrome.storage.local.set({ [this.TOKEN_KEY]: tokens });
  }

  async getTokens (): Promise<TokenData | null> {
    const result = await chrome.storage.local.get(this.TOKEN_KEY);

    return result[this.TOKEN_KEY] || null;
  }

  async refreshTokens (refreshToken: string): Promise<TokenData> {
    const response = await fetch('https://secure.meetup.com/oauth2/access', {
      method : 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body   : new URLSearchParams({
        client_id    : import.meta.env.VITE_MEETUP_CLIENT_ID,
        client_secret: import.meta.env.VITE_MEETUP_CLIENT_SECRET,
        grant_type   : 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const tokens = await response.json();
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    const tokenData = {
      ...tokens,
      expires_at: expiresAt
    };

    await this.storeTokens(tokenData);

    return tokenData;
  }
}
