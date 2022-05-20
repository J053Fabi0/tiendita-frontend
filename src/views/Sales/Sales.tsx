import http from "../../http-common";
import Sale from "../../types/sale.type";
import addCero from "../../utils/addCero";
import CustomToggle from "./CustomToggle";
import DatePicker from "react-date-picker";
import Person from "../../types/Person.type";
import useLoadData from "../../hooks/useLoadData";
import { Fragment, useCallback, useState } from "react";
import { useIsAdmin } from "../../context/personContext";
import { useProducts } from "../../context/productsContext";
import useRedirectIfTrue from "../../hooks/useRedirectIfTrue";
import { usePersonsState } from "../../context/personsContext";
import { Accordion, Card, Col, Container, Nav, Row, Spinner, Table } from "react-bootstrap";
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
  useFirstSalesLoad()();

  const [activeTab, setActiveTab] = useState("");

  const from = useFrom();
  const sales = useSalesState();
  const setFrom = useFromUpdate();
  const loadingSales = useLoadingSales();
  const [persons, setPersons] = usePersonsState();
  const [loadingPersons, setLoadingPersons] = useState(persons.length === 0);

  useLoadData([isAdmin], setPersons, () => http.get<{ message: Person[] }>("/persons"), {
    conditionToStart: isAdmin,
    loadingCB: (loading) => setLoadingPersons(loading),
  });

  const products = useProducts();
  const getProductByID = useCallback((id) => products?.find(({ id: thisID }) => thisID === id), [products]);
  const getPersonByID = useCallback((id) => persons?.find(({ id: thisID }) => thisID === id), [persons]);

  const handleTabSelect = (tab: string | null) => {
    if (tab === null) return;
    setActiveTab(tab !== activeTab ? tab : "");
  };

  return !isAdmin ? null : (
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
                    const date = new Date(sale.date);
                    const product = getProductByID(sale.product);
                    const total = sale.quantity * (sale.specialPrice ?? product?.price ?? 0);
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
          )}
        </Row>
      </Container>
    </Fragment>
  );
}
