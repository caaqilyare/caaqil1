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
exports.DeleteTypes = exports.EditTypes = exports.ListAmounts = exports.SelectAmountType = exports.AddAmount = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Amounts_1 = __importDefault(require("../model/Amounts"));
// add amount
exports.AddAmount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = yield Amounts_1.default.createAmount(req.body, req.user.user_id);
    res.status(200).json(amount);
}));
// select amount type
exports.SelectAmountType = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const types = req.params.types;
    const amount = yield Amounts_1.default.selectAmountTypes(req.user.user_id, types);
    res.status(200).json(amount);
}));
// List Amounts
exports.ListAmounts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amounts = yield Amounts_1.default.selectAllAmounts(req.user.user_id);
    res.status(200).json(amounts);
}));
// Edit types
exports.EditTypes = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield Amounts_1.default.editTypes(req.user.user_id, req.body);
    if (types) {
        res.status(200).json({ message: 'Amount types updated successfully' });
    }
    else {
        res.status(400).json({ message: 'Failed to update amount types' });
    }
}));
// Delete types
exports.DeleteTypes = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield Amounts_1.default.deleteTypes(parseInt(req.params.id), req.user.user_id);
    res.status(200).json(types);
}));
