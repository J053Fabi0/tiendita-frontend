import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Redirects the user if the condition is not met.
 * @param condition If this condition is true, it will be redirected to path.
 * @param path Defaults to "/"
 */
export default function useRedirectIfTrue(condition: boolean, path = "/") {
  const navigate = useNavigate();

  useEffect(() => {
    if (condition) navigate(path);
  }, [path, condition, navigate]);
}
