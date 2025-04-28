import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({ message: "Email allaqachon mavjud" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "User muvaffaqiyatli ro'yxatdan o'tdi!", userId: newUser.id });
    } catch (error) {
        next(error);
    }
};


export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      
      if (!email) {
        res.status(400).json({ message: "Email majburiy" });
        return;
      }
      
      
      const user = await prisma.user.findUnique({
        where: {
          email: email  
        }
      });
      
      
      if (!user) {
        res.status(404).json({ message: "User topilmadi" });
        return;
      }
      
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        res.status(401).json({ message: "Parol xato" });
        return;
      }
      
      
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "7d" }
      );
      
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  };
  
