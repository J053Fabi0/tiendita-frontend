import Card from "./Card/Card";
import Filters from "./Filters/Filters";
import Values from "../../types/values.type";
import { Fragment, useCallback } from "react";
import Product from "../../types/product.type";
import { Row, Col, Container } from "react-bootstrap";
import { useProducts } from "../../context/productsContext";
import useNewSaleModal from "../../hooks/useNewSaleModal/useNewSaleModal";
import http from "../../http-common";

export default function Home() {
  const products = useProducts();
  const loadingCards = Array(6)
    .fill(0)
    .map((_, i) => <Card key={i} loading={true}></Card>);

  const handleOnSubmit = async (values: Values, product: Product) => {
    const a: any = {
      person: 1,
      quantity: values.quantity,
      date: (() => {
        const newDate = new Date(values.date);
        const [hour, minute] = values.time.split(":").map((s) => parseInt(s));
        newDate.setHours(hour, minute, 0, 0);
        return +newDate;
      })(),
      cash: (() => {
        if (!values.cardExists) return product.price * values.quantity;
        return values.zeroCash ? 0 : values.cash;
      })(),
      product: product.id,
    };
    if (values.specialPriceExists)
      a.specialPrice = values.specialPrice * (values.specialPriceTotal ? 1 : values.quantity);

    try {
      await http.post("/sale", a);
      setShow(false);
    } catch (e) {
      console.error((e as any).response.data.error.description);
    }
  };

  const { modal: NewSaleModal, setShow, show, setProduct } = useNewSaleModal(handleOnSubmit);

  const handleOnClick = useCallback(
    (product: Product) => {
      if (show === false) {
        setProduct(product);
        setShow(true);
      }
    },
    [setProduct, setShow, show]
  );

  const cards = products?.map((product) => (
    <Card key={product.id} product={product} handleOnClick={handleOnClick} />
  ));

  return (
    <Fragment>
      <div className="mt-3" />
      <Container>
        <Row>
          <Filters />
          <Col>
            <Row>{products === null ? loadingCards : cards}</Row>
          </Col>
        </Row>
      </Container>

      {NewSaleModal}
    </Fragment>
  );
}
