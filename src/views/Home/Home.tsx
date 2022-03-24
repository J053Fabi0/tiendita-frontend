import Card from "./Card";
import Filters from "./Filters";
import { Fragment } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useProducts } from "../../context/productsContext";
import { useTagsAndCategories } from "../../context/tagsAndCategoriesContext";

export default function Home() {
  const products = useProducts();
  const tagsAndCategories = useTagsAndCategories();
  const loadingCards = Array(6)
    .fill(0)
    .map((_, i) => <Card key={i} loading={true}></Card>);

  const cards = products?.map((product) => <Card key={product.id} product={product} />);

  return (
    <Fragment>
      <div className="mt-3" />
      <Container>
        <Row>
          <Filters />
          <Col>
            <Row>{tagsAndCategories === null && products === null ? loadingCards : cards}</Row>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}
