import { Router, Request, Response, NextFunction } from 'express';
import * as PostController from '../controllers/post.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Маршруты для постов
router.post('/', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
    PostController.createPost(req, res);
});

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    PostController.getAllPosts(req, res);
});

router.get('/sort', (req: Request, res: Response, next: NextFunction): void => {
    PostController.sortPostsByDate(req, res);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
    PostController.getPostById(req, res);
});

router.put('/:id', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
    PostController.updatePost(req, res);
});

router.delete('/:id', authMiddleware, (req: Request, res: Response, next: NextFunction): void => {
    PostController.deletePost(req, res);
});

router.get('/:postId/comments', (req: Request, res: Response, next: NextFunction): void => {
    PostController.getComments(req, res);
});

export default router;