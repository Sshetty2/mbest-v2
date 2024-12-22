import { ChromeStorageService } from './storage';

export class AuthService {
  private storage: ChromeStorageService;

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

    // Check if token is expired or will expire in the next minute
    if (Date.now() >= tokens.expires_at - 60000) {
      try {
        const newTokens = await this.storage.refreshTokens(tokens.refresh_token);

        return newTokens.access_token;
      } catch (error) {
        console.error('Failed to refresh token:', error);

        return null;
      }
    }

    return tokens.access_token;
  }

  async isAuthenticated (): Promise<boolean> {
    const token = await this.getValidToken();

    return token !== null;
  }

  // eslint-disable-next-line class-methods-use-this
  async logout (): Promise<void> {
    await chrome.storage.local.remove('meetup_tokens');
  }
}
