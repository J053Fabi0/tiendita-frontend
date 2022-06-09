import styled from "@emotion/styled";
import addCero from "../../utils/addCero";
import CustomToggle from "./CustomToggle";
import DatePicker from "react-date-picker";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "../../context/personContext";
import { useEffect, useState } from "react";
import useRedirectIfTrue from "../../hooks/useRedirectIfTrue";
import { Accordion, Card, Col, Container, Form, Nav, Row, Spinner, Table } from "react-bootstrap";
import {
  useFrom,
  useFromUpdate,
  useSalesState,
  useLoadingSales,
  useFirstSalesLoad,
} from "../../context/salesContext";
import useArray from "../../hooks/useArray";

export default function Sales() {
  const isAdmin = useIsAdmin();
  useRedirectIfTrue(!isAdmin);

  const firstSalesLoad = useFirstSalesLoad();
  useEffect(firstSalesLoad, [firstSalesLoad]);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");

  const from = useFrom();
  const sales = useSalesState();
  const setFrom = useFromUpdate();
  const loadingSales = useLoadingSales();
  const [salesSelected, { remove, push, clear }] = useArray<number>();

  const handleTabSelect = (tab: string | null) => {
    if (tab === null) return;
    setActiveTab(tab !== activeTab ? tab : "");
  };

  const TD = styled.td(`cursor: pointer;`);
  const TH = styled.th(`cursor: pointer;`);
  const FormCheck = styled(Form.Check)(`cursor: pointer;`);

  return !isAdmin ? null : (
    <Container>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <Accordion className="w-100 d-flex align-items-center flex-column">
            <Nav variant="pills" activeKey={activeTab} defaultActiveKey="days" onSelect={handleTabSelect}>
              <CustomToggle eventKey="days">Día</CustomToggle>
              {/* <CustomToggle eventKey="persons">Personas</CustomToggle> */}
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
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Persona</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>💳</th>
                    <TH onClick={() => (salesSelected.length > 0 ? clear() : push(...sales.map(({ id }) => id)))}>
                      <FormCheck
                        readOnly
                        type="checkbox"
                        checked={salesSelected.length > 0}
                        className="d-flex justify-content-center"
                      />
                    </TH>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => {
                    const date = new Date(sale.date);
                    const product = sale.product;
                    const total = sale.specialPrice ?? sale.quantity * (product?.price ?? 0);
                    const dateString =
                      `${addCero(date.getDate())}/${addCero(date.getMonth())}/` +
                      `${date.getFullYear().toString().substring(2)} ` +
                      `${addCero(date.getHours())}:${addCero(date.getMinutes())}`;

                    const handleClick = () => navigate("./" + sale.id);

                    const handleCheck = () => {
                      const index = salesSelected.indexOf(sale.id);
                      if (index !== -1) remove(index);
                      else push(sale.id);
                    };

                    return (
                      <tr key={sale.id}>
                        <TD onClick={handleClick}>{dateString}</TD>
                        <TD onClick={handleClick}>{sale.person.name}</TD>
                        <TD onClick={handleClick}>{!product ? "Cargando..." : product.name}</TD>
                        <TD onClick={handleClick}>{sale.quantity}</TD>
                        <TD onClick={handleClick}>${!product && !sale.specialPrice ? "Cargando..." : total}</TD>
                        <TD onClick={handleClick}>
                          {sale.cash !== total
                            ? sale.cash === 0
                              ? "Todo"
                              : `$${total - sale.cash} en efectivo`
                            : "No"}
                        </TD>
                        <TD onClick={handleCheck}>
                          <FormCheck
                            type="checkbox"
                            readOnly={true}
                            className="d-flex justify-content-center"
                            checked={salesSelected.includes(sale.id)}
                          />
                        </TD>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>

            {salesSelected.length === 0 ? null : (
              <>
                <Col xs={12} className="w-100 d-flex justify-content-end">
                  <b>Total seleccionado:</b>&#8201;$
                  {sales
                    ?.filter(({ id }) => salesSelected.includes(id))
                    .reduce(
                      (prev, sale) => prev + (sale.specialPrice ?? sale.quantity * (sale.product.price ?? 0)),
                      0
                    )}
                </Col>
                <Col xs={12} className="w-100 d-flex justify-content-end">
                  <b>Resto:</b>&#8201;$
                  {sales
                    ?.filter(({ id }) => !salesSelected.includes(id))
                    .reduce(
                      (prev, sale) => prev + (sale.specialPrice ?? sale.quantity * (sale.product.price ?? 0)),
                      0
                    )}
                </Col>
              </>
            )}

            <Col xs={12} className="w-100 d-flex justify-content-end">
              <b>Total:</b>&#8201;$
              {sales?.reduce(
                (prev, sale) => prev + (sale.specialPrice ?? sale.quantity * (sale.product.price ?? 0)),
                0
              )}
            </Col>

            <div className="mt-3" />
          </>
        )}
      </Row>
    </Container>
  );
}
