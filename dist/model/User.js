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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class User {
    constructor(user_id, user_name, pin, user_password, full_name, p_number, deegaan, isAdmin, annknown, telegram_id, telegram_url, isShort, created_at, expiretime, role = 'subscriber', deviceid = null, client = null, status = null, balance = null, xaalada = 'no', lastLogin = null) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.pin = pin;
        this.user_password = user_password;
        this.full_name = full_name;
        this.p_number = p_number;
        this.deegaan = deegaan;
        this.role = role;
        this.isAdmin = isAdmin;
        this.annknown = annknown;
        this.deviceid = deviceid;
        this.telegram_id = telegram_id;
        this.telegram_url = telegram_url;
        this.client = client;
        this.status = status;
        this.balance = balance;
        this.xaalada = xaalada;
        this.isShort = isShort;
        this.lastLogin = lastLogin;
        this.created_at = created_at;
        this.expiretime = expiretime;
    }
    // find user by device id
    static findByDeviceId(deviceid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db('user_login').where({ deviceid }).first();
                if (user) {
                    return user;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Error finding user by Device ID:', error);
                throw error;
            }
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db('user_login').where({ id }).first();
                if (user) {
                    return user;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Error finding user by ID:', error);
                throw error;
            }
        });
    }
    // find devices
    static findDevices(deviceid, client) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db('user_login').where({ deviceid }).first();
                if (user) {
                    const currentTime = new Date();
                    if (currentTime > user.expiretime) {
                        yield db('user_login')
                            .where({ deviceid })
                            .update({ xaalada: 'banned' });
                        console.log(`User with device ID ${deviceid} has been banned due to expiration.`);
                        return Object.assign(Object.assign({}, user), { xaalada: 'banned' });
                    }
                    else {
                        yield db('user_login')
                            .where({ deviceid })
                            .update({ lastLogin: currentTime, status: 'online', client });
                        console.log(`User with device ID ${deviceid} has logged in and is now online.`);
                        return Object.assign(Object.assign({}, user), { lastLogin: currentTime, status: 'online' });
                    }
                }
                return null;
            }
            catch (error) {
                console.error('Error finding user by Device ID:', error);
                throw error;
            }
        });
    }
    // device disconnect
    static deviceDisconnect(deviceid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = new Date();
                const updatedUser = yield db('user_login')
                    .where({ deviceid })
                    .update({
                    status: 'offline',
                    lastLogin: currentTime,
                })
                    .returning('*');
                if (updatedUser.length > 0) {
                    console.log(`User with device ID ${deviceid} has disconnected and is now offline.`);
                    return updatedUser[0];
                }
                else {
                    console.log(`No user found with device ID ${deviceid}`);
                    return null;
                }
            }
            catch (error) {
                console.error('Error updating user disconnect status:', error);
                throw error;
            }
        });
    }
    // search users by username
    static searchUsersByUsername(searchTerm_1) {
        return __awaiter(this, arguments, void 0, function* (searchTerm, limit = 40) {
            try {
                const users = yield db('user_login')
                    .select('user_id', 'user_name', 'email', 'status', 'xaalada')
                    .where('user_name', 'like', `%${searchTerm}%`)
                    .orderBy('user_id', 'desc')
                    .limit(limit);
                return users;
            }
            catch (error) {
                console.error('Error searching users by username:', error);
                throw error;
            }
        });
    }
    // admin only
    // insert new user
    static insertUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('user_login').insert(userData);
                if (result) {
                    return { success: true, message: 'User inserted successfully' };
                }
                else {
                    return { success: false, message: 'Failed to insert user' };
                }
            }
            catch (error) {
                console.error('Error inserting new user:', error);
                throw error;
            }
        });
    }
    // find user by telegram id
    static findUserByTelegramId(telegram_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db('user_login').where({ telegram_id }).first();
                return user;
            }
            catch (error) {
                console.error('Error finding user by Telegram ID:', error);
                throw error;
            }
        });
    }
    // update telegram url
    static updateTelegramUrl(userId, telegram_url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('user_login')
                    .where('user_id', userId)
                    .update({ telegram_url });
                if (result > 0) {
                    return { success: true, message: `Telegram URL updated successfully` };
                }
                else {
                    return { success: false, message: 'User not found or Telegram URL not updated' };
                }
            }
            catch (error) {
                console.error('Error updating Telegram URL:', error);
                throw error;
            }
        });
    }
    // admin only
    // update user status
    static updateUserStatus(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('user_login')
                    .where('user_id', userId)
                    .update({ xaalada: status });
                if (result > 0) {
                    return { success: true, message: `User status updated to "${status}"` };
                }
                else {
                    return { success: false, message: 'User not found or status not updated' };
                }
            }
            catch (error) {
                console.error('Error updating user status:', error);
                throw error;
            }
        });
    }
    // admin only
    // update user expire time
    static updateUserExpireTime(userId, expireDays) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = new Date();
                const newExpirationDate = new Date(currentTime);
                newExpirationDate.setDate(newExpirationDate.getDate() + expireDays);
                const result = yield db('user_login')
                    .where('user_id', userId)
                    .update({ expireTime: newExpirationDate, xaalada: 'active' });
                if (result > 0) {
                    return { success: true, message: `User expiration time updated to ${expireDays} days from now` };
                }
                else {
                    return { success: false, message: 'User not found or expiration time not updated' };
                }
            }
            catch (error) {
                console.error('Error updating user expiration time:', error);
                throw error;
            }
        });
    }
    // admin only
    // list all users
    static listUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield db('user_login').select('*');
                return users;
            }
            catch (error) {
                console.error('Error listing users:', error);
                throw error;
            }
        });
    }
    // update user balance
    static updateUserBalance(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('user_login')
                    .where('user_id', userId)
                    .update('balance', amount);
                if (result > 0) {
                    const updatedUser = yield db('user_login')
                        .where('user_id', userId)
                        .first('balance');
                    return {
                        success: true,
                        message: `User balance updated successfully`,
                        newBalance: updatedUser.balance
                    };
                }
                else {
                    return { success: false, message: 'User not found or balance not updated' };
                }
            }
            catch (error) {
                console.error('Error updating user balance:', error);
                throw error;
            }
        });
    }
    // update device id
    static updateDeviceId(userId, deviceid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('user_login').where('user_id', userId).update({ deviceid });
                return result;
            }
            catch (error) {
                console.error('Error updating device ID:', error);
                throw error;
            }
        });
    }
    // update pin
    static updatePin(userId, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db('user_login').where('user_id', userId).update({ pin });
                return result;
            }
            catch (error) {
                console.error('Error updating pin:', error);
                throw error;
            }
        });
    }
    // update last login
    static updateLastLogin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Ntime = (0, moment_timezone_1.default)().tz("Africa/Mogadishu").format('YYYY-MM-DD HH:mm:ss');
            try {
                const result = yield db('user_login').where('user_id', userId).update({ lastLogin: Ntime });
                return result;
            }
            catch (error) {
                console.error('Error updating last login:', error);
                throw error;
            }
        });
    }
}
exports.default = User;
