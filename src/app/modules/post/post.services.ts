import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IPostFilters, postSearchableFields } from './post.interface';

const createPost = async (
  payload: {
    title: string;
    description?: string;
    price?: number;
    isNegotiable?: boolean;
    productCondition?: 'NEW' | 'USED' | 'LIKE_NEW';
    name: string;
    phone: string;
    postCategoryId: string;
    division?: string;
    district?: string;
    area?: string;
  },
  imageUrls: string[],
) => {
  const { division, district, area, ...postData } = payload;

  const result = await prisma.post.create({
    data: {
      ...postData,
      ...(imageUrls.length > 0 && {
        photos: {
          create: imageUrls.map(url => ({ url })),
        },
      }),
      ...(division && {
        address: {
          create: {
            division,
            district: district || '',
            area: area || '',
          },
        },
      }),
    },
    include: { photos: true, category: true, address: true },
  });

  return result;
};

const getAllPosts = async (
  filters: IPostFilters,
  paginationOptions: IPaginationOptions,
) => {
  const {
    searchTerm,
    postCategoryId,
    productCondition,
    isNegotiable,
    minPrice,
    maxPrice,
    division,
    district,
  } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

   
  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: postSearchableFields.map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (postCategoryId) {
    andConditions.push({ postCategoryId });
  }

  if (productCondition) {
    andConditions.push({ productCondition });
  }

  if (isNegotiable) {
    andConditions.push({ isNegotiable: isNegotiable === 'true' });
  }

  const minPriceFloat = parseFloat(minPrice as string);
  const maxPriceFloat = parseFloat(maxPrice as string);

  if (!isNaN(minPriceFloat)) {
    andConditions.push({ price: { gte: minPriceFloat } });
  }

  if (!isNaN(maxPriceFloat)) {
    andConditions.push({ price: { lte: maxPriceFloat } });
  }

  if (division) {
    andConditions.push({
      address: {
        division: { contains: division, mode: 'insensitive' },
      },
    });
  }

  if (district) {
    andConditions.push({
      address: {
        district: { contains: district, mode: 'insensitive' },
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.post.findMany({
    where: whereConditions,
    include: { photos: true, category: true, address: true },
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [sortBy]: sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.post.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getSinglePost = async (id: string) => {
  const result = await prisma.post.findUnique({
    where: { id },
    include: { photos: true, category: true, address: true },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  return result;
};

const updatePost = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    price?: number;
    isNegotiable?: boolean;
    productCondition?: 'NEW' | 'USED' | 'LIKE_NEW';
    name?: string;
    phone?: string;
    postCategoryId?: string;
    division?: string;
    district?: string;
    area?: string;
  },
  imageUrls?: string[],
) => {
  const existing = await prisma.post.findUnique({
    where: { id },
    include: { address: true },
  });

  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const { division, district, area, ...postData } = payload;
  const hasAddressUpdate = division || district || area;

  const result = await prisma.post.update({
    where: { id },
    data: {
      ...postData,
      ...(imageUrls &&
        imageUrls.length > 0 && {
          photos: {
            create: imageUrls.map(url => ({ url })),
          },
        }),
      ...(hasAddressUpdate && {
        address: existing.address
          ? {
              update: {
                ...(division && { division }),
                ...(district && { district }),
                ...(area && { area }),
              },
            }
          : {
              create: {
                division: division || '',
                district: district || '',
                area: area || '',
              },
            },
      }),
    },
    include: { photos: true, category: true, address: true },
  });

  return result;
};

const deletePost = async (id: string) => {
  const existing = await prisma.post.findUnique({
    where: { id },
    include: { photos: true, address: true },
  });

  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // delete related records first
  if (existing.address) {
    await prisma.postAddress.delete({ where: { id: existing.address.id } });
  }

  if (existing.photos.length > 0) {
    await prisma.postPhoto.deleteMany({ where: { postId: id } });
  }

  const result = await prisma.post.delete({ where: { id } });

  return result;
};

const deletePostPhoto = async (photoId: string) => {
  const existing = await prisma.postPhoto.findUnique({
    where: { id: photoId },
  });

  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Photo not found');
  }

  await prisma.postPhoto.delete({ where: { id: photoId } });

  return existing;
};

export const PostServices = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  deletePostPhoto,
};
