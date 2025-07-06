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
const dotenv_1 = __importDefault(require("dotenv"));
const grammy_1 = require("grammy");
const telegram_1 = require("./service/telegram");
dotenv_1.default.config();
const TelegramBot = () => __awaiter(void 0, void 0, void 0, function* () {
    // Bot
    const bot = new grammy_1.Bot(process.env.BOT_TOKEN);
    bot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
        console.log((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.first_name, (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.last_name, (_d = ctx.from) === null || _d === void 0 ? void 0 : _d.username, (_e = ctx.from) === null || _e === void 0 ? void 0 : _e.id);
        const telegramSocket = yield new telegram_1.TelegramSocket(ctx.from).recieveData();
        const fullName = (_f = ctx.from) === null || _f === void 0 ? void 0 : _f.first_name;
        if (telegramSocket) {
            if (telegramSocket.userInfo.xaalada === 'active') {
                ctx.reply(`Ku soo dhawoow, ${fullName}!`);
                console.log(process.env.BOT_URL + `/telegram/${telegramSocket.telegram_id}/munasar/${telegramSocket.telegram_url}/home`);
                const url = process.env.BOT_URL + `/telegram/${telegramSocket.telegram_id}/munasar/${telegramSocket.telegram_url}/home`;
                //  console.log(ctx);
                const keyboard = new grammy_1.InlineKeyboard().webApp('Launch App', url);
                setTimeout(() => {
                    return ctx.reply('Pick an app to launch .', { reply_markup: keyboard });
                }, 1000);
            }
            else {
                ctx.reply(`Ku soo dhawoow, ${fullName}!`);
                ctx.reply('Your account is not active');
                const keyboard = new grammy_1.InlineKeyboard().webApp('Launch App', `https://app.munasar.shop`);
                setTimeout(() => {
                    return ctx.reply('Pick an app to launch .', { reply_markup: keyboard });
                }, 1000);
            }
        }
        else {
            // check if username or lastname is null
            if (((_g = ctx.from) === null || _g === void 0 ? void 0 : _g.username) === undefined || ((_h = ctx.from) === null || _h === void 0 ? void 0 : _h.last_name) === undefined) {
                ctx.reply(`Ku soo dhawoow, ${fullName}!`);
                ctx.reply('SomSmart');
                ctx.reply('SomSmart waxa uu kuu sahlayaa inaad si fudud ugu shubto adeegyada Somtel adigoo isticmaalaya Hormuud EVC+. App-ku wuxuu kuu sameynayaa is-dhexgal fudud oo u oggolaanaya in lacagta si toos ah loogu wareejiyo akoonkaaga Somtel, iyada oo loo adeegsanayo adeegga Hormuud EVC+. Sidoo kale, waxaad dooran kartaa inaad si automatic ah u dirto lacag si aad ugu shubato internet-kaaga (unlimited data) ama adeegyada codka (voice bundles), iyadoo ku xiran baahidaada. Marka, halkii aad gacanta ku isticmaali lahayd adeegsiyada kala duwan, SomSmart waxa uu kuu oggolaanayaa in nidaamkaasi isagu kuu shaqeeyo si toos ah oo otomaatig ah.');
                console.log('Telegram Socket not found');
                const keyboard = new grammy_1.InlineKeyboard().webApp('Launch App', `https://app.somsmart.store`);
                setTimeout(() => {
                    return ctx.reply('Pick an app to launch .', { reply_markup: keyboard });
                }, 1000);
            }
            else {
                ctx.reply(`Ku soo dhawoow, ${(_j = ctx.from) === null || _j === void 0 ? void 0 : _j.first_name} ${(_k = ctx.from) === null || _k === void 0 ? void 0 : _k.last_name}!`);
                ctx.reply('MURAAD AI');
                ctx.reply('Muraad AI waxa uu kuu sahlayaa inaad si fudud ugu shubto adeegyada Somtel adigoo isticmaalaya Hormuud EVC+. App-ku wuxuu kuu sameynayaa is-dhexgal fudud oo u oggolaanaya in lacagta si toos ah loogu wareejiyo akoonkaaga Somtel, iyada oo loo adeegsanayo adeegga Hormuud EVC+. Sidoo kale, waxaad dooran kartaa inaad si automatic ah u dirto lacag si aad ugu shubato internet-kaaga (unlimited data) ama adeegyada codka (voice bundles), iyadoo ku xiran baahidaada. Marka, halkii aad gacanta ku isticmaali lahayd adeegsiyada kala duwan, Muraad AI waxa uu kuu oggolaanayaa in nidaamkaasi isagu kuu shaqeeyo si toos ah oo otomaatig ah.');
                const keyboard = new grammy_1.InlineKeyboard().webApp('Launch App', `https://app.munasar.shop`);
                setTimeout(() => {
                    return ctx.reply('Pick an app to launch .', { reply_markup: keyboard });
                }, 1000);
            }
        }
    }));
    bot.start();
});
exports.default = TelegramBot;
