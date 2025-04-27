import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface jwtPayload {
    userId: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwtPayload;
        (req as any).userId = decoded.userId; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};