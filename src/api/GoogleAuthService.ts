export class GoogleAuthService {
  private readonly SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

  authorize (): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({
        interactive: true,
        scopes     : this.SCOPES
      }, token => {
        if (chrome.runtime.lastError || !token) {
          reject(chrome.runtime.lastError);

          return;
        }
        resolve(token);
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  revokeToken (token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.identity.removeCachedAuthToken({ token }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);

          return;
        }
        resolve();
      });
    });
  }
}
