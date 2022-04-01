import FiltersPlaceholder from "./FiltersPlaceholder";
import { Category, FiltersContainer, Tag } from "./FiltersComponets";
import { useTagsAndCategories } from "../../../context/tagsAndCategoriesContext";
import { memo } from "react";

function Filters() {
  const tagsAndCategories = useTagsAndCategories();
  const filtersTree: Array<any> = [];

  if (tagsAndCategories)
    for (let i = 0; i < tagsAndCategories.length; i++) {
      const { name, tags } = tagsAndCategories[i];
      filtersTree.push(<Category key={i}>{name}</Category>);

      for (let i = 0; i < tags.length; i++) filtersTree.push(<Tag key={tags[i].name}>{tags[i].name}</Tag>);
    }

  return <FiltersContainer>{tagsAndCategories ? filtersTree : <FiltersPlaceholder />}</FiltersContainer>;
}

export default memo(Filters);
