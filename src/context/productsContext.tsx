import http from "../http-common";
import sleep from "../utils/sleep";
import Product from "../types/product.type";
import { useAuthTokenReady } from "./personContext";
import { useContext, createContext, useState, useEffect, useCallback } from "react";

const c = new Intl.Collator();
const ProductsContext = createContext<Product[] | null>(null);
const RemoveProductLocallyContext = createContext<(id: number) => void>((_: number) => undefined);
const ReloadProductContext = createContext<(id: number) => Promise<boolean>>(() => Promise.resolve(false));
const ReloadProductsContext = createContext<() => Promise<void>>(undefined as unknown as () => Promise<void>);

export const useProducts = () => useContext(ProductsContext);
export const useReloadProduct = () => useContext(ReloadProductContext);
export const useReloadProducts = () => useContext(ReloadProductsContext);
export const useRemoveProductLocally = () => useContext(RemoveProductLocallyContext);

export function ProductsProvider(a: { children: any }) {
  const authTokenReady = useAuthTokenReady();
  const [products, setProducts] = useState<null | Product[]>(null);

  const reloadProducts = useCallback(async () => {
    if (!authTokenReady) return setProducts(null);

    let products: null | Product[] = null;
    while (products === null)
      try {
        products = (await http.get<{ message: Product[] }>("/products")).data.message;
      } catch (e) {
        console.error(e);
        await sleep(1000);
      }

    setProducts(products.sort(({ name: s1 }, { name: s2 }) => c.compare(s1, s2)));
  }, [authTokenReady]);

  useEffect(() => void reloadProducts(), [reloadProducts]);

  const reloadProduct = useCallback(
    async (id: number) => {
      if (!authTokenReady) {
        setProducts(null);
        return false;
      }
      if (!products) return false;

      let product: null | Product = null;
      while (product === null)
        try {
          product = (await http.get<{ message: Product }>("/product", { params: { id: id } })).data.message;
        } catch (e) {
          console.error(e);
          await sleep(1000);
        }

      setProducts((oldProducts) => {
        const copy = oldProducts ? [...oldProducts] : [];
        const productIndex = products.findIndex(({ id: otherId }) => otherId === id);

        if (productIndex === -1) {
          copy.unshift(product as Product);
          return copy;
        } else {
          copy[productIndex] = product as Product;
          return copy;
        }
      });
      return true;
    },
    [authTokenReady, products]
  );

  const removeProductLocally = useCallback(
    (id: number) => {
      if (!products) return;
      const productIndex = products.findIndex(({ id: otherId }) => otherId === id);
      if (productIndex === -1) return;
      setProducts((oldProducts) => [
        ...(oldProducts as Product[]).slice(0, productIndex),
        ...(oldProducts as Product[]).slice(productIndex + 1),
      ]);
    },
    [products]
  );

  return (
    <ProductsContext.Provider value={products}>
      <ReloadProductContext.Provider value={reloadProduct}>
        <ReloadProductsContext.Provider value={reloadProducts}>
          <RemoveProductLocallyContext.Provider value={removeProductLocally}>
            {/* */}
            {a.children}
          </RemoveProductLocallyContext.Provider>
        </ReloadProductsContext.Provider>
      </ReloadProductContext.Provider>
    </ProductsContext.Provider>
  );
}
