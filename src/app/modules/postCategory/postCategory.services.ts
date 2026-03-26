import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  IPostCategoryFilters,
  postCategorySearchableFields,
} from './postCategory.interface';

const createPostCategory = async (payload: {
  categoryName: string;
  imageUrl?: string;
}) => {
  const { imageUrl, ...categoryData } = payload;

  const result = await prisma.postCategory.create({
    data: {
      ...categoryData,
      ...(imageUrl && {
        image: {
          create: { url: imageUrl },
        },
      }),
    },
    include: { image: true },
  });

  return result;
};

const getAllPostCategories = async (
  filters: IPostCategoryFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const whereConditions: Record<string, unknown>[] = [];

  if (searchTerm) {
    whereConditions.push({
      OR: postCategorySearchableFields.map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  const finalWhere = whereConditions.length > 0 ? { AND: whereConditions } : {};

  const result = await prisma.postCategory.findMany({
    where: finalWhere,
    include: { image: true },
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.postCategory.count({ where: finalWhere });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getSinglePostCategory = async (id: string) => {
  const result = await prisma.postCategory.findUnique({
    where: { id },
    include: { image: true },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post category not found');
  }

  return result;
};

const updatePostCategory = async (
  id: string,
  payload: { categoryName?: string; imageUrl?: string },
) => {
  const existing = await prisma.postCategory.findUnique({
    where: { id },
    include: { image: true },
  });

  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post category not found');
  }

  const { imageUrl, ...categoryData } = payload;

  const result = await prisma.postCategory.update({
    where: { id },
    data: {
      ...categoryData,
      ...(imageUrl && {
        image: existing.image
          ? { update: { url: imageUrl } }
          : { create: { url: imageUrl } },
      }),
    },
    include: { image: true },
  });

  return result;
};

const deletePostCategory = async (id: string) => {
  const existing = await prisma.postCategory.findUnique({
    where: { id },
    include: { image: true },
  });

  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post category not found');
  }

  // delete image first if exists (due to FK constraint)
  if (existing.image) {
    await prisma.postCategoryPhoto.delete({
      where: { id: existing.image.id },
    });
  }

  const result = await prisma.postCategory.delete({
    where: { id },
  });

  return result;
};

export const PostCategoryServices = {
  createPostCategory,
  getAllPostCategories,
  getSinglePostCategory,
  updatePostCategory,
  deletePostCategory,
};
