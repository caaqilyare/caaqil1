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
exports.hormuud = hormuud;
const Costumers_1 = __importDefault(require("../../../model/Costumers"));
const hormuudFilter_1 = __importDefault(require("../../../filter/hormuudFilter"));
const Transection_1 = __importDefault(require("../../../model/Transection"));
const Msg_1 = __importDefault(require("../../../model/Msg"));
const Amounts_1 = __importDefault(require("../../../model/Amounts"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Shaqada hormuud ee la socota Socket.io si ay ula shaqeyso isticmaalaha
function hormuud(socket, user) {
    // Dhageysiga dhacdada 'evc' oo ka imanaysa isticmaalaha
    socket.on('hormuud', (e) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(e);
            // Ka filtaree qoraalka iyo ciwaanka loo soo diray iyadoo la isticmaalayo HormuudFilter
            const filter = yield new hormuudFilter_1.default(e.msg.list, e.msg.sender).filter();
            // Hubi in filter-ka uusan ahayn mid eber ah
            if (filter !== null) {
                // Raadi macmiilka iyadoo la isticmaalayo nambarada iyo xogta isticmaaleha
                const send = yield Costumers_1.default.findCustomerByNumber(filter.amount, filter.hormuud, user.user_id);
                if (send !== null) {
                    // Add timezone handling
                    const Ntime = (0, moment_timezone_1.default)().tz("Africa/Mogadishu").format('YYYY-MM-DD HH:mm:ss');
                    // Add retry and pending check logic
                    const retry = send.macaamiil_types === 'unlimited' ? 3 : 0;
                    const reff_id = send.reff_id ? send.reff_id : null;
                    const SendData = Object.assign(Object.assign({}, send), { xaalada: 'pending', retrry: retry, Ntime,
                        reff_id });
                    const pending = yield Transection_1.default.findLastPending(send.somtel, user.user_id);
                    if (pending !== null) {
                        socket.emit('rese', 'not');
                    }
                    else {
                        yield Transection_1.default.createTransection(SendData);
                        yield Msg_1.default.createMessage(user.user_id, e.msg.list, 'valid', send.cid, e.msg.sender);
                        const amount = send.send;
                        const sendNow = send.short + send.somtel + '*' + amount + '*' + send.pin + '#';
                        socket.emit('rese', sendNow);
                        console.log('evc success', send);
                    }
                }
                else {
                    // Samee habsocod cusub oo ku saleysan xogta la helay
                    const costumer = yield Costumers_1.default.selectCustomerByNumber(filter.hormuud, user.user_id);
                    // Dib ugu soo dir natiijada
                    if (costumer !== null) {
                        // Dib ugu soo dir natiijada
                        yield Msg_1.default.createMessage(user.user_id, e.msg.list, 'mobile', costumer.cid, e.msg.sender);
                        socket.emit('rese', 'not');
                    }
                    else {
                        // Dib ugu soo dir natiijada
                        const amount = yield Amounts_1.default.selectAmounts(filter.amount, user.user_id);
                        // hadii amount oo kaga dhigan la helay
                        if (amount !== null) {
                            // Dib ugu soo dir natiijada
                            yield Msg_1.default.createMessage(user.user_id, e.msg.list, 'other', 0, e.msg.sender);
                            socket.emit('rese', 'not');
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('Error in hormuud handler:', error);
            socket.emit('evc', 'not');
        }
    }));
}
