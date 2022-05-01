import http from "../http-common";
import sleep from "../utils/sleep";
import Tag from "../types/tags.type";
import Category from "../types/category.type";
import { useAuthToken } from "./personContext";
import { useContext, createContext, useState, useEffect } from "react";

const TagsAndCategoriesContext = createContext<Category[] | null>(null);
const TagsContext = createContext<Tag[] | null>(null);

export const useTagsAndCategories = () => useContext(TagsAndCategoriesContext);
export const useTags = () => useContext(TagsContext);

export function TagsAndCategoriesProvider(a: { children: any }) {
  const authToken = useAuthToken();
  const [tags, setTags] = useState<null | Tag[]>(null);
  const [tagsAndCategories, setTagsAndCategories] = useState<null | Category[]>(null);

  useEffect(() => {
    (async () => {
      if (authToken === "") {
        setTags(null);
        setTagsAndCategories(null);
        return;
      }

      let message: null | Category[] = null;
      while (message === null)
        try {
          message = (await http.get<{ message: Category[] }>("/tags")).data.message;
        } catch (e) {
          console.error(e);
          await sleep(1000);
        }

      setTagsAndCategories(message);
    })();
  }, [authToken]);
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
