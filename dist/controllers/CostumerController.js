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
exports.updateCostumerStatus = exports.DetailsCostumer = exports.updateCostumer = exports.addCostumer = exports.getCostumer = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Costumers_1 = __importDefault(require("../model/Costumers"));
exports.getCostumer = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.searchTerm;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    try {
        const costumers = yield Costumers_1.default.searchCustomers(req.user.user_id, query, page, limit);
        res.status(200).json(costumers);
    }
    catch (error) {
        console.error('Error in getCostumer:', error);
        if (error instanceof Error) {
            if (error.message.includes('ECONNRESET')) {
                res.status(503).json({ message: 'Database connection error', error: 'Unable to connect to the database. Please try again later.' });
            }
            else {
                res.status(500).json({ message: 'Failed to get customers', error: error.message });
            }
        }
        else {
            res.status(500).json({ message: 'Failed to get customers', error: 'An unknown error occurred' });
        }
    }
}));
// add costumer
exports.addCostumer = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, hormuud, somtel, types } = req.body;
    const findCostumer = yield Costumers_1.default.getCustomerByHormuud(hormuud, req.user.user_id);
    if (findCostumer) {
        res.status(400).json({ message: 'Costumer already exists' });
        return;
    }
    else {
        const costumer_id = yield Costumers_1.default.createCustomer(req.user.user_id, name, hormuud, somtel, types, 'active');
        res.status(201).json({
            message: name ? `${name}, waxa uu ku biiray liiska macaamiisha! 🎉🔥` : 'Macaamiilka waxa uu ku biiray liiska macaamiisha! 🎉🔥',
            costumer_id: costumer_id
        });
    }
}));
// update costumer
exports.updateCostumer = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, h_number, s_number, cid, types } = req.body;
    const costumer = yield Costumers_1.default.updateCustomerInfo(req.user.user_id, cid, name, h_number, s_number, types);
    res.status(200).json({
        message: 'Costumer updated successfully'
    });
}));
// details costumer 
exports.DetailsCostumer = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid costumer ID' });
        return;
    }
    const costumer = yield Costumers_1.default.findById(id, req.user.user_id);
    if (!costumer) {
        res.status(404).json({ message: 'Costumer not found' });
        return;
    }
    res.status(200).json({
        costumer
    });
}));
// update costumer status
exports.updateCostumerStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cid, status } = req.body;
    yield Costumers_1.default.updateCustomerStatus(req.user.user_id, cid, status);
    res.status(200).json({
        message: 'Costumer status updated successfully'
    });
}));
