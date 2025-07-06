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
class SomtelFilter {
    constructor(text, address) {
        this.text = text;
        this.address = address;
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.address == 'Reseller') {
                    const regex = /(\d{9})/;
                    const match = this.text.match(regex);
                    if (match) {
                        const phone = match[0];
                        const amountRegex = /wareejiso\s+(\d+(\.\d+)?)/;
                        const amountMatch = this.text.match(amountRegex);
                        const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
                        const balanceRegex = /Haraagaagu waa:\s+(\d+(\.\d+)?)/;
                        const balanceMatch = this.text.match(balanceRegex);
                        const balance = balanceMatch ? parseFloat(balanceMatch[1]) : null;
                        if (phone && amount !== null && balance !== null) {
                            return {
                                phone,
                                amount,
                                balance
                            };
                        }
                    }
                    return null;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = SomtelFilter;
