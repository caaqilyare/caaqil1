"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines the routes for user-related functionality in the application.
 *
 * - GET /api/users/home: Retrieves the home data for the authenticated user.
 * - GET /api/users/messages: Retrieves messages for the authenticated user.
 * - GET /api/users/transactions: Retrieves transactions for the authenticated user.
 * - GET /api/users/customers: Retrieves customers for the authenticated user.
 * - POST /api/users/customers: Adds a new customer for the authenticated user.
 *
 * All routes are protected by the AuthMiddleware, which ensures that only authenticated users can access these endpoints.
 */
const express_1 = __importDefault(require("express"));
const dashboard_1 = require("../controllers/dashboard");
const AuthMiddlewar_1 = __importDefault(require("../middlewares/AuthMiddlewar"));
const transectionController_1 = require("../controllers/transectionController");
const CostumerController_1 = require("../controllers/CostumerController");
const router = express_1.default.Router();
const AmountController_1 = require("../controllers/AmountController");
const MsgController_1 = require("../controllers/MsgController");
const userController_1 = require("../controllers/userController");
const userController_2 = require("../controllers/userController");
const userController_3 = require("../controllers/userController");
const AdminMiddleWare_1 = __importDefault(require("../middlewares/AdminMiddleWare"));
// Messages Routes
// Get all messages
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/messages/:category').get(AuthMiddlewar_1.default, MsgController_1.GetAllMsg);
// Get message by xaalada
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/messages/xaalada/:xaalada').get(AuthMiddlewar_1.default, MsgController_1.GetMsgByXaalada);
// Get message details
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/messages/view/:id').get(AuthMiddlewar_1.default, MsgController_1.DetailsMsg);
// Update message by cos_id
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/messages/update/:id').put(AuthMiddlewar_1.default, MsgController_1.UpdateMsgByCosId);
// Delete message
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/messages/delete/:id').delete(AuthMiddlewar_1.default, MsgController_1.DeleteMsg);
// Delete messages by status
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/messages/delete/xaalada/:xaalada').delete(AuthMiddlewar_1.default, MsgController_1.DeleteMsgByXaalada);
// Home Route
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/home').get(AuthMiddlewar_1.default, dashboard_1.getHomeData);
// Transaction Routes
// Get all transactions
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions').get(AuthMiddlewar_1.default, transectionController_1.ListTransection);
// Get transaction details
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/view/:id').get(AuthMiddlewar_1.default, transectionController_1.DetailsTransection);
// Update transaction status
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/:id/status').put(AuthMiddlewar_1.default, transectionController_1.updateTransectionStatus);
// Get customer transactions for today
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/customer/today/success').get(AuthMiddlewar_1.default, transectionController_1.CostumerTodayTransection);
// Get pending transactions
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/pending/today').get(AuthMiddlewar_1.default, transectionController_1.PendingTransection);
// Get cancelled transactions for today
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/cancelled/today').get(AuthMiddlewar_1.default, transectionController_1.CancledTodayTransection);
// Add new transaction
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/add/transection').post(AuthMiddlewar_1.default, transectionController_1.AddTransection);
// graph data
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/customer/today').get(AuthMiddlewar_1.default, transectionController_1.TodayTransactions);
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/graph/7days').get(AuthMiddlewar_1.default, transectionController_1.Last7DaysTransactions);
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/graph/5weeks').get(AuthMiddlewar_1.default, transectionController_1.Last5WeeksTransactions);
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/transactions/graph/5months').get(AuthMiddlewar_1.default, transectionController_1.Last5MonthsTransactions);
// Customer Routes
// Get all customers
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/costumers').get(AuthMiddlewar_1.default, CostumerController_1.getCostumer);
// Get customer details
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/costumers/view/:id').get(AuthMiddlewar_1.default, CostumerController_1.DetailsCostumer);
// Add new customer
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/costumers/add/costomer').post(AuthMiddlewar_1.default, CostumerController_1.addCostumer);
// Update customer details
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/costumers/update/:id').put(AuthMiddlewar_1.default, CostumerController_1.updateCostumer);
// Update customer status
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/costumers/status/change').put(AuthMiddlewar_1.default, CostumerController_1.updateCostumerStatus);
// Amount Routes
// Add amount
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/amounts/add/new').post(AuthMiddlewar_1.default, AmountController_1.AddAmount);
// Get all amounts
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/amounts').get(AuthMiddlewar_1.default, AmountController_1.ListAmounts);
// Get amount types
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/amount/types/:types').get(AuthMiddlewar_1.default, AmountController_1.SelectAmountType);
// Edit types
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/amount/types/edit/:id').put(AuthMiddlewar_1.default, AmountController_1.EditTypes);
// Delete types
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/amount/types/delete/:id').delete(AuthMiddlewar_1.default, AmountController_1.DeleteTypes);
// User Routes
// View profile
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/profile').get(AuthMiddlewar_1.default, userController_1.ViewProfile);
// Update PIN
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/profile/update/pin').put(AuthMiddlewar_1.default, userController_3.UpdatePin);
// Update device ID
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/profile/update/deviceid').put(AuthMiddlewar_1.default, userController_2.UpdateDeviceId);
// admin routes
// add new user
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/admin/add/user').post(AuthMiddlewar_1.default, AdminMiddleWare_1.default, userController_1.CreateNewUser);
// edit user
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/admin/edit/user/:id').put(AuthMiddlewar_1.default, AdminMiddleWare_1.default, userController_1.EditUser);
// add expire time to user
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/admin/add/expiretime/:id').put(AuthMiddlewar_1.default, AdminMiddleWare_1.default, userController_1.AddExpireTime);
// list all users
router.route('/user/telegram/:telegram_id/munasar/:telegram_url/admin/list/users').get(AuthMiddlewar_1.default, AdminMiddleWare_1.default, userController_1.ListUsers);
//
exports.default = router;
