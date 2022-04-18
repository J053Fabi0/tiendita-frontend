import { Navbar as Navb, Container, Nav } from "react-bootstrap";
import styled from "@emotion/styled";

interface Props {
  links: Array<{ path: string; title: string }>;
}
export default function Navbar({ links }: Props) {
  const NavLink = styled(
    ({ className, children, href }: { className?: string; children: string; href: string }) => (
      <Nav.Link href={href} className={className}>
        {children}
      </Nav.Link>
    )
  )`
    color: white !important;
  `;

  return (
    <Navb expand="lg" bg="dark" variant="dark">
      <Container>
        <Navb.Toggle />
        <Navb.Collapse>
          <Nav className="me-auto">
            {links.map(({ path, title }) => (
              <NavLink key={path} href={path}>
                {title}
              </NavLink>
            ))}

            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navb.Collapse>
      </Container>
    </Navb>
  );
}
