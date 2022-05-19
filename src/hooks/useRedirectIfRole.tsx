import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePerson } from "../context/personContext";

/**
 * Redirects the user if it's not a certain role.
 * @param role If the user has this role, it will be redirected. Defaults to "employee"
 * @param path Defaults to "/"
 * @returns True when the identity has been confirmed.
 */
export default function useRedirectIfRole(role: "employee" | "admin" = "employee", path = "/") {
  const person = usePerson();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!person) return;

    if (person.role === role) navigate(path);
    else setConfirmed(true);
  }, [person, navigate, role, path]);

  return confirmed;
}
