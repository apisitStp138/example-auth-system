import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
    return bcrypt.compare(password, hashed);
};

export const generateToken = (userId: number): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const verifyToken = (token: string): boolean => {
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!);
        return true;
    } catch (err) {
        return false;
    }
};