import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from
  '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY =
  '@aryavrat_auth_session';

type AuthSession = {
  phoneNumber: string;
};

type AuthContextType = {
  isLoggedIn: boolean;

  isAuthLoading: boolean;

  phoneNumber: string | null;

  login: (
    phoneNumber: string,
  ) => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({
  children,
}: Props) => {
  const [
    isLoggedIn,
    setIsLoggedIn,
  ] = useState(false);

  const [
    isAuthLoading,
    setIsAuthLoading,
  ] = useState(true);

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState<string | null>(null);

  /*
   * Restore existing login session
   * when the application starts.
   */
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedSession =
          await AsyncStorage.getItem(
            AUTH_STORAGE_KEY,
          );

        if (!savedSession) {
          return;
        }

        const parsedSession:
          AuthSession =
          JSON.parse(savedSession);

        if (
          parsedSession &&
          typeof parsedSession.phoneNumber ===
            'string' &&
          parsedSession.phoneNumber.length > 0
        ) {
          setPhoneNumber(
            parsedSession.phoneNumber,
          );

          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error(
          'Failed to restore auth session:',
          error,
        );

        /*
         * If stored session data is
         * corrupted, remove it.
         */
        try {
          await AsyncStorage.removeItem(
            AUTH_STORAGE_KEY,
          );
        } catch {
          // Nothing else to do here.
        }

        setPhoneNumber(null);
        setIsLoggedIn(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadSession();
  }, []);

  /*
   * Save a successful login.
   */
  const login = async (
    mobileNumber: string,
  ) => {
    const session: AuthSession = {
      phoneNumber: mobileNumber,
    };

    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(session),
    );

    setPhoneNumber(mobileNumber);
    setIsLoggedIn(true);
  };

  /*
   * Remove the login session.
   *
   * This removes authentication only.
   * It does NOT delete orders.
   */
  const logout = async () => {
    await AsyncStorage.removeItem(
      AUTH_STORAGE_KEY,
    );

    setPhoneNumber(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAuthLoading,
        phoneNumber,
        login,
        logout,
      }}>

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
};