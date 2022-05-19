import http from "../../http-common";
import sleep from "../../utils/sleep";
import Sale from "../../types/sale.type";
import addCero from "../../utils/addCero";
import CustomToggle from "./CustomToggle";
import DatePicker from "react-date-picker";
import { useProducts } from "../../context/productsContext";
import useRedirectIfRole from "../../hooks/useRedirectIfRole";
import { useAuthTokenReady } from "../../context/personContext";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Accordion, Card, Col, Container, Nav, Row, Spinner, Table } from "react-bootstrap";

export default function Sales() {
  const confirmed = useRedirectIfRole();

  const [from, setFrom] = useState(new Date());
  const [activeTab, setActiveTab] = useState("");

  const products = useProducts();
  const authTokenReady = useAuthTokenReady();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);

  useEffect(() => {
    (async () => {
      if (!authTokenReady || !confirmed) {
        setSales([]);
        return;
      }

      setLoadingSales(true);
      let message: null | Sale[] = null;
      while (message === null)
        try {
          message = (await http.get<{ message: Sale[] }>("/sales", { params: { from: +from } })).data.message;
        } catch (e) {
          console.error(e);
          await sleep(1000);
        }

      setLoadingSales(false);
      setSales(message);
    })();
  }, [authTokenReady, confirmed, from]);

  const getProductByID = useCallback((id) => products?.find(({ id: thisID }) => thisID === id), [products]);

  const handleTabSelect = (tab: string | null) => {
    if (tab === null) return;
    setActiveTab(tab !== activeTab ? tab : "");
  };

  return !confirmed ? null : (
    <Fragment>
      <Container>
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Accordion className="w-100 d-flex align-items-center flex-column">
              <Nav variant="pills" activeKey={activeTab} defaultActiveKey="days" onSelect={handleTabSelect}>
                <CustomToggle eventKey="days">Día</CustomToggle>
                <CustomToggle eventKey="persons">Personas</CustomToggle>
              </Nav>

              <Accordion.Collapse eventKey="days">
                <Card.Body>
                  Desde{" "}
                  <DatePicker
                    value={from}
                    format={"y-MM-dd"}
                    maxDate={new Date()}
                    disabled={loadingSales}
                    disableCalendar={loadingSales}
                    onChange={((from: Date) => setFrom(from)) as any}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Accordion>
          </Col>
        </Row>

        <Row className="mt-3">
          {loadingSales || sales.length === 0 ? (
            <Col xs={12} className="d-flex justify-content-center align-items-center">
              {loadingSales ? (
                <>
                  <Spinner animation="border" size="sm" /> &#8194;Cargando...
                </>
              ) : (
                "No hay datos para los filtros seleccionados."
              )}
            </Col>
          ) : (
            <Col xs={12} className="me-2 me-sm-0 ms-2 ms-sm-0 overflow-auto">
              <Table striped bordered hover={false} size="sm">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Persona</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Tarjeta</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => {
                    const product = getProductByID(sale.product);
                    const date = new Date(sale.date);
                    const dateString =
                      `${addCero(date.getDate())}/${addCero(date.getMonth())}/` +
                      `${date.getFullYear().toString().substring(2)} ` +
                      `${addCero(date.getHours())}:${addCero(date.getMinutes())}`;
                    return (
                      <tr key={sale.id}>
                        <td>{dateString}</td>
                        <td>{sale.person}</td>
                        <td>{!product ? "Cargando..." : product.name}</td>
                        <td>{sale.quantity}</td>
                        <td>
                          $
                          {!product && !sale.specialPrice
                            ? "Cargando..."
                            : sale.quantity * (sale.specialPrice ?? product!.price)}
                        </td>
                        <td>{sale.specialPrice ? "$" + sale.specialPrice : "No"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          )}
        </Row>
      </Container>
    </Fragment>
  );
}
