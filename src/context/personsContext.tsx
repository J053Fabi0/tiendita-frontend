import http from "../http-common";
import Person from "../types/Person.type";
import useMayLoad from "../hooks/useMayLoad";
import { useIsAdmin } from "./personContext";
import useLoadData from "../hooks/useLoadData";
import { useContext, createContext, useState } from "react";

const LoadingPersonsContext = createContext(true);
const PersonsContext = createContext<Person[]>([]);
const FirstPersonsLoadContext = createContext<() => void>(() => undefined);

export const usePersons = () => useContext(PersonsContext);
export const useLoadingPersons = () => useContext(LoadingPersonsContext);
export const useFirstPersonsLoad = () => useContext(FirstPersonsLoadContext);

export function PersonsProvider(a: { children: any }) {
  const isAdmin = useIsAdmin();
  const [mayLoad, firstSalesLoad] = useMayLoad();
  const [persons, setPersons] = useState<Person[]>([]);
  const [loadingPersons, setLoadingPersons] = useState(true);

  useLoadData([isAdmin, mayLoad], setPersons, () => http.get<{ message: Person[] }>("/persons"), {
    conditionToStart: isAdmin && mayLoad,
    loadingCB: (loading) => setLoadingPersons(loading),
  });

  return (
    <PersonsContext.Provider value={persons}>
      <LoadingPersonsContext.Provider value={loadingPersons}>
        <FirstPersonsLoadContext.Provider value={firstSalesLoad}>
          {/**/}
          {a.children}
        </FirstPersonsLoadContext.Provider>
      </LoadingPersonsContext.Provider>
    </PersonsContext.Provider>
  );
}
