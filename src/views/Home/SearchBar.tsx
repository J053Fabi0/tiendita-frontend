import styled from "@emotion/styled";
import { Search } from "react-bootstrap-icons";
import { Form, InputGroup, Button } from "react-bootstrap";

const SearchButton = styled(({ className }: { className?: string }) => (
  <Button type="submit" className={className} variant="dark">
    <Search className="mb-1" />
  </Button>
))(({ theme: { colors } }: any) => ({
  "borderTopRightRadius": "50rem",
  "borderBottomRightRadius": "50rem",
  "backgroundColor": colors.primary,
  ":hover": {
    backgroundColor: colors.primary,
  },
}));

const SearchInput = styled(({ className }: { className?: string }) => (
  <Form.Control type="search" placeholder="Buscar" className={className} />
))({ borderTopLeftRadius: "50rem", borderBottomLeftRadius: "50rem" });

const SearchComponent = styled(({ className }: { className?: string }) => (
  <InputGroup className={className}>
    <SearchInput />
    <SearchButton />
  </InputGroup>
))({
  "width": "70%",
  "@media (max-width: 767px)": {
    // With medium devices (tablets, 768px and up)
    width: "100%",
  },
});

export default function SearchBar() {
  return (
    <div className="w-100 d-flex justify-content-center mb-4 mt-5">
      <SearchComponent />
    </div>
  );
}
