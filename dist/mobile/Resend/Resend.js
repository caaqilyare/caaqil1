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
class Resend {
    constructor(user) {
        this.user = user;
    }
    resend() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the last pending transaction for the user
                const pending = yield Transection_1.default.findLastPendingUnlimited(this.user.user_id);
                // If no pending transaction is found, return null
                if (!pending) {
                    return null;
                }
                // Get current retry count
                const retry = pending.retrry;
                if (retry === null) {
                    return null;
                }
                // Handle all transactions with retry > 0
                if (pending.xaalada === 'pending' && retry > 0) {
                    // Decrement retry count by 1
                    // Find the amount details based on the pending transaction
                    const amount = yield Amounts_1.default.findByAmount(pending.amount, pending.types, this.user.user_id);
                    // If amount details are not found, throw an error
                    if (!amount) {
                        throw new Error('Amount not found');
                    }
                    // Format the send amount by removing decimal points
                    const sendAmount = amount.send;
                    yield Transection_1.default.updateRetry(this.user.user_id, retry - 1, pending.id);
                    // Return the formatted string for all transactions
                    return `${amount.short}${pending.s_number}*${sendAmount}*${this.user.pin}#`;
                }
                return null;
            }
            catch (error) {
                // Log any errors that occur during the resend process
                console.error('Error in resend:', error);
                return null;
            }
        });
    }
}
exports.default = Resend;
