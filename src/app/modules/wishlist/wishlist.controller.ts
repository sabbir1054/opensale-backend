import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WishlistServices } from './wishlist.services';

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as { id: string };
  const { postId } = req.body;

  const result = await WishlistServices.addToWishlist(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post added to wishlist',
    data: result,
  });
});

const getMyWishlist = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as { id: string };

  const result = await WishlistServices.getMyWishlist(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist retrieved successfully',
    data: result,
  });
});

const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as { id: string };
  const postId = req.params.postId as string;

  const result = await WishlistServices.removeFromWishlist(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post removed from wishlist',
    data: result,
  });
});

export const WishlistController = {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
};
