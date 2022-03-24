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
          </Nav>
        </Navb.Collapse>
      </Container>
    </Navb>
  );
}
