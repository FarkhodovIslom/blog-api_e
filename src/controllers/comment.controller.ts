import { Request, Response } from "express";
import prisma from "../prisma";

export const createComment = async (req: Request, res: Response) => {
  const { postId, text } = req.body;
  const userId = (req as any).userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post topilmadi" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        postId,
        userId: userId,
      },
    });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Xatolik comment yaratishda", error });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = (req as any).userId;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment || comment.userId !== userId) {
      return res.status(403).json({ message: "Faqat o'z commentini update qila oladi" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { text },
    });

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Xatolik commentni yangilashda", error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment || comment.userId !== userId) {
      return res.status(403).json({ message: "Faqat o'z commentini delete qila oladi" });
    }

    await prisma.comment.delete({ where: { id: Number(id) } });

    res.json({ message: "Comment o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Xatolik commentni o'chirishda", error });
  }
};
