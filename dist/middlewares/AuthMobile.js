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
const AuthMobileMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link } = req.params;
        const user = yield User_1.default.findByDeviceId(link);
        if (user) {
            if (user.xaalada === 'active' && user.expiretime > new Date()) {
                req.user = user;
                yield User_1.default.updateLastLogin(user.user_id);
                next();
            }
            else {
                yield User_1.default.updateUserStatus(user.user_id, 'banned');
                res.status(401).json({ message: 'banned' });
            }
        }
        else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.default = AuthMobileMiddleware;
