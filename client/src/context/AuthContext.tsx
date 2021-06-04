import React, {
  ReactElement,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react';
import { Nullable, User, Children } from '../utils/types';

import { get, post, put } from '../utils/requests';
import { useHistory, useLocation } from 'react-router-dom';

import { useToasts } from 'react-toast-notifications';

type Value = {
  user: Nullable<User>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  isAdmin: () => boolean;
  loading: Boolean;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  updateUser: (userData: User) => void;
  check: () => Promise<void>;
  updateScore: (score: number) => void;
  inNest: () => any;
};

const AuthContext = createContext<Nullable<Value>>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: Children): ReactElement {
  const [user, setUser] = useState<Nullable<User> | any>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  const location = useLocation();
  const history = useHistory();

  const { addToast } = useToasts();

  const fetchMe = async () => {
    try {
      await get('/me').then(setUser);
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchMe();
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    // setLoading(true);

    try {
      await post('/login', {
        email,
        password,
      });

      await fetchMe();

      history.push('/');
    } catch (err) {
      throw err;
    }
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    password: string
  ) => {
    try {
      await post('/register', {
        name,
        username,
        email,
        password,
      });

      history.push('/login');
      addToast('Verification Mail Sent', { appearance: 'info' });
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setLoading(false);
      await post('/logout');
    } catch (err) {
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await post('/forgotpassword', { email });
      addToast('Mail Sent!', { appearance: 'success' });
    } catch (err) {
      addToast('Something Went Wrong', { appearance: 'error' });
    }
  };

  const resetPassword = async (password: string, token: string) => {
    try {
      await put(`/resetpassword/${token}`, { password });
      history.push('/login');
      addToast('Password Changed!', { appearance: 'success' });
    } catch (err) {
      addToast('Something Went Wrong', { appearance: 'error' });
    }
  };

  const isAdmin = () => user?.role === 1;

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const check = async () => {
    try {
      const res = await get('/me');
      if (!res) {
        logout();
        addToast('Session Timed Out', { appearance: 'error' });
        return;
      }
      // else if (res.isBanned){

      // }
      setUser(res);
      history.push('/');
      addToast('Something Went Wrong', { appearance: 'error' });
    } catch (err) {
      logout();
      addToast('Session Timed Out', { appearance: 'error' });
    }
  };

  const updateScore = (score: number) => {
    setUser((prev: User) => ({ ...prev, score }));
  };

  const inNest = () => user.hawksNest;

  const value = {
    user,
    login,
    logout,
    register,
    isAdmin,
    forgotPassword,
    loading,
    resetPassword,
    fetchMe,
    updateUser,
    check,
    updateScore,
    inNest,
  };

  // {children}
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
