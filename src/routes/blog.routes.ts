import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

import {
    createBlog,
    getMyBlogs,
    getMyJoinedBlogs,
    getBlogInfo,
    updateBlog,
    deleteBlog,
    searchBlogs,
    joinBlog,
    leaveBlog,
    getBlogUsers
} from '../controllers/blog.controller';

const router = Router();

import { Request, Response, NextFunction, RequestHandler } from 'express';

const wrapAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.post("/create", authMiddleware, wrapAsync(createBlog));
router.get("/get-my-blogs", authMiddleware, wrapAsync(getMyBlogs));
router.get("/get-my-joined-blogs", authMiddleware, wrapAsync(getMyJoinedBlogs));
router.get("/get-blog-info/:id", authMiddleware, wrapAsync(getBlogInfo));
router.put("/update/:id", authMiddleware, wrapAsync(updateBlog));
router.delete("/delete/:id", authMiddleware, wrapAsync(deleteBlog));
router.get("/search", authMiddleware, wrapAsync(searchBlogs));
router.post("/join-blog", authMiddleware, wrapAsync(joinBlog));
router.post("/leave-blog", authMiddleware, wrapAsync(leaveBlog));
router.get("/get-users/:blogId", authMiddleware, wrapAsync(getBlogUsers));

export default router;
