import http from "../http-common";
import sleep from "../utils/sleep";
import Product from "../types/product.type";
import { useAuthToken } from "./personContext";
import { useContext, createContext, useState, useEffect, useCallback } from "react";

const ProductsContext = createContext<Product[] | null>(null);
const ReloadProductsContext = createContext<() => Promise<void>>(undefined as unknown as () => Promise<void>);

export const useProducts = () => useContext(ProductsContext);
export const useReloadProducts = () => useContext(ReloadProductsContext);

export function ProductsProvider(a: { children: any }) {
  const authToken = useAuthToken();
  const [products, setProducts] = useState<null | Product[]>(null);

  const reloadProducts = useCallback(async () => {
    if (authToken === "") return;
    let products: null | Product[] = null;
    while (products === null)
      try {
        products = (await http.get<{ message: Product[] }>("/products")).data.message;
      } catch (e) {
        console.error(e);
        await sleep(1000);
      }

    setProducts(products);
  }, [authToken]);
  useEffect(() => void reloadProducts(), [reloadProducts]);

  return (
    <ProductsContext.Provider value={products}>
      <ReloadProductsContext.Provider value={reloadProducts}>
        {/* */}
        {a.children}
      </ReloadProductsContext.Provider>
    </ProductsContext.Provider>
  );
}
