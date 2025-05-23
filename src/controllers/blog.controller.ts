import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";

export const createBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name } = req.body;
    const userId = (req as any).userId;

    try {
        const blog = await prisma.blog.create({
            data: {
                name,
                ownerId: userId,
                members: {
                    create: { userId: userId }
                },
            },
        });
        res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
};

export const getMyBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as any).userId;

    try {
        const blogs = await prisma.blog.findMany({
            where: { ownerId: userId },
        });
        res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
}

export const getMyJoinedBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as any).userId;

    try {
        const joined = await prisma.joinedBlog.findMany({
            where: { userId },
            include: { blog: true },
        });

        res.json(joined.map(j => j.blog));
    } catch (error) {
        next(error);
    }
};

export const getBlogInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
                posts: true
            },
        });

        if (!blog) {
            res.status(404).json({ message: "Blog topilmadi" });
            return;
        }
        res.status(200).json(blog);
    } catch (error) {
        next(error);
    }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = (req as any).userId;

    try {
        const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });

        if (!blog || blog.ownerId !== userId) {
            res.status(403).json({ message: "Update qilishga ruxsat yo'q" });
            return;
        }

        const updatedBlog = await prisma.blog.update({
            where: { id: Number(id) },
            data: { name },
        });

        res.json(updatedBlog);
    } catch (error) {
        next(error);
    }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).userId;

    try {
        const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });

        if (!blog || blog.ownerId !== userId) {
            res.status(403).json({ message: "O'chirishga ruxsat yo'q" });
            return;
        }

        await prisma.blog.delete({ where: { id: Number(id) } });

        res.json({ message: "Blog o'chirildi" });
    } catch (error) {
        next(error);
    }
};

export const searchBlogs = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.query;

    try {
        const blogs = await prisma.blog.findMany({
            where: {
                name: {
                    contains: String(name),
                    mode: "insensitive",
                },
            },
        });

        res.json(blogs);
    } catch (error) {
        next(error);
    }
};

export const joinBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).userId;

    try {
        const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });

        if (!blog) {
            res.status(404).json({ message: "Blog topilmadi" });
            return;
        }

        await prisma.joinedBlog.create({
            data: {
                userId,
                blogId: Number(id),
            },
        });

        res.json({ message: "Blogga qo'shildingiz" });
    } catch (error) {
        next(error);
    }
};

export const leaveBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).userId;

    try {
        const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });

        if (!blog) {
            res.status(404).json({ message: "Blog topilmadi" });
            return;
        }

        await prisma.joinedBlog.delete({
            where: {
                userId_blogId: {
                    userId,
                    blogId: Number(id),
                },
            },
        });

        res.json({ message: "Blogdan chiqdingiz" });
    } catch (error) {
        next(error);
    }
};

export const getBlogUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!blog) {
            res.status(404).json({ message: "Blog topilmadi" });
            return;
        }

        res.json(blog.members.map(member => member.user));
    } catch (error) {
        next(error);
    }
};
