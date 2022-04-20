import Person from "../../types/Person.type";
import useBreakpoints from "../../hooks/useBreakpoints";
import { Navbar as Navb, Container, Nav, NavDropdown } from "react-bootstrap";
import { usePerson, usePersonUpdate, usePersons } from "../../context/personContext";

interface Props {
  links: Array<{ path: string; title: string }>;
}
export default function Navbar({ links }: Props) {
  const person = usePerson();
  const persons = usePersons();
  const setPerson = usePersonUpdate();

  const handlePersonClick = (person: Person) => {
    setPerson(person);
  };

  const { greaterOrEqualThan } = useBreakpoints();

  return (
    <Navb expand="lg" bg="dark" variant="dark">
      <Container>
        <Navb.Brand>Tiendita</Navb.Brand>
        <Navb.Toggle />
        <Navb.Collapse>
          <Nav className="me-auto">
            {links.map(({ path, title }) => (
              <Nav.Link active={path === window.location.pathname} key={path} href={path}>
                {title}
              </Nav.Link>
            ))}

            {persons !== null ? (
              <NavDropdown
                className="ms-lg-3"
                title={person ? person.name : "¿Quién eres?"}
                menuVariant={greaterOrEqualThan.large ? undefined : "dark"}
              >
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
