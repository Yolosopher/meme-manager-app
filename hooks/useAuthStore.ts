import {
  deleteSecureStore,
  getSecureStore,
  setSecureStore,
} from 'lib/secureStore';
import { useState } from 'react';
import request from 'request';
import authStore from 'store/authStore';

const useAuthStore = () => {
  const { auth, setAuth } = authStore();
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const authenticate = async () => {
    if (!authLoading) {
      setAuthLoading(true);
    }
    try {
      const authFromStorage: AuthResult = await getSecureStore<AuthResult>(
        'auth',
      );
      if (authFromStorage) {
        // check token validity
        const data = await request<AuthResult>({
          url: '/auth/profile',
          token: authFromStorage!.accessToken,
        });
        if (data.success === false) {
          setAuth(null);
          await deleteSecureStore('auth');
        } else {
          const newAuth: AuthResult = {
            ...auth!,
            ...data.data,
          };
          setAuth(newAuth);
        }
      }
    } catch (error) {
      // do nothing
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await request<boolean>({
        url: '/auth/logout',
        method: 'GET',
        token: auth!.accessToken,
      });
    } catch (error) {
      // do nothing
    } finally {
      setAuth(null);
      await deleteSecureStore('auth');
    }
  };

  const login = async (authResult: AuthResult) => {
    setAuth(authResult);
    await setSecureStore('auth', authResult);
  };

  return {
    auth,
    setAuth,
    authLoading,
    authenticate,
    login,
    logout,
  };
};

export default useAuthStore;
