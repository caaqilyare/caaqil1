"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing Modules
const server_1 = require("./socket/server");
// const start_1 = __importDefault(require("./Telegram/start"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const mobileRoute_1 = __importDefault(require("./routes/mobileRoute"));
const ErrorMiddleWare_1 = require("./middlewares/ErrorMiddleWare");
const socket_io_1 = require("socket.io");
// Express App
const app = (0, express_1.default)();
// Express JS
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api', userRoute_1.default);
app.use('/mobile', mobileRoute_1.default);
// Static Files
// const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../frontend/dist/index.html")));
}
else {
    app.get("*", (req, res) => res.send("App is in development mode"));
}
// Error Middleware
app.use(ErrorMiddleWare_1.ErrorMiddleWare.NotFound);
app.use(ErrorMiddleWare_1.ErrorMiddleWare.ErrorHandler);
// Telegram Bot
// (0, start_1.default)();
// Create HTTP server with Express
const httpServer = require('http').createServer(app);
// Initialize Socket.IO
const io = new socket_io_1.Server(httpServer);
// Setup Socket.IO handlers
(0, server_1.setupSocket)(io);
// Start the server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
