import CustomToggle from "./CustomToggle";
import DatePicker from "react-date-picker";
import { Dispatch, SetStateAction } from "react";
import { AlignEnd, AlignStart, ArrowClockwise } from "react-bootstrap-icons";
import { Accordion, Button, Card, Col, Nav, Row, Spinner } from "react-bootstrap";

interface Props {
  loadingSales: boolean;
  fromState: [Date, (from: Date) => void];
  untilState: [Date, (until: Date) => void];
  reloadSales: (now?: boolean | undefined) => void;
  activeTabState: [string, Dispatch<SetStateAction<string>>];
}

export default function Filters({ activeTabState, reloadSales, loadingSales, untilState, fromState }: Props) {
  const [from, setFrom] = fromState;
  const [until, setUntil] = untilState;
  const [activeTab, setActiveTab] = activeTabState;

  const handleTabSelect = (tab: string | null) => {
    if (tab === null) return;
    setActiveTab(tab !== activeTab ? tab : "");
  };

  return (
    <Row className="mt-3">
      <Col className="d-flex justify-content-center">
        <Accordion className="w-100 d-flex align-items-center flex-column">
          <Nav variant="pills" activeKey={activeTab} defaultActiveKey="days" onSelect={handleTabSelect}>
            <CustomToggle eventKey="days">Día</CustomToggle>
            {/* <CustomToggle eventKey="persons">Personas</CustomToggle> */}

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
        </Accordion>
      </Col>
    </Row>
  );
}
