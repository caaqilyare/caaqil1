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
Object.defineProperty(exports, "__esModule", { value: true });
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.isAdmin === 'yes' && req.user.role === 'admin') {
            next();
        }
        else {
            return res.status(401).json({ message: 'This is not admin and you are not allowed to access this route' });
        }
    }
    catch (error) {
        // console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.default = AuthMiddleware;
