import Card from "../../components/Card/Card";
import Product from "../../types/product.type";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "react-bootstrap-icons";
import { usePerson } from "../../context/personContext";
import useProductModal from "../../hooks/useProductModal";
import { useProducts } from "../../context/productsContext";
import useNewProductModal from "../../hooks/useProductModal";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Fragment, useCallback, useEffect, useState } from "react";

export default function Products() {
  const person = usePerson();
  const navigate = useNavigate();
  useEffect(() => {
    if (person?.role === "employee") navigate("/");
  }, [person, navigate]);

  const products = useProducts();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const loadingCards = Array(6)
    .fill(0)
    .map((_, i) => <Card key={i} loading={true}></Card>);

  const { Modal: NewProductModal, setShow: setShowNewProduct } = useNewProductModal();
  const { Modal: PatchProductModal, setShow: setShowPatchModal, show } = useProductModal(product);

  const handleOnClick = useCallback(
    (product: Product) => {
      if (show === false) {
        setProduct(product);
        setShowPatchModal(true);
      }
    },
    [setProduct, setShowNewProduct, show]
  );

  const cards = products?.map((product) => (
    <Card key={product.id} product={product} handleOnClick={handleOnClick} />
  ));

  return person === null ? null : (
    <Fragment>
      <Container className="mt-3">
        <Row>
          <Col className="d-flex justify-content-center">
            <Button className="d-flex align-items-center" onClick={() => setShowNewProduct(true)}>
              <PlusCircle /> &nbsp;Nuevo producto
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Row>{products === null ? loadingCards : cards}</Row>
          </Col>
        </Row>
      </Container>

      {NewProductModal}
      {PatchProductModal}
    </Fragment>
  );
}
