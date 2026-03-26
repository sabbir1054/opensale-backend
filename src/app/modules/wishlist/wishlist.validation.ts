import { z } from 'zod';

const addToWishlistValidation = z.object({
  body: z.object({
    postId: z.string({ required_error: 'Post ID is required' }),
  }),
});

export const WishlistValidation = {
  addToWishlistValidation,
};
