import styled from "@emotion/styled";
import { Nav, useAccordionButton } from "react-bootstrap";

const CustomToggle = ({ children, eventKey, ...props }: { children: unknown; eventKey: string }) => (
  <Nav.Item {...props} onClick={useAccordionButton(eventKey)}>
    <Nav.Link eventKey={eventKey}>{children}</Nav.Link>
  </Nav.Item>
);

export default styled(CustomToggle)`
  & > a.active {
    background-color: ${(props) => props.theme.colors.buttonColor} !important;
    color: white !important;
  }

  & > a {
    color: ${(props) => props.theme.colors.buttonColor} !important;
  }
`;
