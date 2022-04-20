import styled from "@emotion/styled";
import Person from "../../types/Person.type";
import { Navbar as Navb, Container, Nav, NavDropdown } from "react-bootstrap";
import { usePerson, usePersonUpdate, usePersons } from "../../context/personContext";

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

  const person = usePerson();
  const persons = usePersons();
  const setPerson = usePersonUpdate();

  const handlePersonClick = (person: Person) => {
    setPerson(person);
  };

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

            {persons !== null ? (
              <NavDropdown title={person ? person.name : "¿Quién eres?"}>
                {persons.map((person) => (
                  <NavDropdown.Item onClick={() => handlePersonClick(person)} key={person.id}>
                    {person.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            ) : null}
          </Nav>
        </Navb.Collapse>
      </Container>
    </Navb>
  );
}
