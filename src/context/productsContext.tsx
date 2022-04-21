import http from "../http-common";
import sleep from "../utils/sleep";
import Product from "../types/product.type";
import { useContext, createContext, useState, useEffect } from "react";

const ProductsContext = createContext<Product[] | null>(null);
const ReloadProductsContext = createContext<() => Promise<void>>(undefined as unknown as () => Promise<void>);

export const useProducts = () => useContext(ProductsContext);
export const useReloadProducts = () => useContext(ReloadProductsContext);

export function ProductsProvider(a: { children: any }) {
  const [products, setProducts] = useState<null | Product[]>(null);
  const reloadProducts = async () => {
    let products: null | Product[] = null;
    while (products === null)
      try {
        products = (await http.get<{ message: Product[] }>("/products")).data.message;
      } catch (e) {
        console.error(e);
        await sleep(1000);
      }

    setProducts(products);
  };
  useEffect(() => void reloadProducts(), []);

  return (
    <ProductsContext.Provider value={products}>
      <ReloadProductsContext.Provider value={reloadProducts}>
        {/* */}
        {a.children}
      </ReloadProductsContext.Provider>
    </ProductsContext.Provider>
  );
}
