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
class Amounts {
    constructor(id, types, amount, send, short, status, user_id, time_days) {
        this.id = id;
        this.types = types;
        this.amount = amount;
        this.send = send;
        this.short = short;
        this.status = status;
        this.user_id = user_id;
        this.time_days = time_days;
    }
    static createAmount(data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [id] = yield db('lacag').insert(Object.assign(Object.assign({}, data), { status: data.status || 'active', user_id: user_id }));
                return id;
            }
            catch (error) {
                console.error('Khalad ka dhacay abuurista xadiga:', error);
                throw error;
            }
        });
    }
    static updateAmount(id, user_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('lacag')
                    .where({ id, user_id })
                    .update(data);
                return result > 0;
            }
            catch (error) {
                console.error('Khalad ka dhacay cusboonaysiinta xadiga:', error);
                throw error;
            }
        });
    }
    static deleteAmount(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('lacag')
                    .where({ id, user_id })
                    .del();
                return result > 0;
            }
            catch (error) {
                console.error('Khalad ka dhacay tirtiridda xadiga:', error);
                throw error;
            }
        });
    }
    static selectAmounts(user_id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('lacag')
                    .select('*')
                    .where({
                    user_id: user_id,
                })
                    .andWhere({ amount: amount })
                    .orderBy('id', 'desc');
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay fariin cusub:', error);
                throw error;
            }
        });
    }
    static selectAllAmounts(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('lacag')
                    .select('*')
                    .where({ user_id: user_id })
                    .orderBy('id', 'desc');
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay soo saarista dhammaan xadiyada:', error);
                throw error;
            }
        });
    }
    // find by amount with types only one
    static findByAmount(amount, types, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('lacag')
                    .select('*')
                    .where({ amount, types, user_id })
                    .first();
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay fariin cusub:', error);
                throw error;
            }
        });
    }
    // select amount types
    static selectAmountTypes(user_id, types) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('lacag')
                    .select('*')
                    .where({ user_id, types })
                    .distinct('types');
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay fariin cusub:', error);
                throw error;
            }
        });
    }
    //Edit types
    static editTypes(user_id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, types, amount, short, time_days, status, send } = body;
            const result = yield db('lacag')
                .where({ id, user_id })
                .update({ types, amount, short, time_days, status, send });
            if (result) {
                return { message: 'Amount types updated successfully' };
            }
            else {
                return { message: 'Failed to update amount types' };
            }
        });
    }
    // delete types
    static deleteTypes(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db('lacag')
                .where({ id, user_id })
                .del();
            return result > 0;
        });
    }
}
exports.default = Amounts;
