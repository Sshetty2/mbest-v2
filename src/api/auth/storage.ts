import { EncryptionService } from './encryption';
import { AuthTokens } from './types';

interface TokenStorage {
  storeTokens(tokens: AuthTokens): Promise<void>;
  getTokens(): Promise<AuthTokens | null>;
  clearTokens(): Promise<void>;
}

export class ChromeStorageService implements TokenStorage {
  private encryption: EncryptionService;

  constructor () {
    this.encryption = new EncryptionService();
  }

  async storeTokens (tokens: AuthTokens): Promise<void> {
    console.log('STORE TOKENS-non-encrypted', tokens);

    const encrypted = await this.encryption.encrypt(JSON.stringify(tokens));
    console.log('STORE TOKENS-encrypted', encrypted);
    await chrome.storage.local.set({
      meetup_tokens    : encrypted,
      tokens_updated_at: Date.now()
    });
  }

  async getTokens (): Promise<AuthTokens | null> {
    const data = await chrome.storage.local.get(['meetup_tokens']);

    console.log('MEETUP_TOKENS', data);

    if (!data.meetup_tokens) {
      return null;
    }

    const decrypted = await this.encryption.decrypt(data.meetup_tokens);

    return JSON.parse(decrypted);
  }

  // eslint-disable-next-line class-methods-use-this
  async clearTokens (): Promise<void> {
    await chrome.storage.local.remove(['meetup_tokens', 'tokens_updated_at']);
  }
}
