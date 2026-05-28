import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==========================================
// REGISTER USER CONTROLLER
// ==========================================
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Input Validation Guard
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all registration fields"
            });
        }

        // 2. Check for Duplicate Entry
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user account with this email address already exists"
            });
        }

        // 3. Password Hashing (Salt Rounds = 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Persistence Operation
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        // 5. Success Handshake Response
        return res.status(201).json({
            success: true,
            message: "User account registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("System Runtime Registry Exception:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Processing Error",
            error: process.env.NODE_ENV === "development" ? error.message : {}
        });
    }
};

// ==========================================
// LOGIN USER CONTROLLER
// ==========================================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Input Validation Guard
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password inputs are required"
            });
        }

        // 2. Locate User Profile Document
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid login credentials provided"
            });
        }

        // 3. Cryptographic Password Comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid login credentials provided"
            });
        }

        // 4. Token Generation utilizing Secured Environment Variable
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "fallback_local_development_secret_key_string",
            { expiresIn: "7d" }
        );

        // 5. Success Login Session Payload
        return res.status(200).json({
            success: true,
            message: "Session authentication handshake successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("System Runtime Authentication Exception:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Processing Error",
            error: process.env.NODE_ENV === "development" ? error.message : {}
        });
    }
};