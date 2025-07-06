"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (res, userId) => {
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in the environment variables');
        throw new Error('JWT_SECRET is not defined');
    }
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    res.cookie('jwt', token, cookieOptions);
    // Log the token for debugging purposes (optional, remove for production)
    console.log(`Token generated: ${token}`);
    // Also set the token in the response header
    res.setHeader('Authorization', `Bearer ${token}`);
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (req, res, next) => {
    var _a;
    const authHeader = req.headers.authorization;
    const cookieToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    const token = authHeader ? authHeader.split(' ')[1] : cookieToken;
    if (!token) {
        console.error('No token provided in request');
        return res.status(401).json({ message: 'No token found, authorization denied' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Log the decoded token for debugging purposes
        console.log(`Token verified. User ID: ${decoded.userId}`);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.verifyToken = verifyToken;
