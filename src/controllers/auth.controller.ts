import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email allaqachon mavjud" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ message: "User muvaffaqiyatli ro'yxatdan o'tdi!", userId: newUser.id });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ message: "Email yoki parol noto'g'ri" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email yoki parol noto'g'ri" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

        res.cookie("token", token, { httpOnly: true, secure: false });

        return res.status(200).json({ message: "Muvaffaqiyatli login qilindi!", token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};