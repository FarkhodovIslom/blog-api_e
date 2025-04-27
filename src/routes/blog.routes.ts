import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import asyncHandler from '../utils/asyncHandler';

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

router.post("/create", authMiddleware, asyncHandler(createBlog));
router.get("/get-my-blogs", authMiddleware, asyncHandler(getMyBlogs));
router.get("/get-my-joined-blogs", authMiddleware, asyncHandler(getMyJoinedBlogs));
router.get("/get-blog-info/:id", authMiddleware, asyncHandler(getBlogInfo));
router.put("/update/:id", authMiddleware, asyncHandler(updateBlog));
router.delete("/delete/:id", authMiddleware, asyncHandler(deleteBlog));
router.get("/search", authMiddleware, asyncHandler(searchBlogs));
router.post("/join-blog", authMiddleware, asyncHandler(joinBlog));
router.post("/leave-blog", authMiddleware, asyncHandler(leaveBlog));
router.get("/get-users/:blogId", authMiddleware, asyncHandler(getBlogUsers));

export default router;
