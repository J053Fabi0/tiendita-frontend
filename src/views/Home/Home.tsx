import http from "../../http-common";
import Values from "../../types/values.type";
import Card from "../../components/Card/Card";
import SearchBar from "./SearchBar/SearchBar";
import Product from "../../types/product.type";
import { Row, Col, Container } from "react-bootstrap";
import { usePerson } from "../../context/personContext";
import useProductModal from "../../hooks/useProductModal";
import { useReloadSales } from "../../context/salesContext";
import { Fragment, useCallback, useState, useMemo } from "react";
import useNewSaleModal from "../../hooks/useNewSaleModal/useNewSaleModal";
import { useProducts, useReloadProduct } from "../../context/productsContext";

export default function Home() {
  const person = usePerson();
  const products = useProducts();
  const reloadSales = useReloadSales();
  const reloadProduct = useReloadProduct();
  const loadingCards = [1, 2, 3, 4, 5, 6].map((_, i) => <Card key={i} loading={true}></Card>);

  const handleNewSale = async (values: Values, product: Product) => {
    if (person === null) return;

    const a: any = { person: person.id, quantity: values.quantity, product: product.id };

    if (values.specialPriceExists)
      a.specialPrice = values.specialPrice * (values.specialPriceTotal ? 1 : values.quantity);

    a.date = (() => {
      const [hour, minute] = values.time.split(":").map((s) => parseInt(s));
      return new Date(values.date).setHours(hour, minute, 0, 0);
    })();

    a.cash = (() => {
      if (values.cardExists) return values.zeroCash ? 0 : values.cash;
      else return a.specialPrice ?? product.price * values.quantity;
    })();

    try {
      await http.post("/sale", a);
      await reloadProduct(product.id);

      reloadSales();
      setShow(false);
    } catch (e) {
      console.error((e as any).response.data.error.description);
    }
  };

  const { Modal: NewSaleModal, setShow, show, setProduct, product } = useNewSaleModal(handleNewSale, onEdit);
  const { Modal: PatchProductModal, setShow: setShowPatchModal } = useProductModal(product);

  function onEdit() {
    setShowPatchModal(true);
  }

  const handleOnClick = useCallback(
    (product: Product) => {
      if (show === false) {
        setProduct(product);
        setShow(true);
      }
    },
    [setProduct, setShow, show]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const cards = useMemo(
    () =>
      products
        ?.filter((product) => {
          const queries = searchQuery.split(" ");
          if (queries.length === 0) return true;

          for (const query of queries) {
            const regex = new RegExp(query, "ig");
            const price = new RegExp(`^${query}$`);

            if (
              regex.test(product.name) || // The name
              (product.description ? regex.test(product.description) : false) || // The description
              price.test(product.price.toString()) // The price
            )
              return true;
          }
          return false;
        })
        .map((product) => <Card key={product.id} product={product} handleOnClick={handleOnClick} />),
    [searchQuery, products]
  );

  return person === null ? null : (
    <Fragment>
      <Container className="mt-3">
        <Row>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          {/* <Filters /> */}
          <Col>
            <Row>{products === null ? loadingCards : cards}</Row>
          </Col>
        </Row>
      </Container>

      {NewSaleModal}
      {PatchProductModal}
    </Fragment>
  );
}
