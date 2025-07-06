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
exports.Last5MonthsTransactions = exports.Last5WeeksTransactions = exports.Last7DaysTransactions = exports.TodayTransactions = exports.AddTransection = exports.CancledTodayTransection = exports.PendingTransection = exports.CostumerTodayTransection = exports.updateTransectionStatus = exports.DetailsTransection = exports.ListTransection = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Transection_1 = __importDefault(require("../model/Transection"));
const Costumers_1 = __importDefault(require("../model/Costumers"));
const moment_1 = __importDefault(require("moment"));
exports.ListTransection = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const transections = yield Transection_1.default.searchTransactions(req.query.searchTerm, page, req.user.user_id, limit);
    res.status(200).json({
        transections: transections
    });
}));
//details transection
exports.DetailsTransection = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transection = yield Transection_1.default.findById(parseInt(req.params.id), req.user.user_id);
    res.status(200).json(transection);
}));
//update transection status
exports.updateTransectionStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, sendTime, id } = req.body;
    const transection = yield Transection_1.default.updateTransactionStatusFrontend(parseInt(id), req.user.user_id, status, sendTime);
    res.status(200).json(transection);
}));
// costumer today transection
exports.CostumerTodayTransection = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transection = yield Transection_1.default.getTotalTransectionToday(req.user.user_id);
    res.status(200).json(transection);
}));
// pending transection
exports.PendingTransection = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transection = yield Transection_1.default.getTotalPendingTransection(req.user.user_id);
    res.status(200).json(transection);
}));
// cancled today
exports.CancledTodayTransection = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transection = yield Transection_1.default.getTodayCanceledTransactions(req.user.user_id);
    res.status(200).json(transection);
}));
// add transection
exports.AddTransection = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, customer_id, hormuud, somtel, sendTime } = req.body;
    if (!amount || !customer_id) {
        res.status(400).json({ message: 'Amounts are required' });
        return;
    }
    const costumer = yield Costumers_1.default.findCustomerByNumber(amount, hormuud, req.user.user_id);
    if (!costumer) {
        res.status(400).json({ message: 'Costumer not found' });
        return;
    }
    // Set retry count based on customer type
    const retry = costumer.macaamiil_types === 'unlimited' ? 3 : 1;
    const reff_id = costumer.reff_id ? costumer.reff_id : null;
    // Use moment.tz directly instead of converting through Date
    const Ntime = (0, moment_1.default)().tz('Africa/Mogadishu').format('YYYY-MM-DD HH:mm:ss');
    let xaalada = sendTime ? 'waiting' : 'pending';
    console.log({ xaalada });
    // Add retry count to sendData
    const sendData = Object.assign(Object.assign({}, costumer), { xaalada, retrry: retry, Ntime, sendTime: sendTime || null, reff_id });
    const findPending = yield Transection_1.default.findLastPending(somtel, req.user.user_id);
    if (findPending) {
        res.status(400).json({ message: 'Pending transection found' });
        return;
    }
    yield Transection_1.default.createTransection(sendData);
    res.status(200).json({ message: 'Transection created successfully' });
}));
// graph data 
// Get today's transactions
exports.TodayTransactions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transection_1.default.getTodayTransactions(req.user.user_id);
    if (transactions.amount === null && transactions.profit === null && transactions.transactions.length === 0) {
        res.status(200).json({ message: 'No transactions found' });
    }
    else {
        res.status(200).json(transactions);
    }
}));
// Get last 7 days transactions
exports.Last7DaysTransactions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transection_1.default.getLast7DaysTransactions(req.user.user_id);
    res.status(200).json(transactions);
}));
// Get last 5 weeks transactions
exports.Last5WeeksTransactions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transection_1.default.getLast5WeeksTransactions(req.user.user_id);
    res.status(200).json(transactions);
}));
// Get last 5 months transactions 
exports.Last5MonthsTransactions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transection_1.default.getLast5MonthsTransactions(req.user.user_id);
    res.status(200).json(transactions);
}));
