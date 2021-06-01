import { useEffect } from 'react';

export default function useClickOut(
  ref: any,
  insidehandler: () => any,
  outsideHandler: () => any
) {
  useEffect(() => {
    function clickOutsiteHandler(e: any) {
      if (ref.current && !ref.current.contains(e.target)) {
        outsideHandler();
      } else {
        insidehandler();
      }
    }

    document.addEventListener('mousedown', clickOutsiteHandler);

    return () => {
      document.removeEventListener('mousedown', clickOutsiteHandler);
    };
  }, [ref]);
}
