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
    password: string,
    collage: string,
    number: string
  ) => Promise<void>;
  isAdmin: () => boolean;
  loading: Boolean;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  updateUser: (userData: any) => void;
  check: () => Promise<void>;
  updateScore: (score: number) => void;
  setCurrentRegion: (name: string) => void;
  region: string;
};

const AuthContext = createContext<Nullable<Value>>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: Children): ReactElement {
  const [user, setUser] = useState<Nullable<User> | any>(null);
  const [loading, setLoading] = useState<Boolean>(true);
  const [region, setRegion] = useState('');

  const location = useLocation();
  const history = useHistory();

  const { addToast } = useToasts();

  const fetchMe = async () => {
    try {
      await get('/me').then(setUser);
    } catch (err) {
      logout(false);
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
        email: email.trim(),
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
    password: string,
    collage: string,
    number: string
  ) => {
    try {
      await post('/register', {
        name,
        username,
        email: email.trim().toLowerCase(),
        password,
        college: collage,
        phone: number,
      });

      history.push('/login');
      addToast('Verification Mail Sent', { appearance: 'info' });
    } catch (err) {
      throw err;
    }
  };

  const logout = async (back = true) => {
    try {
      setUser(null);
      setLoading(false);
      await post('/logout');
      back && history.push('/login');
    } catch (err) {
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await post('/forgotpassword', { email: email.trim().toLowerCase() });
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
        // logout();
        history.push('/');
        addToast('Something Went wrong', { appearance: 'error' });
        return;
      }
      // else if (res.isBanned){

      // }
      setUser(res);
      history.push('/');
      addToast('Something Went Wrong', { appearance: 'error' });
    } catch (err) {
      history.push('/');
      addToast('Something Went wrong', { appearance: 'error' });
    }
  };

  const updateScore = (score: number) => {
    setUser((prev: User) => ({ ...prev, score }));
  };

  const setCurrentRegion = (name: string) => {
    setRegion(name);
  };

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
    setCurrentRegion,
    region,
  };

  // {children}
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
