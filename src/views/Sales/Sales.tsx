import http from "../../http-common";
import addCero from "../../utils/addCero";
import CustomToggle from "./CustomToggle";
import DatePicker from "react-date-picker";
import Person from "../../types/Person.type";
import useLoadData from "../../hooks/useLoadData";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useIsAdmin } from "../../context/personContext";
import { useProducts } from "../../context/productsContext";
import useRedirectIfTrue from "../../hooks/useRedirectIfTrue";
import { Accordion, Card, Col, Container, Nav, Row, Spinner, Table } from "react-bootstrap";
import { useFirstPersonsLoad, useLoadingPersons, usePersons } from "../../context/personsContext";
import {
  useFrom,
  useFromUpdate,
  useSalesState,
  useLoadingSales,
  useFirstSalesLoad,
} from "../../context/salesContext";

export default function Sales() {
  const isAdmin = useIsAdmin();
  useRedirectIfTrue(!isAdmin);

  const firstSalesLoad = useFirstSalesLoad();
  const firstPersonsLoad = useFirstPersonsLoad();
  useEffect(() => (firstSalesLoad(), firstPersonsLoad()), []);

  const [activeTab, setActiveTab] = useState("");

  const from = useFrom();
  const persons = usePersons();
  const sales = useSalesState();
  const setFrom = useFromUpdate();
  const loadingSales = useLoadingSales();
  const loadingPersons = useLoadingPersons();

  const products = useProducts();
  const getPersonByID = useCallback((id) => persons?.find(({ id: thisID }) => thisID === id), [persons]);
  const getProductByID = useCallback((id) => products?.find(({ id: thisID }) => thisID === id), [products]);

  const handleTabSelect = (tab: string | null) => {
    if (tab === null) return;
    setActiveTab(tab !== activeTab ? tab : "");
  };

  return !isAdmin ? null : (
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
          <>
            <Col xs={12} className="overflow-auto">
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
                    const date = new Date(sale.date);
                    const product = getProductByID(sale.product);
                    const total = sale.specialPrice ?? sale.quantity * (product?.price ?? 0);
                    const dateString =
                      `${addCero(date.getDate())}/${addCero(date.getMonth())}/` +
                      `${date.getFullYear().toString().substring(2)} ` +
                      `${addCero(date.getHours())}:${addCero(date.getMinutes())}`;

                    return (
                      <tr key={sale.id}>
                        <td>{dateString}</td>
                        <td>{loadingPersons ? "Cargando..." : getPersonByID(sale.person)?.name}</td>
                        <td>{!product ? "Cargando..." : product.name}</td>
                        <td>{sale.quantity}</td>
                        <td>${!product && !sale.specialPrice ? "Cargando..." : total}</td>
                        <td>
                          {sale.cash !== total
                            ? sale.cash === 0
                              ? "Todo"
                              : `$${total - sale.cash} en efectivo`
                            : "No"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>

            <Col xs={12} className="w-100 d-flex justify-content-end">
              <b>Total:</b>&#8201;$
              {sales?.reduce(
                (prev, sale) =>
                  prev + (sale.specialPrice ?? sale.quantity * (getProductByID(sale.product)?.price ?? 0)),
                0
              )}
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
}
