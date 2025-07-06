"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestProtect = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const guestProtect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    console.log('Guest Access - Headers:', req.headers);
    console.log('Guest Access - Cookies:', req.cookies);
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('Guest Token found in Authorization header:', token);
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
        console.log('Guest Token found in cookies:', token);
    }
    // If a token is found, deny access since it's for guests
    if (token) {
        console.log('Guest access denied because a token was provided');
        res.status(403).json({ message: 'Guests are not allowed with a valid token' });
    }
    else {
        next();
    }
}));
exports.guestProtect = guestProtect;
