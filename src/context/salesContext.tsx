import http from "../http-common";
import Sale from "../types/sale.type";
import { useIsAdmin } from "./personContext";
import useLoadData from "../hooks/useLoadData";
import { useContext, createContext, useState, Dispatch, SetStateAction, useCallback } from "react";
import useMayLoad from "../hooks/useMayLoad";

const SalesReloaderContext = createContext(0);
const SalesContext = createContext<Sale[]>([]);
const LoadingSalesContext = createContext(true);
const FromContext = createContext<Date>(new Date());
const ReloadSalesContext = createContext<() => void>(() => undefined);
const FirstSalesLoadContext = createContext<() => void>(() => undefined);
const FromUpdateContext = createContext<Dispatch<SetStateAction<Date>>>(null as any);

export const useFrom = () => useContext(FromContext);
export const useSalesState = () => useContext(SalesContext);
export const useFromUpdate = () => useContext(FromUpdateContext);
export const useReloadSales = () => useContext(ReloadSalesContext);
export const useLoadingSales = () => useContext(LoadingSalesContext);
export const useSalesReloader = () => useContext(SalesReloaderContext);
export const useFirstSalesLoad = () => useContext(FirstSalesLoadContext);

export function SalesProvider(a: { children: any }) {
  const isAdmin = useIsAdmin();
  const [mayLoad, firstSalesLoad] = useMayLoad();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [reloaderState, setReloaderState] = useState(Date.now());
  const [from, setFrom] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

  const reloadSales = useCallback(() => {
    setSales([]);
    setReloaderState(Date.now());
  }, [setSales, setReloaderState]);

  useLoadData(
    [from, reloaderState, isAdmin, mayLoad],
    setSales,
    () => http.get<{ message: Sale[] }>("/sales", { params: { from: +from } }),
    {
      conditionToStart: isAdmin && mayLoad,
      loadingCB: (loading) => setLoadingSales(loading),
    }
  );

  return (
    <SalesContext.Provider value={sales}>
      <FromContext.Provider value={from}>
        <FromUpdateContext.Provider value={setFrom}>
          <LoadingSalesContext.Provider value={loadingSales}>
            <ReloadSalesContext.Provider value={reloadSales}>
              <FirstSalesLoadContext.Provider value={firstSalesLoad}>
                <SalesReloaderContext.Provider value={reloaderState}>
                  {/**/}
                  {a.children}
                </SalesReloaderContext.Provider>
              </FirstSalesLoadContext.Provider>
            </ReloadSalesContext.Provider>
          </LoadingSalesContext.Provider>
        </FromUpdateContext.Provider>
      </FromContext.Provider>
    </SalesContext.Provider>
  );
}
