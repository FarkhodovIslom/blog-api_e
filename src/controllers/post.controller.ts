import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { blogId, title, content } = req.body;
  const userId = (req as any).userId;

  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });

    if (!blog || blog.ownerId !== userId) {
      res.status(403).json({ message: "Faqat blog egasi post qila oladi" });
      return;
    }

    const post = await prisma.post.create({
      data: {
        blogId,
        title,
        content,
      },
    });

    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { blogId } = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: { blogId: Number(blogId) },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { views: { increment: 1 } },
    });

    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = (req as any).userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { blog: true },
    });

    if (!post || post.blog.ownerId !== userId) {
      res.status(403).json({ message: "Faqat blog egasi update qila oladi" });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { blog: true },
    });

    if (!post || post.blog.ownerId !== userId) {
      res.status(403).json({ message: "Faqat blog egasi delete qila oladi" });
      return;
    }

    await prisma.post.delete({ where: { id: Number(id) } });

    res.json({ message: "Post o'chirildi" });
  } catch (error) {
    next(error);
  }
};

export const sortPostsByDate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { blogId } = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: { blogId: Number(blogId) },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
    });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};