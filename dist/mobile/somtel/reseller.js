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
const SomtelFilter_1 = __importDefault(require("../../filter/SomtelFilter"));
const Costumers_1 = __importDefault(require("../../model/Costumers"));
const Msg_1 = __importDefault(require("../../model/Msg"));
const Transection_1 = __importDefault(require("../../model/Transection"));
const User_1 = __importDefault(require("../../model/User"));
const reseller = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { text, address } = req.body;
    try {
        // Filtaree qoraalka iyo ciwaanka iyadoo la isticmaalayo SomtelFilter
        const filter = yield new SomtelFilter_1.default(text, address).filter();
        // Haddii filter-ka uu yahay sax
        if (filter) {
            // Raadso xisaabihii la isticmaalay iyadoo loo marayo nambarka taleefanka
            const natiijo = yield Transection_1.default.selectTransactionsBySNumber(filter.phone, user.user_id);
            // Haddii xisaab la helay
            if (natiijo) {
                // Cusboonaysii xaalada xisaabta in ay tahay 'success'
                yield Transection_1.default.updateTransactionStatus(natiijo.id, user.user_id, 'success', '');
                // Abuur fariin cusub oo ku saabsan xisaabta
                yield Msg_1.default.createMessage(user.user_id, text, 'valid', natiijo.cos_id, address);
                // Cusboonaysii lacagta isticmaalaha iyadoo la raacayo xogta la helay
                yield User_1.default.updateUserBalance(user.user_id, filter.balance);
                // Dib ugu dir jawaab ahaan isticmaalaha xaalad guuleysatay
                res.status(200).json('success');
            }
            else {
                // Haddii xisaab aan la helin, raadso macmiilka lambarka taleefanka
                const costumer = yield Costumers_1.default.selectCustomerByNumber(filter.phone, user.user_id);
                if (costumer) {
                    // Haddii macmiil la helay, cusboonaysii lacagta isticmaalaha
                    yield User_1.default.updateUserBalance(user.user_id, filter.balance);
                    // Dib ugu dir jawaab ka turjumaysa in aan diiwaangashaneyn
                    res.status(200).json('not_valid');
                }
            }
        }
    }
    catch (error) {
        res.status(500).json('error');
    }
}));
exports.default = reseller;
