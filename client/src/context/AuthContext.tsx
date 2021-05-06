import {
  ReactElement,
  useContext,
  createContext,
  useState,
  useEffect,
} from "react";
import { Nullable, User, Children } from "../utils/types";

import { get, post } from "../utils/requests";

import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

type Value = {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  loading: Boolean;
  fetchMe: () => Promise<any>;
  check: () => Promise<any>;
};

const AuthContext = createContext<Nullable<Value>>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: Children): ReactElement {
  const [user, setUser] = useState<Nullable<User>>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  const history = useHistory();

  const { addToast } = useToasts();

  const fetchMe = async () => {
    try {
      await get("/me").then(setUser);
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
      await post("/login", {
        email,
        password,
      });

      await fetchMe();
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
      await post("/register", {
        name,
        username,
        email,
        password,
      });

      history.push("/login");
      addToast("Verification Mail Sent", { appearance: "info" });
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setLoading(false);
      await post("/logout");
    } catch (err) {
      throw err;
    }
  };

  const check = async () => {
    try {
      const res = await get("/me");
      if (!res) {
        logout();
        addToast("Session Timed Out", { appearance: "error" });
        return;
      }
      setUser(res);
      history.push("/");
      addToast("Something Went Wrong", { appearance: "error" });
    } catch (err) {
      logout();
      addToast("Session Timed Out", { appearance: "error" });
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    fetchMe,
    check,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
