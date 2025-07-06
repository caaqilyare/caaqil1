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
exports.handleMessage = handleMessage;
const Resend_1 = __importDefault(require("../../../mobile/Resend/Resend"));
const CheckWait_1 = __importDefault(require("../../../mobile/waiting/CheckWait"));
function handleMessage(socket, user) {
    socket.on('check', (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Try resend first to check pending transactions
            const resendResult = yield new Resend_1.default(user).resend();
            if (resendResult) {
                socket.emit('resn', resendResult);
                return;
            }
            // Then check retry status
            const checkRetryResult = yield new CheckWait_1.default(user).checkRetry();
            if (checkRetryResult) {
                socket.emit('resn', 'not');
            }
            // Then check waiting status
            const checkWaitResult = yield new CheckWait_1.default(user).checkTime();
            if (checkWaitResult) {
                socket.emit('resn', 'not');
                return;
            }
            // if all are not working do nothing
            socket.emit('resn', 'not');
        }
        catch (error) {
            console.error('Error in socket regback:', error);
            socket.emit('resn', 'not');
        }
    }));
}
