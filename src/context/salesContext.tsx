import Sale from "../types/sale.type";
import { useContext, createContext, useState, Dispatch, SetStateAction } from "react";

const SalesStateContext = createContext<[Sale[], Dispatch<SetStateAction<Sale[]>>]>([] as any);
const FromStateContext = createContext<[Date, Dispatch<SetStateAction<Date>>]>([] as any);

export const useSalesState = () => useContext(SalesStateContext);
export const useFromState = () => useContext(FromStateContext);

export function SalesProvider(a: { children: any }) {
  const salesState = useState<Sale[]>([]);
  const fromState = useState(new Date(new Date().setHours(0, 0, 0, 0)));

  return (
    <SalesStateContext.Provider value={salesState}>
      <FromStateContext.Provider value={fromState}>
        {/**/}
        {a.children}
      </FromStateContext.Provider>
    </SalesStateContext.Provider>
  );
}
