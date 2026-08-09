import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@aryavrat_auth_session';

type AuthSession = {
  phoneNumber: string;
  userId: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  phoneNumber: string | null;
  userId: string | null;

  login: (
    phoneNumber: string,
    userId: string,
  ) => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({children}: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Restore existing login session when the application starts.
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (!savedSession) {
          return;
        }

        const parsedSession: AuthSession = JSON.parse(savedSession);

        if (
          parsedSession &&
          typeof parsedSession.phoneNumber === 'string' &&
          parsedSession.phoneNumber.length > 0 &&
          typeof parsedSession.userId === 'string'
        ) {
          setPhoneNumber(parsedSession.phoneNumber);
          setUserId(parsedSession.userId);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);

        try {
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        } catch {
          // ignore
        }

        setPhoneNumber(null);
        setUserId(null);
        setIsLoggedIn(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadSession();
  }, []);

  // Save a successful login.
  const login = async (
    mobileNumber: string,
    userIdValue: string,
  ) => {
    const session: AuthSession = {
      phoneNumber: mobileNumber,
      userId: userIdValue,
    };

    try {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(session),
      );
    } catch (error) {
      console.error('Failed to save auth session:', error);
      // proceed even if persistence fails
    }

    setPhoneNumber(mobileNumber);
    setUserId(userIdValue);
    setIsLoggedIn(true);
  };

  // Remove the login session.
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove auth session:', error);
    }

    setPhoneNumber(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAuthLoading,
        phoneNumber,
        userId,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};