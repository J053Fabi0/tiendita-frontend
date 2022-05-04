import http from "../../http-common";
import Filters from "./Filters/Filters";
import Values from "../../types/values.type";
import Card from "../../components/Card/Card";
import { Fragment, useCallback } from "react";
import Product from "../../types/product.type";
import { Row, Col, Container } from "react-bootstrap";
import { usePerson } from "../../context/personContext";
import useProductModal from "../../hooks/useProductModal";
import useNewSaleModal from "../../hooks/useNewSaleModal/useNewSaleModal";
import { useProducts, useReloadProduct } from "../../context/productsContext";

export default function Home() {
  const person = usePerson();
  const products = useProducts();
  const reloadProduct = useReloadProduct();
  const loadingCards = [1, 2, 3, 4, 5, 6].map((_, i) => <Card key={i} loading={true}></Card>);

  const handleNewSale = async (values: Values, product: Product) => {
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
      await reloadProduct(product.id);
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

  const cards = products?.map((product) => (
    <Card key={product.id} product={product} handleOnClick={handleOnClick} />
  ));

  return (
    <Fragment>
      <Container className="mt-3">
        <Row>
          <Filters />
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
