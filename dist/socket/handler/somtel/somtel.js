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
exports.somtel = somtel;
const SomtelFilter_1 = __importDefault(require("../../../filter/SomtelFilter")); // Filter-ka Somtel
const Transection_1 = __importDefault(require("../../../model/Transection")); // Fasalka Maareynta Xisaabaadka
const Msg_1 = __importDefault(require("../../../model/Msg")); // Fasalka Fariimaha
const Costumers_1 = __importDefault(require("../../../model/Costumers")); // Fasalka Macaamiisha
const User_1 = __importDefault(require("../../../model/User")); // Fasalka Maareynta Isticmaalaha
// Shaqada la socota soket-ka isticmaalaha oo loogu talagalay dhacdada Somtel
function somtel(socket, user) {
    socket.on('reseller', (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Filtaree qoraalka iyo ciwaanka
            const filter = yield new SomtelFilter_1.default(data.msg.list, data.msg.sender).filter();
            if (filter) {
                const natiijo = yield Transection_1.default.selectTransactionsBySNumber(filter.phone, user.user_id);
                if (natiijo) {
                    yield Transection_1.default.updateTransactionStatus(natiijo.id, user.user_id, 'success', '');
                    yield Msg_1.default.createMessage(user.user_id, data.msg.list, 'valid', natiijo.cos_id, data.msg.sender);
                    yield User_1.default.updateUserBalance(user.user_id, filter.balance);
                    socket.emit('resr', 'oke');
                }
                else {
                    const costumer = yield Costumers_1.default.selectCustomerByNumber(filter.phone, user.user_id);
                    if (costumer) {
                        yield User_1.default.updateUserBalance(user.user_id, filter.balance);
                        socket.emit('resr', 'not');
                    }
                    else {
                        socket.emit('resr', 'not');
                    }
                }
            }
            else {
                socket.emit('resr', 'not');
            }
        }
        catch (error) {
            socket.emit('resr', 'not');
        }
    }));
}
