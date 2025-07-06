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
class WaitListFilter {
    constructor(text, address) {
        this.text = text;
        this.address = address;
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.address === 'retry') {
                    const text = this.text;
                    const address = this.address;
                    const regex = /\d+/; // Regular expression to match digits
                    const match = text.match(regex); // Find the first match
                    return match ? match[0] : null; // Return the match or null if not found
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = WaitListFilter;
