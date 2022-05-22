import http from "../http-common";
import Person from "../types/Person.type";
import useMayLoad from "../hooks/useMayLoad";
import { useIsAdmin } from "./personContext";
import useLoadData from "../hooks/useLoadData";
import { useContext, createContext, useState, Dispatch, SetStateAction } from "react";

const LoadingPersonsContext = createContext(true);
const PersonsContext = createContext<Person[]>([] as any);
const FirstPersonsLoadContext = createContext<() => void>(() => void 1);

export const usePersons = () => useContext(PersonsContext);
export const useLoadingPersons = () => useContext(LoadingPersonsContext);
export const useFirstPersonsLoad = () => useContext(FirstPersonsLoadContext);

export function PersonsProvider(a: { children: any }) {
  const isAdmin = useIsAdmin();
  const [persons, setPersons] = useState<Person[]>([]);
  const [mayLoad, startLoadingPersons] = useMayLoad();
  const [loadingPersons, setLoadingPersons] = useState(persons.length === 0);

  useLoadData([isAdmin, mayLoad], setPersons, () => http.get<{ message: Person[] }>("/persons"), {
    conditionToStart: isAdmin && mayLoad,
    loadingCB: (loading) => setLoadingPersons(loading),
  });

  return (
    <PersonsContext.Provider value={persons}>
      <LoadingPersonsContext.Provider value={loadingPersons}>
        <FirstPersonsLoadContext.Provider value={startLoadingPersons}>
          {/**/}
          {a.children}
        </FirstPersonsLoadContext.Provider>
      </LoadingPersonsContext.Provider>
    </PersonsContext.Provider>
  );
}
