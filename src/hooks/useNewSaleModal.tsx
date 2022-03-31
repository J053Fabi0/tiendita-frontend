import { useState } from "react";
import Product from "../types/product.type";
import { Button, Modal } from "react-bootstrap";

export default function NewSaleModal() {
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const handleClose = () => setShow(false);

  return {
    setProduct,
    setShow,
    show,
    modal:
      product === undefined ? null : (
        <Modal show={show && Boolean(product)} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{product.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{product.description}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Nueva venta
            </Button>
          </Modal.Footer>
        </Modal>
      ),
  };
}
