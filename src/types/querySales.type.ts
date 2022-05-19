export default interface QuerySales {
  // The ids of the persons you want to get its sales.
  // Defaults to everyone.
  persons?: number[];

  // A time filter. Sales that were done by that time or greater.
  // Defaults to 0, to get all.
  from?: number;

  // The ids of the products you want to get its sales.
  // Defaults to all.
  products?: number[];

  // The ids of the tags you want to apply.
  // It can be empty, meaning all products that have no tags.
  // Defaults to no tag filtering.
  tags?: number[];

  // Apply the tags as OR or AND.
  // Defaults to OR.
  tagsBehavior?: "AND" | "OR";

  // Defaults to true. Get only enabled sales
  enabled?: boolean;
}
