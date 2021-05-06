import { useRef, useEffect } from "react";

export default function useDocumentTitle(title: string) {
  const defaultTitle = useRef<string>(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      document.title = defaultTitle.current;
    };
  }, []);
}
