import React, { createContext, useState, useEffect } from 'react';
import { AuthService } from './AuthService';

interface AuthState {
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    error: string | null;
  }

const AuthContext = createContext<{
  authState: AuthState;
    // eslint-disable-next-line no-extra-parens
    }>({
      authState: {
        isAuthenticated : false,
        isAuthenticating: true,
        error           : null
      }
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

  return (
    <AuthContext.Provider value={{ authState }}>
      {children}
    </AuthContext.Provider>
  );
};
