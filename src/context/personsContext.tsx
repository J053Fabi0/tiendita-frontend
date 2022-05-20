import Person from "../types/Person.type";
import { useContext, createContext, useState, Dispatch, SetStateAction } from "react";

const PersonsStateContext = createContext<[Person[], Dispatch<SetStateAction<Person[]>>]>([] as any);

export const usePersonsState = () => useContext(PersonsStateContext);

export function PersonsProvider(a: { children: any }) {
  const personsState = useState<Person[]>([]);

  return (
    <PersonsStateContext.Provider value={personsState}>
      {/**/}
      {a.children}
    </PersonsStateContext.Provider>
  );
}
