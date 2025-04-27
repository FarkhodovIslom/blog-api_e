import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createComment, updateComment, deleteComment } from "../controllers/comment.controller";

const router = Router();

const wrapAsync = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/create", authMiddleware, wrapAsync(createComment));
router.put("/update/:id", authMiddleware, wrapAsync(updateComment));
router.delete("/delete/:id", authMiddleware, wrapAsync(deleteComment));

export default router;
