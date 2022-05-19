import { Nav, useAccordionButton } from "react-bootstrap";

const CustomToggle = ({ children, eventKey }: { children: any; eventKey: string }) => (
  <Nav.Item onClick={useAccordionButton(eventKey)}>
    <Nav.Link eventKey={eventKey}>{children}</Nav.Link>
  </Nav.Item>
);

export default CustomToggle;
