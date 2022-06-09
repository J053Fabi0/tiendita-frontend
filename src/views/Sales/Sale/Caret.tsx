import SortMethod from "./sortMethod.type";
import SortOption from "./sortOption.type";
import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons";

export default function Caret({ sortMethod, sortOption }: { sortMethod: SortMethod; sortOption: SortOption }) {
  const [actualMethod, direction] = sortOption.split("-") as [SortMethod, "up" | "down"];

  if (sortMethod === actualMethod) return direction === "up" ? <CaretUpFill /> : <CaretDownFill />;
  else return null;
}
