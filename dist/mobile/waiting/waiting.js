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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const WaitList_1 = __importDefault(require("../../filter/WaitList"));
const Resend_1 = __importDefault(require("../Resend/Resend"));
const CheckWait_1 = __importDefault(require("./CheckWait"));
const getWaitingList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, address } = req.body;
        const filter = new WaitList_1.default(text, address);
        const result = yield filter.filter();
        // Try resend first to check pending transactions
        const resendResult = yield new Resend_1.default(req.user).resend();
        if (resendResult) {
            res.status(200).json({
                status: 'resend',
                data: resendResult,
                message: 'Transaction resended'
            });
            return;
        }
        // Then check waiting status
        // Then check retry status
        const checkRetryResult = yield new CheckWait_1.default(req.user).checkRetry();
        if (checkRetryResult) {
            res.status(200).json({
                status: 'retry',
                message: checkRetryResult
            });
            return;
        }
        const checkWaitResult = yield new CheckWait_1.default(req.user).checkTime();
        if (checkWaitResult) {
            res.status(200).json({
                status: 'ready',
                data: checkWaitResult,
                message: 'Transaction ready to process'
            });
            return;
        }
        // if all are not working do nothing
        res.status(200).json({
            status: 'idle',
            message: 'No pending actions'
        });
    }
    catch (error) {
        console.error('Error in getWaitingList:', error);
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'An error occurred while processing the request'
        });
    }
}));
exports.default = getWaitingList;
