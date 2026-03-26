import { z } from 'zod';

const createPostValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string().optional(),
    price: z.number().optional(),
    isNegotiable: z.boolean().optional(),
    productCondition: z.enum(['NEW', 'USED', 'LIKE_NEW']).optional(),
    name: z.string({ required_error: 'Name is required' }),
    phone: z.string({ required_error: 'Phone is required' }),
    postCategoryId: z.string({ required_error: 'Category is required' }),
    division: z.string().optional(),
    district: z.string().optional(),
    area: z.string().optional(),
  }),
});

const updatePostValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    isNegotiable: z.boolean().optional(),
    productCondition: z.enum(['NEW', 'USED', 'LIKE_NEW']).optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    postCategoryId: z.string().optional(),
    division: z.string().optional(),
    district: z.string().optional(),
    area: z.string().optional(),
  }),
});

export const PostValidation = {
  createPostValidation,
  updatePostValidation,
};
