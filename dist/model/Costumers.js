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
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("../data/knexfile"));
const db = (0, knex_1.default)(knexfile_1.default);
class Customer {
    constructor(cid, user_id, name, h_number, s_number, types, reff_id, xaalada) {
        this.cid = cid;
        this.user_id = user_id;
        this.name = name;
        this.h_number = h_number;
        this.s_number = s_number;
        this.types = types;
        this.xaalada = xaalada;
        this.reff_id = reff_id;
    }
    // Habka lagu helo macmiil iyadoo la raadinayo hormuud nambarka iyo isticmaalaha
    static findCustomerByNumber(amount, hormuud, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const MyData = [amount, hormuud, user_id].map(item => Number(item));
                const result = yield db.raw(`
                SELECT 
                m.h_number AS hormuud, 
                m.name, 
                m.types AS macaamiil_types, 
                m.s_number AS somtel, 
                m.xaalada,
                m.cid,
                m.reff_id,
                CURRENT_TIMESTAMP AS time,
                COALESCE(l.amount, '') AS amount,
                COALESCE(l.send, '') AS send, 
                COALESCE(l.types, '') AS amountTypes, 
                COALESCE(l.short, '') AS short, 
                u.pin, 
                u.user_id 
            FROM macaamiil m
            LEFT JOIN lacag l ON m.user_id = l.user_id 
                AND l.amount = ? 
                AND l.types = m.types
            JOIN user_login u ON m.user_id = u.user_id
            WHERE m.h_number = ? 
                AND u.user_id = ? 
                AND m.xaalada != 'banned'   
                AND COALESCE(l.types, '') != '';

                `, MyData);
                if (result && result[0] && result[0].length > 0) {
                    return result[0][0]; // Soo celi safka koowaad ee natiijada
                }
                else {
                    return null; // Haddii macmiil lama helin
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay helitaanka macmiilka lambarka:', error);
                throw error;
            }
        });
    }
    // Habka lagu raadsho macaamiisha iyadoo la isticmaalayo erey raadin iyo isticmaalaha
    static searchCustomers(user_id_1) {
        return __awaiter(this, arguments, void 0, function* (user_id, searchTerm = '', page = 1, limit = 10) {
            try {
                const offset = (page - 1) * limit;
                const query = db('macaamiil')
                    .select('cid', 'name', 'h_number', 's_number', 'types', 'xaalada')
                    .where('user_id', user_id)
                    .orderBy('cid', 'desc')
                    .limit(limit)
                    .offset(offset);
                if (searchTerm) {
                    query.andWhere(function () {
                        this.where('name', 'like', `%${searchTerm}%`)
                            .orWhere('h_number', 'like', `%${searchTerm}%`)
                            .orWhere('s_number', 'like', `%${searchTerm}%`);
                    });
                }
                const [customers, totalCount] = yield Promise.all([
                    query,
                    db('macaamiil').where('user_id', user_id).count('* as count').first()
                ]);
                return { customers };
            }
            catch (error) {
                console.error('Khalad ka dhacay raadinta macaamiisha:', error);
                throw error;
            }
        });
    }
    // Habka lagu xulo macmiil iyadoo la raadinayo nambarka Somtel iyo isticmaalaha
    static selectCustomerByNumber(number, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('macaamiil')
                    .select('*')
                    .where(function () {
                    this.where('s_number', number)
                        .orWhere('h_number', number);
                })
                    .andWhere('user_id', user_id)
                    .first();
                return result || null; // Soo celi macluumaadka oo dhan haddii la helo, haddii kale null
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada macmiilka lambarka:', error);
                throw error;
            }
        });
    }
    // Habka lagu abuuro macmiil cusub
    static createCustomer(user_id_1, name_1, h_number_1, s_number_1, types_1) {
        return __awaiter(this, arguments, void 0, function* (user_id, name, h_number, s_number, types, xaalada = 'active') {
            try {
                const result = yield db('macaamiil').insert({
                    user_id,
                    name,
                    h_number,
                    s_number,
                    types,
                    xaalada
                });
                if (result && result.length > 0) {
                    return { success: true, message: 'Macmiilka si guul leh ayaa loo abuuray', cid: result[0] };
                }
                else {
                    return { success: false, message: 'Waa la fashilmay in la abuuro macmiilka' };
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay abuurista macmiilka:', error);
                throw error;
            }
        });
    }
    // get by h number 
    static getCustomerByHormuud(hormuud, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('macaamiil').where({ h_number: hormuud, user_id }).first();
                return result || null;
            }
            catch (error) {
                console.error('Khalad ka dhacay cusboonaysiinta macluumaadka macmiilka:', error);
                throw error;
            }
        });
    }
    // by cid 
    static getCustomerById(cid, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('macaamiil')
                    .where({ cid: cid, user_id: user_id })
                    .first();
                return result || null; // Soo celi macluumaadka oo dhan haddii la helo, haddii kale null
            }
            catch (error) {
                console.error('Khalad ka dhacay cusboonaysiinta macluumaadka macmiilka:', error);
                throw error;
            }
        });
    }
    // Habka lagu cusbooneysiiyo macluumaadka macmiilka
    static updateCustomerInfo(user_id, cid, name, hormuud, somtel, types) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('macaamiil')
                    .where({ cid: cid, user_id: user_id })
                    .update({ h_number: hormuud, s_number: somtel, name: name, types: types });
                if (result > 0) {
                    return { success: true, message: 'Macluumaadka macmiilka si guul leh ayaa loo cusbooneysiiyey' };
                }
                else {
                    return { success: false, message: 'Macmiilka lama helin ama macluumaadka lama cusboonaysiin' };
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay cusboonaysiinta macluumaadka macmiilka:', error);
                throw error;
            }
        });
    }
    // Habka lagu cusbooneysiiyo xaalada macmiilka (active ama banned)
    static updateCustomerStatus(user_id, cid, xaalada) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (xaalada !== 'active' && xaalada !== 'banned') {
                    return { success: false, message: 'Xaalada waa inay noqotaa "active" ama "banned"' };
                }
                const result = yield db('macaamiil')
                    .where({ cid: cid, user_id: user_id })
                    .update({ xaalada });
                if (result > 0) {
                    return { success: true, message: `Xaalada macmiilka waxaa loo bedelay "${xaalada}"` };
                }
                else {
                    return { success: false, message: 'Macmiilka lama helin ama xaalada lama beddelin' };
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay cusboonaysiinta xaalada macmiilka:', error);
                throw error;
            }
        });
    }
    //  ogow tirada macmiilka dhamaan aad heesatid
    static getCustomerCount(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('macaamiil')
                    .count('cid as count')
                    .where('user_id', user_id);
                return result[0].count;
            }
            catch (error) {
                console.error('Khalad ka dhacay tirada macmiilka:', error);
                throw error;
            }
        });
    }
    // find by id 
    static findById(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('macaamiil')
                    .where('cid', id)
                    .andWhere('user_id', user_id)
                    .first();
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay cusboonaysiinta macluumaadka macmiilka:', error);
                throw error;
            }
        });
    }
}
exports.default = Customer;
