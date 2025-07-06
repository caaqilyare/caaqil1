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
Object.defineProperty(exports, "__esModule", { value: true });
class HormuudFilter {
    constructor(text, address) {
        this.text = text;
        this.address = address;
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const text = this.text;
                if (text.includes("heshay")) {
                    // Regular expression to find the first amount after '$'
                    const amountRegex = /\$([\d.]+)/;
                    // Regular expression to find the phone number (assuming it's a 10-digit number)
                    const phoneRegex = /\b(\d{9,10})\b/;
                    // Extract the first amount and remove the dollar sign
                    const amountMatch = text.match(amountRegex);
                    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
                    // Extract the sender's phone number and remove the first digit
                    const phoneMatch = text.match(phoneRegex);
                    const hormuud = phoneMatch ? phoneMatch[1].slice(1) : null;
                    return {
                        amount,
                        hormuud
                    };
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error('Error in HormuudFilter:', error);
                throw error;
            }
        });
    }
}
exports.default = HormuudFilter;
