import SortMethod from "./sortMethod.type";
import SortOption from "./sortOption.type";
import Sale from "../../../types/sale.type";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";

export default function useSalesSorted(
  sales: Sale[],
  setSalesSorted: Dispatch<SetStateAction<Sale[]>>,
  sortOption: SortOption
) {
  useLayoutEffect(() => {
    const [actualMethod, direction] = sortOption.split("-") as [SortMethod, "up" | "down"];
    setSalesSorted(
      [...sales].sort((sale1, sale2) => {
        const total1 = sale1.specialPrice ?? sale1.quantity * (sale1.product?.price ?? 0);
        const total2 = sale2.specialPrice ?? sale2.quantity * (sale2.product?.price ?? 0);

        switch (actualMethod) {
          case "date":
          case "quantity":
            return direction === "down"
              ? sale1[actualMethod] - sale2[actualMethod]
              : sale2[actualMethod] - sale1[actualMethod];

          case "total":
            return direction === "down" ? total1 - total2 : total2 - total1;

          case "creditcard": {
            const diff1 = total1 - sale1.cash;
            const diff2 = total2 - sale2.cash;
            return direction === "down" ? diff1 - diff2 : diff2 - diff1;
          }

          case "person":
          case "product": {
            const a = sale1[actualMethod].name
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .toLowerCase();
            const b = sale2[actualMethod].name
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .toLowerCase();
            return (a < b ? -1 : a > b ? 1 : 0) * (direction === "down" ? -1 : 1);
          }

          default:
            return 0;
        }
      })
    );
  }, [sales, sortOption]);
}
