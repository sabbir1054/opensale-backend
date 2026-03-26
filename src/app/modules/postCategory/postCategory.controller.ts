import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { postCategoryFilterableFields } from './postCategory.interface';
import { PostCategoryServices } from './postCategory.services';

const createPostCategory = catchAsync(async (req: Request, res: Response) => {
  const imageUrl = req.file ? req.file.path : undefined;
  const result = await PostCategoryServices.createPostCategory({
    ...req.body,
    imageUrl,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post category created successfully',
    data: result,
  });
});

const getAllPostCategories = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, postCategoryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PostCategoryServices.getAllPostCategories(
    filters,
    paginationOptions,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post categories retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePostCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PostCategoryServices.getSinglePostCategory(
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Post category retrieved successfully',
      data: result,
    });
  },
);

const updatePostCategory = catchAsync(async (req: Request, res: Response) => {
  const imageUrl = req.file ? req.file.path : undefined;
  const result = await PostCategoryServices.updatePostCategory(
    req.params.id as string,
    {
      ...req.body,
      imageUrl,
    },
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post category updated successfully',
    data: result,
  });
});

const deletePostCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await PostCategoryServices.deletePostCategory(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post category deleted successfully',
    data: result,
  });
});

export const PostCategoryController = {
  createPostCategory,
  getAllPostCategories,
  getSinglePostCategory,
  updatePostCategory,
  deletePostCategory,
};
