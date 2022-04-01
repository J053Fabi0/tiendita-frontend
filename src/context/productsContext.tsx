import http from "../http-common";
import Product from "../types/product.type";
import { useContext, createContext, useState, useEffect } from "react";

const ProductsContext = createContext<Product[] | null>(null);

export const useProducts = () => useContext(ProductsContext);

export function ProductsProvider(a: { children: any }) {
  const [products, setProducts] = useState<null | Product[]>(null);

  useEffect(() => {
    (async () => {
      let products: null | Product[] = null;
      while (products === null)
        try {
          products = (await http.get<{ message: Product[] }>("/products")).data.message;
        } catch (e) {
          console.error(e);
        }

      setProducts(products);
    })();
  }, []);

  return (
    <ProductsContext.Provider value={products}>
      {/**/}
      {a.children}
    </ProductsContext.Provider>
  );
}
