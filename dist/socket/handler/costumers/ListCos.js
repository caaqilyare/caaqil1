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
exports.handleListeners = handleListeners;
exports.setupListCos = setupListCos;
const Costumers_1 = __importDefault(require("../../../model/Costumers"));
function handleListeners(socket, user) {
    socket.on('listmacaamiil', (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            const customers = yield Costumers_1.default.searchCustomers(data.search, user.user_id, data.page, data.limit);
            if (customers.customers.length > 0) {
                socket.emit('listmacaamiil_response', customers);
            }
            else {
                socket.emit('listmacaamiil_response', []);
            }
            // console.log(customers)
        }
        catch (error) {
            console.error('Error fetching customers:', error);
            socket.emit('listmacaamiil_error', 'An error occurred while fetching customers');
        }
    }));
    socket.on('view_customer', (customerId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const customer = yield Costumers_1.default.getCustomerById(customerId, user.user_id);
            socket.emit('view_customer_response', customer);
        }
        catch (error) {
            console.error('Error fetching customer details:', error);
            socket.emit('view_customer_error', 'An error occurred while fetching customer details');
        }
    }));
}
function setupListCos(socket, user) {
    handleListeners(socket, user);
}
