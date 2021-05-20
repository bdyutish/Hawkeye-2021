import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { get } from "../utils/requests";

export default (url: string, lazy = false) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const auth = useAuth();

  const fetch = () => {
    setIsLoading(true);
    get(url)
      .then((data: any) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        auth?.check();
      });
  };

  useEffect(() => {
    if (!lazy) {
      fetch();
    }
  }, []);

  return { isLoading, error, setData, data, fetch };
};
