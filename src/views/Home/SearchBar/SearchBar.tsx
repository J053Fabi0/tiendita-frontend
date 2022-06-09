import { useCallback, useState } from "react";
import { Search } from "react-bootstrap-icons";
import useDebounce from "../../../hooks/useDebounce";
import { SearchContainer, SearchButton, SearchInput } from "./SearchBarComponents";

interface Props {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
export default function SearchBar({ searchQuery, setSearchQuery }: Props) {
  const [tempSearchQuery, setTempSearchQuery] = useState("");

  const search = useCallback(() => void setSearchQuery(tempSearchQuery), [tempSearchQuery]);

  useDebounce(search, 200, [search]);

  return (
    <div className="w-100 d-flex justify-content-center mb-3">
      <SearchContainer>
        <SearchInput
          type="search"
          value={tempSearchQuery}
          placeholder="Buscar"
          onChange={(a) => setTempSearchQuery(a.target.value)}
        />

        <SearchButton type="submit" variant="dark" onClick={search}>
          <Search className="mb-1" />
        </SearchButton>
      </SearchContainer>
    </div>
  );
}
