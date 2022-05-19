import styled from "@emotion/styled";
import { BoxArrowRight } from "react-bootstrap-icons";
import { LinkContainer } from "react-router-bootstrap";
import { useLogOut, usePerson } from "../../context/personContext";
import { Navbar as Navb, Container, Nav, Button } from "react-bootstrap";

interface Props {
  links: Array<{ path: string; title: string; onlyAdmins?: boolean }>;
}
export default function Navbar({ links }: Props) {
  const logout = useLogOut();
  const person = usePerson();
  const Title = styled(Navb.Brand)({ paddingBottom: "0.5rem" });

  return (
    <Navb expand="lg" bg="dark" variant="dark">
      <Container>
        <Title>Tiendita</Title>
        <Navb.Toggle />
        <Navb.Collapse>
          <Nav className="me-auto">
            {links
              .filter(({ onlyAdmins }) => ((!person || person.role === "employee") && onlyAdmins ? false : true))
              .map(({ path, title }) => (
                <LinkContainer to={path} key={path}>
                  <Nav.Link>{title}</Nav.Link>
                </LinkContainer>
              ))}

            {person !== null ? (
              <Nav.Item>
                <Nav.Link
                  active
                  as={Button}
                  variant={"link"}
                  onClick={logout}
                  className="d-flex align-items-center ms-lg-3"
                >
                  Cerrar sesión &nbsp;
                  <BoxArrowRight />
                </Nav.Link>
              </Nav.Item>
            ) : null}
          </Nav>
        </Navb.Collapse>
      </Container>
    </Navb>
  );
}
