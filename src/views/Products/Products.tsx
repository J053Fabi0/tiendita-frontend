import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "react-bootstrap-icons";
import { usePerson } from "../../context/personContext";
import { Button, Col, Container, Row } from "react-bootstrap";
import useNewProductModal from "../../hooks/useNewProductModal";

export default function Products() {
  const person = usePerson();
  const navigate = useNavigate();
  useEffect(() => {
    if (person?.role === "employee") navigate("/");
  }, [person, navigate]);

  const { Modal, setShow } = useNewProductModal();

  return person === null ? null : (
    <Fragment>
      <Container className="mt-3">
        <Row>
          <Col className="d-flex justify-content-center">
            <Button className="d-flex align-items-center" onClick={() => setShow(true)}>
              <PlusCircle /> &nbsp;Nuevo producto
            </Button>
          </Col>
        </Row>
      </Container>

      {Modal}
    </Fragment>
  );
}
