import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createComment, updateComment, deleteComment } from "../controllers/comment.controller";

const router = Router();

router.post("/create", authMiddleware, createComment);
router.put("/update/:id", authMiddleware, updateComment);
router.delete("/delete/:id", authMiddleware, deleteComment);

export default router;
