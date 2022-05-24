import { useCallback } from "react";
import { NavigateOptions, To, useNavigate } from "react-router-dom";

export default function useGoBackOrNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (delta: number, to: To, options: Omit<NavigateOptions, "replace"> = {}) => {
      if (window.history.state && window.history.state.idx > 0) navigate(delta);
      else navigate(to, { replace: true, ...options });
    },
    [navigate]
  );
}
