import Card from "./Card/Card";
import http from "../../http-common";
import Filters from "./Filters/Filters";
import Values from "../../types/values.type";
import { Fragment, useCallback } from "react";
import Product from "../../types/product.type";
import { Row, Col, Container } from "react-bootstrap";
import { usePerson } from "../../context/personContext";
import { useProducts } from "../../context/productsContext";
import useNewSaleModal from "../../hooks/useNewSaleModal/useNewSaleModal";

export default function Home() {
  const products = useProducts();
  const loadingCards = Array(6)
    .fill(0)
    .map((_, i) => <Card key={i} loading={true}></Card>);
  const person = usePerson();

  const handleOnSubmit = async (values: Values, product: Product) => {
    if (person === null) return;

    const a: any = {
      person: person.id,
      quantity: values.quantity,
      date: (() => {
        const newDate = new Date(values.date);
        const [hour, minute] = values.time.split(":").map((s) => parseInt(s));
        newDate.setHours(hour, minute, 0, 0);
        return +newDate;
      })(),
      cash: (() => {
        if (values.cardExists) return values.zeroCash ? 0 : values.cash;
        else return product.price * values.quantity;
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
