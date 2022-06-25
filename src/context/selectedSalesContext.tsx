import useArray from "../hooks/useArray";
import { useContext, createContext } from "react";

type a = [number[], { remove: (index: number) => void; push: (...elements: number[]) => void; clear: () => void }];

const SalesSelectedContext = createContext<a>([[], {} as any]);

export const useSalesSelected = () => useContext(SalesSelectedContext);

export function SelectedSalesProvider(a: { children: any }) {
  const selectedSalesCombo = useArray<number>();

  return (
    <SalesSelectedContext.Provider value={selectedSalesCombo as unknown as a}>
      {/**/}
      {a.children}
    </SalesSelectedContext.Provider>
  );
}
