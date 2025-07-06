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
const User_1 = __importDefault(require("../model/User"));
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Your authentication logic here
        const { telegram_id, telegram_url } = req.params;
        const user = yield User_1.default.findUserByTelegramId(telegram_id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (user.telegram_url !== telegram_url) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (user.expired_at < new Date()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        // console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.default = AuthMiddleware;
