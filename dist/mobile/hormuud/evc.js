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
const hormuudFilter_1 = __importDefault(require("../../filter/hormuudFilter"));
const Costumers_1 = __importDefault(require("../../model/Costumers"));
const Amounts_1 = __importDefault(require("../../model/Amounts"));
const Msg_1 = __importDefault(require("../../model/Msg"));
const Transection_1 = __importDefault(require("../../model/Transection"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const evc = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // code here
    const { text, address } = req.body;
    const user = req.user;
    try {
        // code here
        // Ka filtaree qoraalka iyo ciwaanka loo soo diray iyadoo la isticmaalayo HormuudFilter
        const filter = yield new hormuudFilter_1.default(text, address).filter();
        // Hubi in filter-ka uusan ahayn mid eber ah
        if (filter !== null) {
            // Raadi macmiilka iyadoo la isticmaalayo nambarada iyo xogta isticmaaleha
            const send = yield Costumers_1.default.findCustomerByNumber(filter.amount, filter.hormuud, user.user_id);
            // Create time for Africa/Mogadishu timezone
            const Ntime = (0, moment_timezone_1.default)().tz("Africa/Mogadishu").format('YYYY-MM-DD HH:mm:ss');
            if (send) {
                // FIND IF PENDING
                const retry = send.macaamiil_types === 'unlimited' ? 3 : 1;
                const reff_id = send.reff_id ? send.reff_id : null;
                const SendData = Object.assign(Object.assign({}, send), { xaalada: 'pending', retrry: retry, Ntime,
                    reff_id });
                const pending = yield Transection_1.default.findLastPending(send.somtel, user.user_id);
                if (pending !== null) {
                    res.status(200).json({ message: 'Pending:', pending });
                }
                else {
                    // Samee habsocod cusub oo ku saleysan xogta la helay
                    // Samee habsocod cusub oo ku saleysan xogta la helay
                    yield Transection_1.default.createTransection(SendData);
                    yield Msg_1.default.createMessage(user.user_id, text, 'valid', send.cid, address);
                    // Dib ugu soo dir natiijada isticmaaleha adoo isticmaalaya 'socket.emit'
                    const amount = send.amount.toString().replace(/\./g, '');
                    //  const sendNow =  send.short + send.somtel + '*' + amount + '*' + send.pin + '#'
                    const response = { message: 'success' };
                    res.status(200).json(response);
                }
            }
            else {
                // Samee habsocod cusub oo ku saleysan xogta la helay
                const costumer = yield Costumers_1.default.selectCustomerByNumber(filter.hormuud, user.user_id);
                // Dib ugu soo dir natiijada
                if (costumer !== null) {
                    // Dib ugu soo dir natiijada
                    yield Msg_1.default.createMessage(user.user_id, text, 'mobile', costumer.cid, address);
                    res.status(200).json({ message: 'Mobile:' });
                }
                else {
                    // Dib ugu soo dir natiijada
                    const amount = yield Amounts_1.default.selectAmounts(user.user_id, filter.amount);
                    console.log({ user_id: user.user_id, amount: filter.amount });
                    // hadii amount oo kaga dhigan la helay
                    if (amount !== null) {
                        // Dib ugu soo dir natiijada
                        yield Msg_1.default.createMessage(user.user_id, text, 'other', 0, address);
                        res.status(200).json({ message: 'Other:' });
                    }
                }
            }
        }
    }
    catch (error) {
        // code here
        console.log('Error:', error);
        const errorResponse = { message: 'An error occurred', error: error };
        console.log('Error Response:', errorResponse);
        res.status(500).json(errorResponse);
    }
}));
exports.default = evc;
