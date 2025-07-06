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
exports.setupSocket = void 0;
const http_1 = require("http");
const hormuud_1 = require("./handler/hormuud/hormuud");
const User_1 = __importDefault(require("../model/User"));
const httpServer = (0, http_1.createServer)();
const somtel_1 = require("./handler/somtel/somtel");
const express_1 = __importDefault(require("express"));
const messageHandler_1 = require("./handler/waiting/messageHandler");
const app = (0, express_1.default)();
// Attach the Express app to the HTTP server
httpServer.on('request', app);
// Socket Setup
const setupSocket = (io) => {
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('A user connected', socket.handshake.query.id);
        const deviceId = socket.handshake.query.id;
        const client = socket.id;
        const user = yield User_1.default.findDevices(deviceId, client);
        if (user !== null) {
            if (user.xaalada === 'active') {
                socket.emit('device_connected', 'connected');
                console.log({ deviceId, client });
                // user info
                socket.emit('regback', user);
                console.log('userinfo sent');
                // Hormuud evc checking
                (0, hormuud_1.hormuud)(socket, user);
                // Somtell Reseller cheking
                (0, somtel_1.somtel)(socket, user);
                // waiting cheker or repeat
                (0, messageHandler_1.handleMessage)(socket, user);
                //homedata use dashboard controller
            }
            else if (user.xaalada === 'banned') {
                socket.emit('banned', 'banned');
                console.log('Device ID is banned');
            }
            else {
                console.log('Device ID status unknown');
            }
        }
        else {
            // response to socket client
            socket.emit('regback', 'not');
            console.log('Device ID not found : ', deviceId);
        }
        socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
            const deviceId = socket.handshake.query.id;
            const client = socket.id;
            const user = yield User_1.default.findDevices(deviceId, client);
            if (user !== null) {
                yield User_1.default.deviceDisconnect(user.deviceid);
                console.log('Device ID disconnected : ', deviceId);
            }
            console.log({ deviceId, client });
        }));
    }));
};
exports.setupSocket = setupSocket;
