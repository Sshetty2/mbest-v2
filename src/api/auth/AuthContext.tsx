import React, { createContext, useState, useEffect } from 'react';
import { AuthService } from './AuthService';
import { AuthState } from './types';

const AuthContext = createContext<{
  authState: AuthState;
  login:() => Promise<void>;
  logout: () => Promise<void>;
    // eslint-disable-next-line no-extra-parens
    }>({
      authState: {
        isAuthenticated : false,
        isAuthenticating: true,
        error           : null
      },
      login : () => Promise.resolve(),
      logout: () => Promise.resolve()
    });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated : false,
    isAuthenticating: true,
    error           : null
  });

  const authService = new AuthService();

  useEffect(() => {
    login();
  }, []);

  const login = async () => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticating: true,
      error           : null
    }));

    try {
      await authService.initiateAuth();
      setAuthState({
        isAuthenticated : true,
        isAuthenticating: false,
        error           : null
      });
    } catch (error) {
      setAuthState({
        isAuthenticated : false,
        isAuthenticating: false,
        error           : 'Authentication failed.'
      });
    }
  };

  const logout = async () => {
    await authService.storage.clearTokens();
    setAuthState({
      isAuthenticated : false,
      isAuthenticating: false,
      error           : null
    });
  };

  return (
    <AuthContext.Provider value={{
      authState,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
