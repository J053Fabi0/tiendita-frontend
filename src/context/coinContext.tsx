import { useContext, createContext, useState, useEffect } from "react";

const IsLoadingCoinListContext = createContext(true);

export const useIsLoadingCoinList = () => useContext(IsLoadingCoinListContext);

interface a {
  children: any;
}
export function CoinProvider(a: a) {
  const [isLoadingCoinList] = useState(true);

  return (
    <IsLoadingCoinListContext.Provider value={isLoadingCoinList}>
      {/**/}
      {a.children}
    </IsLoadingCoinListContext.Provider>
  );
}
