import { useState } from "react";
import Product from "../types/product.type";
import { ButtonColored } from "../styles/mixins";
import { Button, Modal, Form, InputGroup, FormControl } from "react-bootstrap";

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
            <Modal.Title>
              {product.name} - ${product.price}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-1" controlId="formCantidad">
                <Form.Label>Cantidad</Form.Label>
                <InputGroup className="mb-3">
                  {/* <InputGroup.Text>$</InputGroup.Text> */}
                  <FormControl type="number" defaultValue={1} />
                </InputGroup>
              </Form.Group>

              <ButtonColored type="submit">Nueva venta</ButtonColored>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      ),
  };
}
