export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }

export interface AuthState {
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    error: string | null;
  }
