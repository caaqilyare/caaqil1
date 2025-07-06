"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMobile_1 = __importDefault(require("../middlewares/AuthMobile"));
const dashboard_1 = require("../controllers/dashboard");
const evc_1 = __importDefault(require("../mobile/hormuud/evc"));
const reseller_1 = __importDefault(require("../mobile/somtel/reseller"));
const waiting_1 = __importDefault(require("../mobile/waiting/waiting"));
const router = (0, express_1.Router)();
// Dashboard
router.route("/home/:link").get(AuthMobile_1.default, dashboard_1.getHomeData);
// Send EVC
router.route("/send/:link").post(AuthMobile_1.default, evc_1.default);
// Recieve Reseller
router.route("/somtel/:link").post(AuthMobile_1.default, reseller_1.default);
// Waiting List
router.route("/waiting/:link").post(AuthMobile_1.default, waiting_1.default);
// today transection    
router.route("/success/:link").post(AuthMobile_1.default, dashboard_1.getSelesData);
// export default router;
exports.default = router;
