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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const Transection_1 = __importDefault(require("../../model/Transection"));
const Amounts_1 = __importDefault(require("../../model/Amounts"));
class TimeCheck {
    constructor(number, user) {
        this.number = number;
        this.user = user;
    }
    checkTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield Transection_1.default.findSNumberSuccess(this.number, this.user.user_id);
            const pending = yield Transection_1.default.findLastPending(this.number, this.user.user_id);
            if (!success || !pending || pending.types !== 'unlimited') {
                return null;
            }
            const amount = yield Amounts_1.default.findByAmount(success.amount, success.types, this.user.user_id);
            if (!amount) {
                return null;
            }
            //
            const successTime = (0, moment_timezone_1.default)(success.updated_at).tz('Africa/Mogadishu');
            const hoursToAdd = amount.time_days; // Hours directly from time_days
            const sendTime = successTime.clone().add(hoursToAdd, 'hours');
            const currentTime = (0, moment_timezone_1.default)().tz('Africa/Mogadishu');
            if (currentTime.isAfter(sendTime)) {
                return null;
            }
            yield Transection_1.default.updateTransactionStatus(pending.id, this.user.user_id, 'waiting', sendTime.format('YYYY-MM-DD HH:mm:ss'));
            return 'success';
        });
    }
}
exports.default = TimeCheck;
