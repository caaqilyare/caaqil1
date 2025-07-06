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
class Msgs {
    constructor(id, user_id, sender, body, xaalada, cos_id, created_at) {
        this.id = id;
        this.user_id = user_id;
        this.sender = sender;
        this.body = body;
        this.xaalada = xaalada;
        this.cos_id = cos_id;
        this.created_at = created_at;
    }
    // Hel dhammaan fariimaha isticmaale gaar ah oo ay ku jiraan raadinta erey gaar ah
    static getAllMessages(user_id_1) {
        return __awaiter(this, arguments, void 0, function* (user_id, searchTerm = '', sender, page = 1, limit = 10) {
            try {
                const offset = (page - 1) * limit;
                const messages = yield db('msgs')
                    .where({ user_id })
                    .andWhere('body', 'like', `%${searchTerm}%`)
                    .andWhere({ sender })
                    .select('*')
                    .limit(limit)
                    .offset(offset)
                    .orderBy('created_at', 'desc');
                const totalCount = yield db('msgs')
                    .where({ user_id })
                    .andWhere('body', 'like', `%${searchTerm}%`)
                    .andWhere({ sender })
                    .count('* as count')
                    .first();
                if (!totalCount) {
                    throw new Error('Failed to retrieve total count');
                }
                const count = totalCount.count;
                const totalPages = Math.ceil(count / limit);
                return messages;
            }
            catch (error) {
                console.error('Khalad ka dhacay helitaanka dhammaan fariimaha:', error);
                throw error;
            }
        });
    }
    // Hel fariin gaar ah iyadoo la raadinayo aqoonsiga fariinta iyo isticmaalaha
    static viewMessageById(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield db('msgs')
                    .where({ id, user_id })
                    .first();
                return message || null; // Soo celi fariinta ama null haddii aan la helin
            }
            catch (error) {
                console.error('Khalad ka dhacay helitaanka fariin gaar ah:', error);
                throw error;
            }
        });
    }
    // Get message by xaalada
    static getMessagesByXaalada(xaalada, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield db('msgs').where({ xaalada, user_id }).select('*').orderBy('id', 'desc');
                return messages;
            }
            catch (error) {
                console.error('Khalad ka dhacay helitaanka fariin xaalada:', error);
                throw error;
            }
        });
    }
    // Tirtir fariin gaar ah iyadoo la isticmaalayo aqoonsiga fariinta iyo isticmaalaha
    static deleteMessageById(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('msgs')
                    .where({ id, user_id })
                    .del();
                return result > 0; // Soo celi in ay tirtirashada guulaysatay ama fashilantay
            }
            catch (error) {
                console.error('Khalad ka dhacay tirtiridda fariin gaar ah:', error);
                throw error;
            }
        });
    }
    // Tirtir dhammaan fariimaha xaalad gaar ah leh ee isticmaalaha
    static deleteMessagesByXaalada(xaalada, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('msgs')
                    .where({ xaalada, user_id })
                    .del();
                return result > 0; // Soo celi haddii tirtiridda guulaysatay
            }
            catch (error) {
                console.error('Khalad ka dhacay tirtiridda fariimaha xaalad gaar ah:', error);
                throw error;
            }
        });
    }
    // Abuur fariin cusub oo la xiriirta isticmaalaha
    static createMessage(user_id, text, xaalada, cos_id, sender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('msgs').insert({
                    sender,
                    user_id,
                    body: text,
                    xaalada,
                    cos_id,
                    created_at: new Date()
                });
                if (result && result.length > 0) {
                    return { success: true, message: 'Fariin cusub ayaa si guul leh loo abuuray', id: result[0] };
                }
                else {
                    return { success: false, message: 'Waa la fashilmay in la abuuro fariinta' };
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay abuurista fariinta:', error);
                throw error;
            }
        });
    }
    // count xaalada = other
    static countMessagesByXaalada(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('msgs')
                    .where({ user_id, xaalada: 'other' })
                    .count('id as count')
                    .first();
                return result ? result.count : 0;
            }
            catch (error) {
                console.error('Khalad ka dhacay tirinta fariimaha xaalad "other":', error);
                throw error;
            }
        });
    }
    // count xaalada by mobile 
    static countMessagesByXaaladaMobile(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('msgs')
                    .where({ user_id, xaalada: 'mobile' })
                    .count('id as count')
                    .first();
                return result ? result.count : 0;
            }
            catch (error) {
                console.error('Khalad ka dhacay tirinta fariimaha xaalad "mobile":', error);
                throw error;
            }
        });
    }
    // update message by cos_id
    static updateMessageByCosId(cos_id, user_id, message_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (cos_id !== null || cos_id !== 0) {
                    yield db('msgs').where({ id: message_id, user_id }).update({ cos_id });
                    return { success: true, message: 'Fariinta uu updated' };
                }
                else {
                    return { success: false, message: 'Waa la fashilmay in la update fariinta' };
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay update fariinta:', error);
                throw error;
            }
        });
    }
}
exports.default = Msgs;
