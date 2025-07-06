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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Ku xidh xogta database-ka adiga oo isticmaalaya knex iyo qaabeynta knexConfig
const db = (0, knex_1.default)(knexfile_1.default);
class Transection {
    constructor(id, user_id, cos_id, magaca, h_number, s_number, types, amount, retrry, ref_id, profit, xaalada, sendTime, updated_at, created_at) {
        // Tilmaamayaal kaliya
        this.id = id;
        this.user_id = user_id;
        this.cos_id = cos_id;
        this.magaca = magaca;
        this.h_number = h_number;
        this.s_number = s_number;
        this.types = types;
        this.amount = amount;
        this.retrry = retrry;
        this.ref_id = ref_id;
        this.profit = profit;
        this.xaalada = xaalada;
        this.sendTime = sendTime;
        this.updated_at = updated_at;
        this.created_at = created_at;
    }
    // Habka lagu abuuro habsocod cusub oo la geliyo database-ka
    static createTransection(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get current date/time in Africa/Mogadishu timezone
            const time = (0, moment_timezone_1.default)().tz('Africa/Mogadishu').format('YYYY-MM-DD HH:mm:ss');
            try {
                // Xisaabinta faa'iidada iyadoo lagu saleynayo 18% ka mid ah lacagta
                let totalInvestment = 100; // Lacagta aad maalgelisay
                let totalReceived = 118; // Lacagta aad heshay
                let totalProfit = totalReceived - totalInvestment; // Faa'iidada guud
                let profitPercentage = (totalProfit / totalInvestment) * 100; // Boqolkiiba faa'iidada
                let amountToSell = data.amount; // Lacagta aad iibinayso
                // Faa'iidada halkii dollar
                let profitPerDollar = totalProfit / totalReceived;
                let Nref_id = data.reff_id ? data.reff_id : 0;
                let NewXaalada = data.xaalada ? data.xaalada : data.types === 'unlimited' ? 'waiting' : 'pending';
                let NewSendTime = data.sendTime ? data.sendTime : time;
                // Faa'iidada iibinta $5
                let profitOnSale = profitPerDollar * amountToSell;
                const result = yield db('natiijo').insert({
                    user_id: data.user_id, // Aqoonsiga isticmaaleha
                    cos_id: data.cid, // Aqoonsiga macaamiisha
                    magaca: data.name, // Magaca isticmaaleha ama macaamiisha
                    h_number: data.hormuud, // Nambarka Hormuud
                    s_number: data.somtel, // Nambarka Somtel
                    types: data.macaamiil_types, // Nooca macluumaadka ama adeegga
                    amount: data.amount, // Lacagta
                    profit: profitOnSale.toFixed(2), // Faa'iidada la xisaabiyay
                    retrry: data.retrry,
                    ref_id: Nref_id,
                    xaalada: NewXaalada, // Xaaladda habsocodka oo lagu qeexay 'pending'
                    sendTime: NewSendTime, // Waqtiga la abuuray habsocodka
                    updated_at: data.Ntime, // Waqtiga la abuuray habsocodka
                    created_at: data.Ntime // Waqtiga la abuuray habsocodka
                });
                return result;
            }
            catch (error) {
                console.error(error); // Haddii khalad dhaco, waa in la daabacaa
                return null;
            }
        });
    }
    // Habka lagu raadiyey habsocodka iyadoo la adeegsanayo magaca, h_number, ama s_number
    static searchTransactions() {
        return __awaiter(this, arguments, void 0, function* (searchTerm = '', page = 1, user_id, limit = 40) {
            try {
                const offset = (page - 1) * limit;
                const query = db('natiijo')
                    .select('*')
                    .where('user_id', user_id)
                    .orderBy('updated_at', 'desc')
                    .limit(limit)
                    .offset(offset);
                if (searchTerm) {
                    query.andWhere(function () {
                        this.where('magaca', 'like', `%${searchTerm}%`)
                            .orWhere('h_number', 'like', `%${searchTerm}%`)
                            .orWhere('s_number', 'like', `%${searchTerm}%`);
                    });
                }
                const result = yield query;
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay raadinta habsocodka:', error);
                throw error;
            }
        });
    }
    // Habka lagu cusbooneysiinayo xaaladda habsocodka
    static updateTransactionStatus(transactionId, user_id, newStatus, sendTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = (0, moment_timezone_1.default)().tz('Africa/Mogadishu').format('YYYY-MM-DD HH:mm:ss');
            try {
                if (newStatus !== 'success' && newStatus !== 'canceled' && newStatus !== 'waiting' && newStatus !== 'pending') {
                    throw new Error('Xaaladda waa inay noqotaa "success" ama "canceled" ama "waiting" ama "pending"');
                }
                if (sendTime === '') {
                    sendTime = time;
                }
                const result = yield db('natiijo')
                    .where({
                    id: transactionId,
                    user_id: user_id
                })
                    .update({ xaalada: newStatus, updated_at: time, sendTime: sendTime });
                if (result > 0) {
                    return { success: true, message: `Xaaladda habsocodka waxaa loo bedelay "${newStatus}"` };
                }
                else {
                    return { success: false, message: 'Habsocodka lama helin ama xaaladda lama beddelin' };
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay cusboonaysiinta xaaladda habsocodka:', error);
                throw error;
            }
        });
    }
    // Habka lagu cusbooneysiinayo xaaladda habsocodka
    static updateTransactionStatusFrontend(transactionId, user_id, newStatus, sendTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = (0, moment_timezone_1.default)().tz('Africa/Mogadishu').format('YYYY-MM-DD HH:mm:ss');
            let retrry = 0;
            if (newStatus === 'waiting') {
                retrry = 1;
            }
            else {
                retrry = 0;
            }
            try {
                if (newStatus !== 'success' && newStatus !== 'canceled' && newStatus !== 'waiting' && newStatus !== 'pending') {
                    throw new Error('Xaaladda waa inay noqotaa "success" ama "canceled" ama "waiting" ama "pending"');
                }
                if (sendTime === '') {
                    sendTime = time;
                }
                const result = yield db('natiijo')
                    .where({
                    id: transactionId,
                    user_id: user_id
                })
                    .update({ xaalada: newStatus, updated_at: time, sendTime: sendTime, retrry: retrry });
                if (result > 0) {
                    return { success: true, message: `Xaaladda habsocodka waxaa loo bedelay "${newStatus}"` };
                }
                else {
                    return { success: false, message: 'Habsocodka lama helin ama xaaladda lama beddelin' };
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay cusboonaysiinta xaaladda habsocodka:', error);
                throw error;
            }
        });
    }
    // Habka lagu xulayo habsocodka iyadoo la adeegsanayo s_number
    static selectTransactionsBySNumber(s_number, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .select('*')
                    .where({
                    s_number,
                    user_id
                })
                    .whereIn('xaalada', ['pending', 'waiting'])
                    .first();
                return result || null;
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada habsocodka s_number:', error);
                throw error;
            }
        });
    }
    // dhaqdhaqa dhamaan aad heesatid
    static getTransactionCount(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .count('id as count')
                    .where('user_id', user_id);
                return result[0].count;
            }
            catch (error) {
                console.error('Khalad ka dhacay tirada habsocodka:', error);
                throw error;
            }
        });
    }
    // find by id 
    static findById(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .where('id', id)
                    .first();
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay habsocodka id:', error);
                throw error;
            }
        });
    }
    // so hel dhamaan dhaqdhaqaaqa maanta profit and total count
    static getTotalProfitAndCount(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const result = yield db('natiijo')
                    .select(db.raw('SUM(profit) as totalProfit'), db.raw('SUM(amount) as totalAmount'), db.raw('COUNT(id) as count'))
                    .where('user_id', user_id)
                    .andWhere('created_at', '>=', today);
                return result[0];
            }
            catch (error) {
                console.error('Khalad ka dhacay dhaqdhaqaaqa maanta profit, amount, and total count:', error);
                throw error;
            }
        });
    }
    // total pending only
    static getTotalPending(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const result = yield db('natiijo')
                    .count('id as count')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'pending')
                    .andWhere('created_at', '>=', today);
                return result[0];
            }
            catch (error) {
                console.error('Khalad ka dhacay xisaabinta dhaqdhaqaaqa pending:', error);
                throw error;
            }
        });
    }
    // total transection today list
    static getTotalTransectionToday(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const result = yield db('natiijo')
                    .select('*')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'success')
                    .andWhere('created_at', '>=', today)
                    .orderBy('created_at', 'desc');
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay dhaqdhaqaaqa maanta ee success:', error);
                throw error;
            }
        });
    }
    // total success only
    static getTotalSuccess(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const result = yield db.raw(`
                SELECT SUM(profit) as totalProfit, SUM(amount) as totalAmount, COUNT(id) as count
                FROM natiijo
                WHERE user_id = ? AND xaalada = 'success' AND created_at >= ?
            `, [user_id, today]);
                return result[0];
            }
            catch (error) {
                console.error('Khalad ka dhacay dhaqdhaqaaqa maanta ee success:', error);
                throw error;
            }
        });
    }
    // total canceled only
    static getTotalCanceled(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const result = yield db('natiijo')
                    .select(db.raw('COUNT(*) as count'))
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'canceled')
                    .andWhere('created_at', '>=', today);
                return result[0];
            }
            catch (error) {
                console.error('Khalad ka dhacay dhaqdhaqaaqa maanta ee canceled:', error);
                throw error;
            }
        });
    }
    // get recent 5 transactions
    static getRecentTransactions(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .select('*')
                    .where('user_id', user_id)
                    .orderBy('created_at', 'desc')
                    .limit(8);
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay dhaqdhaqaaqa maanta ee recent transactions:', error);
                throw error;
            }
        });
    }
    // find s_number  success by number and user_id
    static findSNumberSuccess(s_number, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .where('s_number', s_number)
                    .andWhere('user_id', user_id)
                    .andWhere('xaalada', 'success')
                    .orderBy('id', 'desc')
                    .first();
                if (result) {
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada habsocodka s_number:', error);
                throw error;
            }
        });
    }
    // find last pending by s_number
    static findLastPending(s_number, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .where('s_number', s_number)
                    .andWhere('xaalada', 'pending')
                    .select('*')
                    .first();
                if (result) {
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada habsocodka s_number:', error);
                throw error;
            }
        });
    }
    // check if pending transaction is there only unlimeted
    static findLastPendingUnlimited(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield db('natiijo')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'pending')
                    .select('*');
                if (results.length > 0) {
                    const randomIndex = Math.floor(Math.random() * results.length);
                    return results[randomIndex];
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada habsocodka pending unlimited:', error);
                throw error;
            }
        });
    }
    // check if waitning transaction is there
    static findLastPendingWait(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'waiting')
                    .select('*');
                if (result.length > 0) {
                    const randomIndex = Math.floor(Math.random() * result.length);
                    return result[randomIndex];
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada habsocodka pending wait:', error);
                throw error;
            }
        });
    }
    //  check random pending with retrry is low then 1
    // check if waitning transaction is there
    static findLastPendingWaitRetry(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'pending')
                    .andWhere('retrry', '<', 1)
                    .select('*');
                if (result.length > 0) {
                    const randomIndex = Math.floor(Math.random() * result.length);
                    return result[randomIndex];
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada habsocodka pending wait retry:', error);
                throw error;
            }
        });
    }
    // find last waiting with current time lower then sendtime
    static findLastWaitingWithCurrentTimeLowerThenSendTime(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = (0, moment_timezone_1.default)().tz('Africa/Mogadishu').format('YYYY-MM-DD HH:mm:ss');
                const result = yield db('natiijo')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'waiting')
                    .andWhere('sendTime', '<', currentTime)
                    .select('*')
                    .first();
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada habsocodka waiting with current time lower then sendtime:', error);
                throw error;
            }
        });
    }
    // Get success transection today
    static getSuccessTransactionsToday(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const result = yield db('natiijo')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'success')
                    .andWhere('created_at', '>=', today)
                    .select('*');
                if (result.length > 0) {
                    return result;
                }
                else {
                    // log
                    return null;
                }
            }
            catch (error) {
                console.error('Khalad ka dhacay dhaqdhaqaaqa maanta ee success:', error);
                return error;
            }
        });
    }
    // pending trnas 
    static getTotalPendingTransection(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'pending')
                    .orWhere('xaalada', 'waiting')
                    .select('*');
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada dhaqdhaqaaqa pending:', error);
                throw error;
            }
        });
    }
    // cancled transection
    static getTodayCanceledTransactions(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const result = yield db('natiijo')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'canceled')
                    .andWhere('created_at', '>=', today)
                    .select('*');
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada dhaqdhaqaaqa canceled ee maanta:', error);
                throw error;
            }
        });
    }
    // waiting transection
    static getTodayWaitingTransactions(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const result = yield db('natiijo')
                    .where('user_id', user_id)
                    .andWhere('xaalada', 'waiting')
                    .select('*');
                return result.length > 0 ? result : null;
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada dhaqdhaqaaqa waiting ee maanta:', error);
                throw error;
            }
        });
    }
    // graph data
    // Get today's transactions
    static getTodayTransactions(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .select(db.raw('COUNT(id) as customers'), db.raw('SUM(amount) as amount'), db.raw('SUM(profit) as profit'))
                    .where('user_id', user_id)
                    .whereRaw('created_at > CURDATE()');
                return result[0];
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada dhaqdhaqaaqa maanta:', error);
                throw error;
            }
        });
    }
    // Get last 7 days transactions
    static getLast7DaysTransactions(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .select(db.raw('DATE(created_at) as date'), db.raw('COUNT(id) as customers'), db.raw('SUM(amount) as amount'), db.raw('SUM(profit) as profit'))
                    .where('user_id', user_id)
                    .whereRaw('created_at >= CURDATE() - INTERVAL 7 DAY')
                    .groupByRaw('DATE(created_at)')
                    .orderBy('date', 'desc');
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada dhaqdhaqaaqa 7 maalmood:', error);
                throw error;
            }
        });
    }
    // Get last 5 weeks transactions 
    static getLast5WeeksTransactions(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .select(db.raw("CONCAT(YEAR(created_at), '-W', WEEK(created_at, 1)) as week"), db.raw('COUNT(id) as customers'), db.raw('SUM(amount) as amount'), db.raw('SUM(profit) as profit'))
                    .where('user_id', user_id)
                    .whereRaw('created_at >= CURDATE() - INTERVAL 5 WEEK')
                    .groupByRaw('week')
                    .orderBy('week', 'desc');
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada dhaqdhaqaaqa 5 todobaad:', error);
                throw error;
            }
        });
    }
    // Get last 5 months transactions
    static getLast5MonthsTransactions(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('natiijo')
                    .select(db.raw("DATE_FORMAT(created_at, '%Y-%m') as month"), db.raw('COUNT(id) as customers'), db.raw('SUM(amount) as amount'), db.raw('SUM(profit) as profit'))
                    .where('user_id', user_id)
                    .whereRaw("created_at >= DATE_FORMAT(CURDATE() - INTERVAL 5 MONTH, '%Y-%m-01')")
                    .groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
                    .orderBy('month', 'desc');
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada dhaqdhaqaaqa 5 bilood:', error);
                throw error;
            }
        });
    }
    // check if retry is there
    // update retrry
    static updateRetry(user_id, retry, id) {
        return __awaiter(this, void 0, void 0, function* () {
            // try and catch
            try {
                const result = yield db('natiijo').where('user_id', user_id).andWhere('id', id).update({ retrry: retry });
                return result;
            }
            catch (error) {
                console.error('Khalad ka dhacay xulashada habsocodka retry:', error);
                throw error;
            }
        });
    }
}
exports.default = Transection; // Dhoofinta fasalka Transection si loo isticmaalo meel kale
