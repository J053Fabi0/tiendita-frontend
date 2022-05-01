import { LinkContainer } from "react-router-bootstrap";
import { Navbar as Navb, Container, Nav } from "react-bootstrap";

interface Props {
  links: Array<{ path: string; title: string }>;
}
export default function Navbar({ links }: Props) {
  return (
    <Navb expand="lg" bg="dark" variant="dark">
      <Container>
        <Navb.Brand>Tiendita</Navb.Brand>
        <Navb.Toggle />
        <Navb.Collapse>
          <Nav className="me-auto">
            {links.map(({ path, title }) => (
              <LinkContainer to={path} key={path}>
                <Nav.Link>{title}</Nav.Link>
              </LinkContainer>
            ))}
          </Nav>
        </Navb.Collapse>
      </Container>
    </Navb>
  );
}
