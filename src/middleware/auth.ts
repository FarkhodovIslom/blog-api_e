import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

interface JwtPayload {
  userId: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: Token berilmagan" });
    return;
  }

  try {
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET to'g'ri emas");
    }

    
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Unauthorized: ruxsat y" });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Unauthorized: token vaqti tugagan" });
    } else {
      res.status(500).json({ message: "Server error while auth" });
    }
  }
};