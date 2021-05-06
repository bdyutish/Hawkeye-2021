import { useState } from "react";

export const useConfirm = () => {
  const [options, setOptions] = useState({
    subText: "",
    yesHandler: () => {},
    noHandler: () => {},
    open: false,
  });

  const confirmed = (cb: any, subText = "") => {
    return () => {
      setOptions({
        open: true,
        subText,
        yesHandler: async () => {
          setOptions((prev) => ({ ...prev, open: false }));
          await cb();
        },
        noHandler: () => {
          setOptions((prev) => ({ ...prev, open: false }));
        },
      });
    };
  };

  return { confirmed, options };
};
