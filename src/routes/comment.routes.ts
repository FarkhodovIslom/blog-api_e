import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import asyncHandler from "../utils/asyncHandler";
import { createComment, updateComment, deleteComment } from "../controllers/comment.controller";

const router = Router();

router.post("/create", authMiddleware, asyncHandler(createComment));
router.put("/update/:id", authMiddleware, asyncHandler(updateComment));
router.delete("/delete/:id", authMiddleware, asyncHandler(deleteComment));

export default router;
