import { z } from 'zod';

const createPostCategoryValidation = z.object({
  body: z.object({
    categoryName: z.string({ required_error: 'Category name is required' }),
  }),
});

const updatePostCategoryValidation = z.object({
  body: z.object({
    categoryName: z.string().optional(),
  }),
});

export const PostCategoryValidation = {
  createPostCategoryValidation,
  updatePostCategoryValidation,
};
