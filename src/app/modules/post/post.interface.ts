export type IPostFilters = {
  searchTerm?: string;
  postCategoryId?: string;
  productCondition?: string;
  isNegotiable?: string;
  minPrice?: string;
  maxPrice?: string;
  division?: string;
  district?: string;
};

export const postSearchableFields = ['title', 'name', 'description'];
export const postFilterableFields = [
  'searchTerm',
  'postCategoryId',
  'productCondition',
  'isNegotiable',
  'minPrice',
  'maxPrice',
  'division',
  'district',
];
