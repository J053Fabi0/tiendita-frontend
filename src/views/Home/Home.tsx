import Card from "./Card/Card";
import Filters from "./Filters";
import { Fragment } from "react";
import Product from "../../types/product.type";
import { Row, Col, Container } from "react-bootstrap";
import useNewSaleModal from "../../hooks/useNewSaleModal";
import { useProducts } from "../../context/productsContext";
import { useTagsAndCategories } from "../../context/tagsAndCategoriesContext";

export default function Home() {
  const products = useProducts();
  const tagsAndCategories = useTagsAndCategories();
  const loadingCards = Array(6)
    .fill(0)
    .map((_, i) => <Card key={i} loading={true}></Card>);

  const { modal: NewSaleModal, setShow, show, setProduct } = useNewSaleModal();

  const handleOnClick = (product: Product) => {
    if (show === false) {
      setProduct(product);
      setShow(true);
    }
  };

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
            <Row>{tagsAndCategories === null || products === null ? loadingCards : cards}</Row>
          </Col>
        </Row>
      </Container>
      {NewSaleModal}
    </Fragment>
  );
}
