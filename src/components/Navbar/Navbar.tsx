import { Navbar as Navb, Container, Nav } from "react-bootstrap";

interface Props {
  links: Array<{ path: string; title: string }>;
}
export default function Navbar({ links }: Props) {
  return (
    <Navb expand="lg" bg="dark" variant="dark">
      <Container>
        <Navb.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {links.map(({ path, title }) => (
              <Nav.Link key={path} href={path}>
                {title}
              </Nav.Link>
            ))}
          </Nav>
        </Navb.Collapse>
      </Container>
    </Navb>
  );
}
