import http from "../../http-common";
import Card from "../../components/Card/Card";
import Product from "../../types/product.type";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "react-bootstrap-icons";
import useReactModal from "../../hooks/useReactModal";
import { usePerson } from "../../context/personContext";
import useProductModal from "../../hooks/useProductModal";
import useNewProductModal from "../../hooks/useProductModal";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useProducts, useReloadProducts } from "../../context/productsContext";

export default function Products() {
  const person = usePerson();
  const navigate = useNavigate();
  useEffect(() => {
    if (person?.role === "employee") navigate("/");
  }, [person, navigate]);

  const products = useProducts();
  const reloadProducts = useReloadProducts();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const loadingCards = Array(6)
    .fill(0)
    .map((_, i) => <Card key={i} loading={true}></Card>);

  const { Modal: NewProductModal, setShow: setShowNewProduct } = useNewProductModal();
  const { Modal: PatchProductModal, setShow: setShowPatchModal, show } = useProductModal(product);

  const [deleting, setDeleting] = useState(false);
  const handleOnDelete = async () => {
    if (!product) return;

    setDeleting(true);
    try {
      await http.delete("/product", { data: { id: product.id } });
      await reloadProducts();
    } catch (e: any) {
      alert("Hubo un error.");
      if (e?.response?.data?.error) {
        console.error(JSON.stringify(e.response.data.error, null, 2));
      } else console.log(e);
    }

    setDeleting(false);
    setShowDeleteModal(false);
  };
  const { Modal: DeleteModal, setShow: setShowDeleteModal } = useReactModal(
    <>
      ¿Eliminar
      <i> {product?.name}</i> ?
    </>,

    null,

    <>
      <Button disabled={deleting} variant="secondary" onClick={() => setShowDeleteModal(false)}>
        Cancelar
      </Button>
      <Button disabled={deleting} variant="danger" onClick={handleOnDelete}>
        Eliminar
      </Button>
    </>,

    { verticallyCentered: true, closeButton: !deleting, backdrop: deleting ? "static" : undefined }
  );

  const handleOnCardClick = useCallback(
    (product: Product) => {
      if (show === false) {
        setProduct(product);
        setShowPatchModal(true);
      }
    },
    [setProduct, setShowPatchModal, show]
  );

  const cards = products?.map((product) => (
    <Card
      deleteButton
      key={product.id}
      product={product}
      handleOnClick={handleOnCardClick}
      handleOnDelete={(product) => {
        setProduct(product);
        setShowDeleteModal(true);
      }}
    />
  ));

  return person === null ? null : (
    <Fragment>
      <Container>
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Button className="d-flex align-items-center" onClick={() => setShowNewProduct(true)}>
              <PlusCircle /> &nbsp;Nuevo producto
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="me-2 me-sm-0 ms-2 ms-sm-0">
            <Row>{products === null ? loadingCards : cards}</Row>
          </Col>
        </Row>
      </Container>

      {NewProductModal}
      {PatchProductModal}
      {DeleteModal}
    </Fragment>
  );
}
