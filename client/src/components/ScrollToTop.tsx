import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.includes("/profile/edit")) window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
