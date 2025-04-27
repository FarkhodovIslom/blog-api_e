import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as BlogController from '../controllers/blog.controller';

const router = Router();

import { Request, Response, NextFunction, RequestHandler } from 'express';

const wrapAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.post('/', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
  BlogController.createBlog(req, res, next);
});

router.get('/my', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
  BlogController.getMyBlogs(req, res, next);
});

router.get('/joined', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
  BlogController.getMyJoinedBlogs(req, res, next);
});

router.get('/search', (req: Request, res: Response, next: NextFunction): void => {
  BlogController.searchBlogs(req, res, next);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  BlogController.getBlogInfo(req, res, next);
});

router.put('/:id', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
  BlogController.updateBlog(req, res, next);
});

router.delete('/:id', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
  BlogController.deleteBlog(req, res, next);
});

router.post('/:id/join', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
  BlogController.joinBlog(req, res, next);
});

router.delete('/:id/leave', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
  BlogController.leaveBlog(req, res, next);
});

router.get('/:id/users', (req: Request, res: Response, next: NextFunction): void => {
  BlogController.getBlogUsers(req, res, next);
});

export default router;