import { useEffect, useState } from "react";
import { get } from "../utils/requests";

export default (url: string, lazy = false) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const fetch = () => {
    setIsLoading(true);
    get(url)
      .then((data: any) => {
        setData(data);
        setIsLoading(false);
      })
      .catch(setError);
  };

  useEffect(() => {
    if (!lazy) {
      fetch();
    }
  }, []);

  return { isLoading, error, data, fetch };
};
