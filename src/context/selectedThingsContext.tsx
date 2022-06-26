import { Dispatch, SetStateAction } from "react";
import useArray from "../hooks/useArray";
import { useContext, createContext } from "react";

type a = [
  number[],
  {
    pop: () => void;
    clear: () => void;
    shift: () => void;
    remove: (index: number) => void;
    push: (...elements: number[]) => void;
    set: Dispatch<SetStateAction<number[]>>;
    unshift: (...elements: number[]) => void;
    update: (index: number, newElement: number) => void;
    filter: (callback: (value: number, index: number, array: number[]) => value is number, thisArg?: any) => void;
  }
];

const SelectedSalesContext = createContext<a>([[], {} as any]);
const SelectedPersonsContext = createContext<a>([[], {} as any]);

export const useSelectedSales = () => useContext(SelectedSalesContext);
export const useSelectedPersons = () => useContext(SelectedPersonsContext);

export function SelectedThingsProvider(a: { children: any }) {
  const selectedSalesCombo = useArray<number>();
  const selectedPersonsCombo = useArray<number>();

  return (
    <SelectedSalesContext.Provider value={selectedSalesCombo as unknown as a}>
      <SelectedPersonsContext.Provider value={selectedPersonsCombo as unknown as a}>
        {/**/}
        {a.children}
      </SelectedPersonsContext.Provider>
    </SelectedSalesContext.Provider>
  );
}
