import { ChromeStorageService } from './storage';

export class AuthService {
  public storage: ChromeStorageService;

  constructor () {
    this.storage = new ChromeStorageService();
  }

  // eslint-disable-next-line class-methods-use-this
  initiateAuth (): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: 'INITIATE_AUTH' },
        response => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getValidToken (): Promise<string | null> {
    const tokens = await this.storage.getTokens();

    if (!tokens) {
      return null;
    }

    if (Date.now() >= tokens.expires_at) {
      return this.refreshToken(tokens.refresh_token);
    }

    return tokens.access_token;
  }

  private async refreshToken (refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch(`${process.env.VITE_LAMBDA_API_URL}/auth/refresh`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ refresh_token: refreshToken })
      });

      const newTokens = await response.json();
      const parsedBody = JSON.parse(newTokens.body);

      await this.storage.storeTokens(parsedBody);

      return newTokens.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);

      return null;
    }
  }
}
