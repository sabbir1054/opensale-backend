import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { postFilterableFields } from './post.interface';
import { PostServices } from './post.services';

const createPost = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as { path: string }[];
  const imageUrls = files ? files.map(file => file.path) : [];

  const result = await PostServices.createPost(req.body, imageUrls);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, postFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PostServices.getAllPosts(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.getSinglePost(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post retrieved successfully',
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as { path: string }[];
  const imageUrls = files ? files.map(file => file.path) : undefined;

  const result = await PostServices.updatePost(
    req.params.id as string,
    req.body,
    imageUrls,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.deletePost(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post deleted successfully',
    data: result,
  });
});

const deletePostPhoto = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.deletePostPhoto(
    req.params.photoId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Photo deleted successfully',
    data: result,
  });
});

export const PostController = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  deletePostPhoto,
};
