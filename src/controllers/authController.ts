import { Request, Response } from "express";
import db from "../config/db";
import { comparePassword, generateToken, hashPassword } from "../utils/authUtils";

export const register = async (req: Request, res: Response): Promise<any> => {
    const { username, email, password } = req.body;

    // basic validate
    if (!username || !username.trim()) {
        return res.status(400).json({ statusCode: 400, message: "username is required" });
    }
    if (!email || !email.trim()) {
        return res.status(400).json({ statusCode: 400, message: "email is required" });
    }
    if (!password || !password.trim()) {
        return res.status(400).json({ statusCode: 400, message: "password is required" });
    }

    try {
        // Check if the user already exists
        const [rows]: any = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
        if (rows.length) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);
        await db.execute("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)", [username, email, hashedPassword, new Date()]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    // basic validate
    if (!email || !email.trim()) {
        return res.status(400).json({ statusCode: 400, message: "email is required" });
    }
    if (!password || !password.trim()) {
        return res.status(400).json({ statusCode: 400, message: "password is required" });
    }

    try {
        const [rows]: any = await db.execute("SELECT id, password FROM users WHERE email = ?", [email]);
        if (!rows.length) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        const user = rows[0];
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        const token = generateToken(user.id);
        res.json({ message: "Login successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};