import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const addToWishlist = async (userId: string, postId: string) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post already in wishlist');
  }

  const result = await prisma.wishlist.create({
    data: { userId, postId },
    include: {
      post: {
        include: { photos: true, category: true, address: true },
      },
    },
  });

  return result;
};

const getMyWishlist = async (userId: string) => {
  const result = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      post: {
        include: { photos: true, category: true, address: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return result;
};

const removeFromWishlist = async (userId: string, postId: string) => {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found in wishlist');
  }

  await prisma.wishlist.delete({
    where: { userId_postId: { userId, postId } },
  });

  return existing;
};

export const WishlistServices = {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
};
