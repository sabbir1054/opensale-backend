import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { PostRoutes } from '../modules/post/post.routes';
import { PostCategoryRoutes } from '../modules/postCategory/postCategory.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/post-categories',
    route: PostCategoryRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
