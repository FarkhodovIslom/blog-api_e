import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  sortPostsByDate,
  getComments,
} from "../controllers/post.controller";

const router = Router();

router.post("/create", authMiddleware, createPost);
router.get("/get-all", authMiddleware, getAllPosts);
router.get("/get-by-id/:id", authMiddleware, getPostById);
router.put("/update/:id", authMiddleware, updatePost);
router.delete("/delete/:id", authMiddleware, deletePost);
router.get("/sort-by-date", authMiddleware, sortPostsByDate);
router.get("/:postId/get-comments", authMiddleware, getComments);

export default router;
