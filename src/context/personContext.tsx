import http from "../http-common";
import sleep from "../utils/sleep";
import Person from "../types/Person.type";
import { SetStateAction, Dispatch } from "react";
import useReactModal from "../hooks/useReactModal";
import randomNumberInterval from "../utils/randomNumberInterval";
import { useContext, createContext, useState, useEffect } from "react";
import { useLocalStorage, useSessionStorage } from "../hooks/useStorage";
import { Button, Dropdown, DropdownButton, Placeholder } from "react-bootstrap";

const PersonsContext = createContext<Person[] | null>(null);
const PersonContext = createContext<Person | null>(null);
const PersonUpdateContext = createContext<Dispatch<SetStateAction<Person | null>>>(null as any);

export const usePersons = () => useContext(PersonsContext);
export const usePerson = () => useContext(PersonContext);
export const usePersonUpdate = () => useContext(PersonUpdateContext);

export function PersonsProvider(a: { children: any }) {
  const [persons, setPersons] = useSessionStorage<Person[] | null>("persons", null);
  const [person, setPerson] = useLocalStorage<Person | null>("person", null);

  useEffect(() => {
    (async () => {
      let persons: null | Person[] = null;
      while (persons === null)
        try {
          persons = (await http.get<{ message: Person[] }>("/persons")).data.message;
        } catch (e) {
          console.error(e);
          await sleep(1000);
        }

      setPersons(persons);
    })();
  }, [setPersons]);

  const [selectedPerson, setSelectedPerson] = useState<number>(0);

  const { Modal, setShow } = useReactModal(
    "¿Quién eres?",

    persons !== null ? (
      <DropdownButton title={persons[selectedPerson].name}>
        {persons.map(({ id, name }, i) => (
          <Dropdown.Item onClick={() => setSelectedPerson(i)} key={id}>
            {name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    ) : (
      <Placeholder.Button xs={randomNumberInterval(3, 5)} />
    ),

    <Button
      variant="success"
      disabled={persons === null}
      // eslint-disable-next-line no-sequences
      onClick={() => (setPerson(persons![selectedPerson]), setShow(false))}
    >
      Seleccionar
    </Button>,

    { showDefaultValue: !person, verticallyCentered: true, backdrop: "static" }
  );

  return (
    <PersonsContext.Provider value={persons}>
      <PersonContext.Provider value={person}>
        <PersonUpdateContext.Provider value={setPerson}>
          {/**/}
          {Modal}
          {a.children}
        </PersonUpdateContext.Provider>
      </PersonContext.Provider>
    </PersonsContext.Provider>
  );
}
