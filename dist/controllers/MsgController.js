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
exports.DeleteMsgByXaalada = exports.DeleteMsg = exports.UpdateMsgByCosId = exports.DetailsMsg = exports.GetMsgByXaalada = exports.GetAllMsg = void 0;
const Msg_1 = __importDefault(require("../model/Msg"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// Get all messages by sender category
exports.GetAllMsg = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.searchTerm;
    const params = req.params.category;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    try {
        const getMsg = yield Msg_1.default.getAllMessages(req.user.user_id, query, params, page, limit);
        res.status(200).json(getMsg);
    }
    catch (error) {
        console.error('Error in GetAllMsg:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get messages', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to get messages', error: 'An unknown error occurred' });
        }
    }
}));
// Get message by xaalada
exports.GetMsgByXaalada = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const xaalada = req.params.xaalada;
    const getMsg = yield Msg_1.default.getMessagesByXaalada(xaalada, req.user.user_id);
    res.status(200).json(getMsg);
}));
// Details Msg
exports.DetailsMsg = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const msg = yield Msg_1.default.viewMessageById(parseInt(req.params.id, 10), req.user.user_id);
        res.status(200).json(msg);
    }
    catch (error) {
        console.error('Error in DetailsMsg:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get message', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to get message', error: 'An unknown error occurred' });
        }
    }
}));
// update message by cos_id
exports.UpdateMsgByCosId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cos_id, message_id } = req.body;
    yield Msg_1.default.updateMessageByCosId(cos_id, req.user.user_id, message_id);
    res.status(200).json({ message: 'Message updated successfully' });
}));
// Delete Msg
exports.DeleteMsg = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Msg_1.default.deleteMessageById(parseInt(req.params.id, 10), req.user.user_id);
        res.status(200).json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.error('Error in DeleteMsg:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete message', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to delete message', error: 'An unknown error occurred' });
        }
    }
}));
// Delete Msg By Xaalada
exports.DeleteMsgByXaalada = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Msg_1.default.deleteMessagesByXaalada(req.params.xaalada, req.user.user_id);
        res.status(200).json({ message: 'Messages deleted successfully' });
    }
    catch (error) {
        console.error('Error in DeleteMsgByXaalada:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete messages', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to delete messages', error: 'An unknown error occurred' });
        }
    }
}));
