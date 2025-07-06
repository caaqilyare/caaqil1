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
exports.AddExpireTime = exports.ListUsers = exports.EditUser = exports.CreateNewUser = exports.UpdateDeviceId = exports.UpdatePin = exports.ViewProfile = void 0;
const User_1 = __importDefault(require("../model/User"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// View profile
exports.ViewProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile' });
    }
}));
// Update PIN
exports.UpdatePin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pin } = req.body;
        if (!pin) {
            res.status(400).json({ message: 'PIN is required' });
            return;
        }
        const result = yield User_1.default.updatePin(req.user.user_id, pin);
        if (result) {
            res.status(200).json({ message: 'PIN updated successfully' });
        }
        else {
            res.status(400).json({ message: 'Failed to update PIN' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating PIN' });
    }
}));
// Update device ID
exports.UpdateDeviceId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId } = req.body;
        if (!deviceId) {
            res.status(400).json({ message: 'Device ID is required' });
            return;
        }
        const result = yield User_1.default.updateDeviceId(req.user.user_id, deviceId);
        if (result) {
            res.status(200).json({ message: 'Device ID updated successfully' });
        }
        else {
            res.status(400).json({ message: 'Failed to update device ID' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating device ID' });
    }
}));
// create new user
exports.CreateNewUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_name, pin, full_name, p_number, deegaan, role, isAdmin, annknown, deviceid, telegram_id, telegram_url, client, status, balance, xaalada, isShort, lastLogin, created_at, expiretime, } = req.body;
        let Npin = pin ? pin : '0000';
        let Ndeviceid = deviceid ? deviceid : null;
        let NlastLogin = lastLogin ? lastLogin : null;
        let Nbalance = balance ? balance : '0';
        let Nstatus = status ? status : 'active';
        let Nxaalada = xaalada ? xaalada : 'active';
        let NisShort = isShort ? isShort : 'yes';
        let NisAdmin = isAdmin ? isAdmin : 'no';
        let Nrole = role ? role : 'subscriber';
        let Nclient = client ? client : 'nothing';
        let Nannknown = annknown ? annknown : 'yes';
        let Ncreated_at = created_at ? created_at : (0, moment_timezone_1.default)().tz('Africa/Mogadishu').format('YYYY-MM-DD HH:mm:ss');
        const UserData = {
            user_name,
            pin: Npin,
            full_name,
            p_number,
            deegaan,
            role: Nrole,
            isAdmin: NisAdmin,
            annknown: Nannknown,
            deviceid: Ndeviceid,
            telegram_id,
            telegram_url,
            client: Nclient,
            status: Nstatus,
            balance: Nbalance,
            xaalada: Nxaalada,
            isShort: NisShort,
            lastLogin: NlastLogin,
            created_at: Ncreated_at,
            expiretime,
        };
        const result = yield User_1.default.insertUser(UserData);
        if (result.success) {
            res.status(201).json({ message: result.message });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating new user' });
    }
}));
// edit user
exports.EditUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield User_1.default.updateUserStatus(parseInt(id), req.body.status);
        if (result.success) {
            res.status(200).json({ message: result.message });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error editing user' });
    }
}));
// admin only
// list all users
exports.ListUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_1.default.listUsers();
    res.status(200).json(result);
}));
// add expire time to user
exports.AddExpireTime = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield User_1.default.updateUserExpireTime(parseInt(id), req.body.expiretime);
        if (result.success) {
            res.status(200).json({ message: result.message });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding expire time to user' });
    }
}));
