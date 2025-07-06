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
const Amounts_1 = __importDefault(require("../../model/Amounts"));
const Transection_1 = __importDefault(require("../../model/Transection"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class CheckWait {
    constructor(user) {
        this.user = user;
    }
    normalizeAmount(amount) {
        // Convert amount to number and back to string to remove trailing zeros
        return parseFloat(amount).toString();
    }
    checkTime() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = (0, moment_timezone_1.default)().tz('Africa/Mogadishu').format('YYYY-MM-DD HH:mm:ss');
                const lastWaiting = yield Transection_1.default.findLastWaitingWithCurrentTimeLowerThenSendTime(this.user.user_id);
                if (!lastWaiting) {
                    return null;
                }
                // Update transaction status to pending
                yield Transection_1.default.updateTransactionStatus(lastWaiting.id, this.user.user_id, 'pending', currentTime);
                console.log('Transaction status updated to pending');
                return lastWaiting;
            }
            catch (error) {
                console.error('Error checking time:', error);
                console.error('Error details:', error instanceof Error ? error.message : error);
                return null;
            }
        });
    }
    checkRetry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = (0, moment_timezone_1.default)();
                const lastPendingWaitRetry = yield Transection_1.default.findLastPendingWaitRetry(this.user.user_id);
                if (!lastPendingWaitRetry) {
                    return null;
                }
                const lastTransaction = yield Transection_1.default.findSNumberSuccess(lastPendingWaitRetry.s_number, this.user.user_id);
                if (!lastTransaction) {
                    return null;
                }
                const normalizedAmount = this.normalizeAmount(lastTransaction.amount);
                const lastAmount = yield Amounts_1.default.findByAmount(normalizedAmount, lastPendingWaitRetry.types, this.user.user_id);
                if (!lastAmount) {
                    return null;
                }
                const hoursToAdd = lastAmount.time_days; // Hours directly from time_days
                const lastSuccessDate = (0, moment_timezone_1.default)(lastTransaction.updated_at || lastTransaction.created_at).add(hoursToAdd, 'hours');
                if (currentTime.isAfter(lastSuccessDate) && lastPendingWaitRetry.xaalada === 'pending') {
                    yield Transection_1.default.updateRetry(this.user.user_id, 3, lastPendingWaitRetry.id);
                    const sendTime = (0, moment_timezone_1.default)().add(2, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                    yield Transection_1.default.updateTransactionStatus(lastPendingWaitRetry.id, this.user.user_id, 'waiting', sendTime);
                    return 'Added 2 min to waiting';
                }
                else {
                    yield Transection_1.default.updateRetry(this.user.user_id, 3, lastPendingWaitRetry.id);
                    yield Transection_1.default.updateTransactionStatus(lastPendingWaitRetry.id, this.user.user_id, 'waiting', lastSuccessDate.format('YYYY-MM-DD HH:mm:ss'));
                    return `Added to waiting list ${lastSuccessDate.format('YYYY-MM-DD HH:mm:ss')}`;
                }
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.default = CheckWait;
