import http from "../http-common";
import Sale from "../types/sale.type";
import { useIsAdmin } from "./personContext";
import useMayLoad from "../hooks/useMayLoad";
import useLoadData from "../hooks/useLoadData";
import { useSelectedPersons } from "./selectedThingsContext";
import { useContext, createContext, useState, useCallback } from "react";

const SalesReloaderContext = createContext(0);
const SalesContext = createContext<Sale[]>([]);
const LoadingSalesContext = createContext(true);
const FromContext = createContext<Date>(new Date());
const UntilContext = createContext<Date>(new Date());
const FirstSalesLoadContext = createContext<() => void>(() => undefined);
const FromUpdateContext = createContext<(from: Date) => void>(null as any);
const UntilUpdateContext = createContext<(until: Date) => void>(null as any);
const ReloadSalesContext = createContext<(now?: boolean) => void>(() => undefined);

export const useFrom = () => useContext(FromContext);
export const useUntil = () => useContext(UntilContext);
export const useSalesState = () => useContext(SalesContext);
export const useFromUpdate = () => useContext(FromUpdateContext);
export const useUntilUpdate = () => useContext(UntilUpdateContext);
export const useReloadSales = () => useContext(ReloadSalesContext);
export const useLoadingSales = () => useContext(LoadingSalesContext);
export const useSalesReloader = () => useContext(SalesReloaderContext);
export const useFirstSalesLoad = () => useContext(FirstSalesLoadContext);

const getFrom = (from?: number | Date) =>
  new Date((from === undefined ? new Date() : new Date(+from)).setHours(0, 0, 0, 0));
const getUntil = (until?: number | Date) =>
  new Date((until === undefined ? new Date() : new Date(+until)).setHours(23, 59, 59, 999));

export function SalesProvider(a: { children: any }) {
  const isAdmin = useIsAdmin();
  const [from, setFrom] = useState(getFrom());
  const [selectedPersons] = useSelectedPersons();
  const [sales, setSales] = useState<Sale[]>([]);
  const [until, setUntil] = useState(getUntil());
  const [loadingSales, setLoadingSales] = useState(true);
  const [reloaderState, setReloaderState] = useState(Date.now());
  const [mayLoad, firstSalesLoad, disallowLoading] = useMayLoad();

  const reloadSales = useCallback(
    (now = false) => {
      setSales([]);
      if (now) setReloaderState(Date.now());
      else disallowLoading();
    },
    [setSales, setReloaderState, disallowLoading]
  );

  useLoadData(
    [from, until, reloaderState, isAdmin, mayLoad, selectedPersons],
    setSales,
    () => {
      const params = { from: +from, until: +until } as any;
      if (selectedPersons.length >= 1) params.persons = selectedPersons;
      return http.get<{ message: Sale[] }>("/sales", { params });
    },
    {
      conditionToStart: isAdmin && mayLoad,
      loadingCB: (loading) => setLoadingSales(loading),
    }
  );

  function publicSetFrom(newFrom: Date | number) {
    newFrom = getFrom(newFrom);
    if (newFrom > until) setUntil(getUntil(newFrom));
    if (+newFrom !== +from) setFrom(newFrom);
  }
  function publicSetUntil(newUntil: Date | number) {
    newUntil = getUntil(newUntil);
    if (newUntil < from) setFrom(getFrom(newUntil));
    if (+newUntil !== +until) setUntil(newUntil);
  }

  return (
    <SalesContext.Provider value={sales}>
      <FromContext.Provider value={from}>
        <FromUpdateContext.Provider value={publicSetFrom}>
          <UntilContext.Provider value={until}>
            <UntilUpdateContext.Provider value={publicSetUntil}>
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
            </UntilUpdateContext.Provider>
          </UntilContext.Provider>
        </FromUpdateContext.Provider>
      </FromContext.Provider>
    </SalesContext.Provider>
  );
}
