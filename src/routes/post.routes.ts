import { Router, Request, Response, NextFunction } from 'express';
import * as PostController from '../controllers/post.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
    PostController.createPost(req, res, next);
});

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    PostController.getAllPosts(req, res, next);
});

router.get('/sort', (req: Request, res: Response, next: NextFunction): void => {
    PostController.sortPostsByDate(req, res, next);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
    PostController.getPostById(req, res, next);
});

router.put('/:id', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
    PostController.updatePost(req, res, next);
});

router.delete('/:id', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
    PostController.deletePost(req, res, next);
});

router.get('/:postId/comments', (req: Request, res: Response, next: NextFunction): void => {
    PostController.getComments(req, res, next);
});

export default router;