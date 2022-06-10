import { useMemo } from "react";
import Card from "../../components/Card/Card";
import normalize from "../../utils/normalize";
import Product from "../../types/product.type";

export default function useCardsFiltered(
  searchQuery: string,
  products: Product[] | null,
  handleOnClick: (product: Product) => void
) {
  return useMemo(
    () =>
      products
        ?.filter((product) => {
          const queries = normalize(searchQuery).split(" ");
          if (queries.length === 0) return true;

          for (const query of queries) {
            const regex = new RegExp(query, "ig");
            const price = new RegExp(`^${query}$`);

            if (
              regex.test(normalize(product.name)) || // The name
              (product.description ? regex.test(normalize(product.description)) : false) || // The description
              price.test(product.price.toString()) // The price
            )
              return true;
          }
          return false;
        })
        .map((product) => <Card key={product.id} product={product} handleOnClick={handleOnClick} />),
    [searchQuery, products, handleOnClick]
  );
}
