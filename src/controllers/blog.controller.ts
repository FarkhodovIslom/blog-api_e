import { Request, Response } from "express";
import prisma from "../prisma";

export const createBlog = async (req: Request, res: Response) => {
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
        res.status(500).json({ message: "Xatolik blog yaratishda", error });
    }
};

export const getMyBlogs = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
        const blogs = await prisma.blog.findMany({
            where: { ownerId: userId },
        });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Xatolik bloglarni olishda", error });
    }
}

export const getMyJoinedBlogs = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
        const joined = await prisma.joinedBlog.findMany({
            where: { userId },
            include: { blog: true },
        });

        res.json(joined.map(j => j.blog));
    } catch (error) {
        res.status(500).json({ message: "Xatolik qo'shilgan bloglarni olishda", error });
    }
};

export const getBlogInfo = async (req: Request, res: Response) => {
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
            return res.status(404).json({ message: "Blog topilmadi" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Xatolik blog ma'lumotlarini olishda", error });
    }
};

export const updateBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = (req as any).userId;

    try {
        const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });

        if (!blog || blog.ownerId !== userId) {
            return res.status(403).json({ message: "Update qilishga ruxsat yo'q" });
        }

        const updatedBlog = await prisma.blog.update({
            where: { id: Number(id) },
            data: { name },
        });

        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: "Xatolik blogni yangilashda", error });
    }
};

export const deleteBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).userId;

    try {
        const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });

        if (!blog || blog.ownerId !== userId) {
            return res.status(403).json({ message: "O'chirishga ruxsat yo'q" });
        }

        await prisma.blog.delete({ where: { id: Number(id) } });

        res.json({ message: "Blog o'chirildi" });
    } catch (error) {
        res.status(500).json({ message: "Xatolik blogni o'chirishda", error });
    }
};

export const searchBlogs = async (req: Request, res: Response) => {
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
        res.status(500).json({ message: "Xatolik bloglarni qidirishda", error });
    }
};

export const joinBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).userId;

    try {
        const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });

        if (!blog) {
            return res.status(404).json({ message: "Blog topilmadi" });
        }

        await prisma.joinedBlog.create({
            data: {
                userId,
                blogId: Number(id),
            },
        });

        res.json({ message: "Blogga qo'shildingiz" });
    } catch (error) {
        res.status(500).json({ message: "Blogga qo'shilishda xatolik", error });
    }
};

export const leaveBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).userId;

    try {
        const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });

        if (!blog) {
            return res.status(404).json({ message: "Blog topilmadi" });
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
        res.status(500).json({ message: "Blogdan chiqishda xatolik", error });
    }
};

export const getBlogUsers = async (req: Request, res: Response) => {
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
            return res.status(404).json({ message: "Blog topilmadi" });
        }

        res.json(blog.members.map(member => member.user));
    } catch (error) {
        res.status(500).json({ message: "Blog foydalanuvchilarini olishda xatolik", error });
    }
}