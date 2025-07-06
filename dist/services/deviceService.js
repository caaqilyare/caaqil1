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
exports.checkXaaladaStatus = exports.getDeviceById = void 0;
const User_1 = __importDefault(require("../model/User"));
const getDeviceById = (deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const device = yield User_1.default.findById(deviceId);
        return device ? device.devices[0] : null;
    }
    catch (error) {
        console.error('Error fetching device by ID:', error);
        throw new Error('Error fetching device by ID');
    }
});
exports.getDeviceById = getDeviceById;
const checkXaaladaStatus = (deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const device = yield (0, exports.getDeviceById)(deviceId);
        if (device) {
            return {
                isActive: device.xaalada === 'active',
                isBanned: device.isBanned
            };
        }
        else {
            return {
                isActive: false,
                isBanned: false
            };
        }
    }
    catch (error) {
        console.error('Error checking xaalada status:', error);
        throw new Error('Error checking xaalada status');
    }
});
exports.checkXaaladaStatus = checkXaaladaStatus;
