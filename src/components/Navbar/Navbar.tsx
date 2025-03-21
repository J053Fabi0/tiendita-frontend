import styled from "@emotion/styled";
import { BoxArrowRight } from "react-bootstrap-icons";
import { LinkContainer } from "react-router-bootstrap";
import { useLogOut, usePerson } from "../../context/personContext";
import { Navbar as Navb, Container, Nav, Button } from "react-bootstrap";

const LogoutButton = styled(Nav.Link)`
  color: black;
  font-weight: 500;
`;

interface Props {
  links: Array<{ path: string; title: string; onlyAdmins?: boolean }>;
}
function Navbar({ links, ...props }: Props) {
  const logout = useLogOut();
  const person = usePerson();
  const Title = styled(Navb.Brand)({ paddingBottom: "0.5rem" });

  return person === null ? null : (
    <Navb expand="lg" {...props}>
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
                <LogoutButton
                  as={Button}
                  variant={"link"}
                  onClick={logout}
                  className="d-flex align-items-center ms-lg-3"
                >
                  Cerrar sesión &nbsp;
                  <BoxArrowRight />
                </LogoutButton>
              </Nav.Item>
            ) : null}
          </Nav>
        </Navb.Collapse>
      </Container>
    </Navb>
  );
}

export default styled(Navbar)`
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 2px solid black;

  & .nav-link.active {
    color: ${(props) => props.theme.colors.buttonColor};
  }
`;
