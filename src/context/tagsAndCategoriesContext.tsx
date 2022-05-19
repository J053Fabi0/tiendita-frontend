import http from "../http-common";
import sleep from "../utils/sleep";
import Tag from "../types/tags.type";
import Category from "../types/category.type";
import { useAuthTokenReady } from "./personContext";
import { useContext, createContext, useState, useEffect } from "react";
import useLoadData from "../hooks/useLoadData";

const TagsContext = createContext<Tag[] | null>(null);
const TagsAndCategoriesContext = createContext<Category[] | null>(null);

export const useTags = () => useContext(TagsContext);
export const useTagsAndCategories = () => useContext(TagsAndCategoriesContext);

export function TagsAndCategoriesProvider(a: { children: any }) {
  const authTokenReady = useAuthTokenReady();
  const [tags, setTags] = useState<null | Tag[]>(null);
  const [tagsAndCategories, setTagsAndCategories] = useState<null | Category[]>(null);

  useLoadData<null | Category[]>(
    [authTokenReady],
    setTagsAndCategories,
    () => http.get<{ message: Category[] }>("/tags"),
    { defaultValue: null }
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
