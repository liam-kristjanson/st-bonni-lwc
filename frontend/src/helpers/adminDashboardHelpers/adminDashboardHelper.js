import { useState, useCallback } from "react";
// Custom hook for managing alerts
export const useAlert = () => {
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    const timer = setTimeout(
      () => setAlert({ show: false, message: "", variant: "" }),
      3000
    );
    return () => clearTimeout(timer);
  }, []);

  return { alert, showAlert };
};
