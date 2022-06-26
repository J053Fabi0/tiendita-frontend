import { useState } from "react";
import {
  useFrom,
  useUntil,
  useFromUpdate,
  useUntilUpdate,
  useReloadSales,
  useLoadingSales,
} from "../../context/salesContext";
import styled from "@emotion/styled";
import CustomToggle from "./CustomToggle";
import DatePicker from "react-date-picker";
import useArray from "../../hooks/useArray";
import useDebounce from "../../hooks/useDebounce";
import { useIsAdmin } from "../../context/personContext";
import { useSelectedPersons } from "../../context/selectedThingsContext";
import { AlignEnd, AlignStart, ArrowClockwise } from "react-bootstrap-icons";
import { Accordion, Button, Card, Col, Nav, Row, Spinner, ToggleButton } from "react-bootstrap";
import { useFirstPersonsLoad, useLoadingPersons, usePersons } from "../../context/personsContext";

export default function Filters() {
  const from = useFrom();
  const until = useUntil();
  const isAdmin = useIsAdmin();
  const setFrom = useFromUpdate();
  const setUntil = useUntilUpdate();
  const reloadSales = useReloadSales();
  const loadingSales = useLoadingSales();
  const [activeTab, setActiveTab] = useState("");

  const firstPersonsLoad = useFirstPersonsLoad();

  const persons = usePersons();
  const loadingPersons = useLoadingPersons();
  const [globalSelectedPersons, { set }] = useSelectedPersons();
  const [selectedPersons, { push: pushPerson, remove: removePerson, clear: clearPersons }] =
    useArray<number>(globalSelectedPersons);

  useDebounce(() => set(selectedPersons), 800, [selectedPersons]);

  const handleTabSelect = (tab: string | null) => {
    if (tab === null) return;
    if (tab === "persons") firstPersonsLoad();
    setActiveTab(tab !== activeTab ? tab : "");
  };

  const NoHoverToggle = styled(ToggleButton)(({ active }) => ({
    ":hover": {
      backgroundColor: active ? "#6c757d" : "white",
      color: active ? "white" : "#6c757d",
    },
  }));

  return (
    <Row className="mt-3">
      <Col className="d-flex justify-content-center">
        <Accordion className="w-100 d-flex align-items-center flex-column">
          <Nav variant="pills" activeKey={activeTab} defaultActiveKey="days" onSelect={handleTabSelect}>
            <CustomToggle eventKey="days">Día</CustomToggle>
            {!isAdmin ? null : <CustomToggle eventKey="persons">Personas</CustomToggle>}

            <Button variant="light" onClick={() => reloadSales(true)}>
              {loadingSales ? <Spinner animation="border" size="sm" /> : <ArrowClockwise />}
            </Button>
          </Nav>

          <Accordion.Collapse eventKey="days">
            <Card.Body>
              <AlignStart />{" "}
              <DatePicker
                value={from}
                format={"y-MM-dd"}
                maxDate={new Date()}
                disabled={loadingSales}
                disableCalendar={loadingSales}
                onChange={
                  ((from: Date) =>
                    setFrom(from === null ? new Date(new Date().setHours(0, 0, 0, 0)) : from)) as any
                }
              />
              <br />
              <AlignEnd />{" "}
              <DatePicker
                value={until}
                format={"y-MM-dd"}
                maxDate={new Date()}
                disabled={loadingSales}
                disableCalendar={loadingSales}
                onChange={
                  ((until: Date) =>
                    setUntil(
                      until === null ? new Date() : new Date(new Date(until).setHours(23, 59, 59, 999))
                    )) as any
                }
              />
            </Card.Body>
          </Accordion.Collapse>

          {!isAdmin ? null : (
            <Accordion.Collapse eventKey="persons">
              <Card.Body className="d-flex flex-wrap justify-content-center">
                {loadingPersons ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  [
                    <NoHoverToggle
                      value=""
                      key="all"
                      type="checkbox"
                      className="me-2 mb-2"
                      onClick={clearPersons}
                      variant="outline-secondary"
                      active={selectedPersons.length === 0}
                    >
                      Todos
                    </NoHoverToggle>,

                    ...persons.map(({ id, name }) => (
                      <NoHoverToggle
                        key={id}
                        value=""
                        type="checkbox"
                        className="me-2 mb-2"
                        variant="outline-secondary"
                        active={selectedPersons.includes(id)}
                        onClick={() => {
                          const index = selectedPersons.indexOf(id);
                          if (selectedPersons.length + 1 === persons.length && index === -1) return clearPersons();

                          if (index !== -1) removePerson(index);
                          else pushPerson(id);
                        }}
                      >
                        {name}
                      </NoHoverToggle>
                    )),
                  ]
                )}
              </Card.Body>
            </Accordion.Collapse>
          )}
        </Accordion>
      </Col>
    </Row>
  );
}
