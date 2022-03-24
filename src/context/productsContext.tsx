import http from "../http-common";
import Product from "../types/product.type";
import { useContext, createContext, useState, useEffect } from "react";

const ProductsContext = createContext<Product[] | null>(null);

export const useProducts = () => useContext(ProductsContext);

export function ProductsProvider(a: { children: any }) {
  const [products, setProducts] = useState<null | Product[]>(null);

  useEffect(() => void http.get<{ message: Product[] }>("/products").then((a) => setProducts(a.data.message)), []);

  return (
    <ProductsContext.Provider value={products}>
      {/**/}
      {a.children}
    </ProductsContext.Provider>
  );
}
