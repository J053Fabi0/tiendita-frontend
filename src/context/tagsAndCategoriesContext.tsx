import http from "../http-common";
import Tag from "../types/tags.type";
import Category from "../types/category.type";
import { useContext, createContext, useState, useEffect } from "react";

const TagsAndCategoriesContext = createContext<Category[] | null>(null);
const TagsContext = createContext<Tag[] | null>(null);

export const useTagsAndCategories = () => useContext(TagsAndCategoriesContext);
export const useTags = () => useContext(TagsContext);

export function TagsAndCategoriesProvider(a: { children: any }) {
  const [tagsAndCategories, setTagsAndCategories] = useState<null | Category[]>(null);
  const [tags, setTags] = useState<null | Tag[]>(null);

  useEffect(
    () => void http.get<{ message: Category[] }>("/tags").then((a) => setTagsAndCategories(a.data.message)),
    []
  );
  useEffect(() => {
    if (tagsAndCategories === null) return;
    setTags(tagsAndCategories.map((a) => a.tags).flat());
  }, [tagsAndCategories]);

  return (
    <TagsContext.Provider value={tags}>
      <TagsAndCategoriesContext.Provider value={tagsAndCategories}>
        {/**/}
        {a.children}
      </TagsAndCategoriesContext.Provider>
    </TagsContext.Provider>
  );
}
