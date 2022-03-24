import Tag from "./tags.type";

export default interface Category {
  name: string;
  id: number;
  tags: Array<Tag>;
}
