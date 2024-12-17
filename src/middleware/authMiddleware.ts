import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/authUtils";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    const verify = verifyToken(token);
    if (verify) {
        next();
    } else {
        res.status(403).json({ message: "Invalid Token" });
    }
};