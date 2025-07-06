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
exports.TelegramSocket = void 0;
const User_1 = __importDefault(require("../../model/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class TelegramSocket {
    constructor(data) {
        this.data = data;
    }
    // recieve data from telegram
    recieveData() {
        return __awaiter(this, void 0, void 0, function* () {
            const findTelegramId = yield User_1.default.findUserByTelegramId(this.data.id);
            if (!findTelegramId) {
                return null;
            }
            const hashTelegramUrl = findTelegramId.telegram_url;
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedTelegramUrl = yield bcryptjs_1.default.hash(hashTelegramUrl, salt);
            // Remove the bcrypt version and cost factor, then convert the Base64 hash part to hex
            const hashBase64 = hashedTelegramUrl.split('$')[3]; // Extracts the hash part
            const hashHex = Buffer.from(hashBase64, 'base64').toString('hex');
            // update the telegram_url with the hashed value
            yield User_1.default.updateTelegramUrl(findTelegramId.user_id, hashHex.substring(0, 32));
            return {
                telegram_id: this.data.id,
                telegram_url: hashHex.substring(0, 32),
                userInfo: findTelegramId
            };
        });
    }
}
exports.TelegramSocket = TelegramSocket;
