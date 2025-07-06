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
exports.getSelesData = exports.getHomeData = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Costumers_1 = __importDefault(require("../model/Costumers"));
const Transection_1 = __importDefault(require("../model/Transection"));
const Msg_1 = __importDefault(require("../model/Msg"));
// Get home data
exports.getHomeData = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerCount = yield Costumers_1.default.getCustomerCount(req.user.user_id);
    const transactionCount = yield Transection_1.default.getTransactionCount(req.user.user_id);
    const totalProfitAndCount = yield Transection_1.default.getTotalProfitAndCount(req.user.user_id);
    const totalSuccess = yield Transection_1.default.getTotalSuccess(req.user.user_id);
    const totalCanceled = yield Transection_1.default.getTotalCanceled(req.user.user_id);
    const totalPending = yield Transection_1.default.getTotalPending(req.user.user_id);
    const recentTransactions = yield Transection_1.default.getRecentTransactions(req.user.user_id);
    try {
        if (req.user.annknown === 'yes') {
            const mobileMessageCount = yield Msg_1.default.countMessagesByXaaladaMobile(req.user.user_id);
            const otherMessageCount = yield Msg_1.default.countMessagesByXaalada(req.user.user_id);
            res.status(200).json({
                user: req.user,
                success: totalSuccess,
                canceled: totalCanceled,
                pending: totalPending,
                mobileMessageCount: mobileMessageCount,
                otherMessageCount: otherMessageCount,
                recentTransactions: recentTransactions,
            });
        }
        else {
            res.status(200).json({
                user: req.user,
                success: totalSuccess,
                canceled: totalCanceled,
                pending: totalPending,
                recentTransactions: recentTransactions,
            });
        }
    }
    catch (error) {
        res.status(500);
        throw new Error('Server error while fetching home data');
    }
}));
// Get Seles Data 
exports.getSelesData = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Transection_1.default.getSuccessTransactionsToday(req.user.user_id);
        if (data) {
            res.status(200).json({
                data: data,
            });
        }
        else {
            res.status(200).json({
                data: 'Data not found',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: 'Server error while fetching home data',
        });
    }
}));
