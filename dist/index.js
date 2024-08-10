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
exports.test_init = exports.fetch_html = exports.htmlParser = exports.Token = exports.Tokenizer = void 0;
const node_fetch_1 = require("node-fetch");
const htmlParser = require("./htmlParser");
exports.htmlParser = htmlParser;
const htmlTokenizer_1 = require("./htmlTokenizer");
Object.defineProperty(exports, "Tokenizer", { enumerable: true, get: function () { return htmlTokenizer_1.Tokenizer; } });
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return htmlTokenizer_1.Token; } });
const fetch_html = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, node_fetch_1.default)(url, {
        method: "GET",
    });
    const text = yield res.text();
    return text;
});
exports.fetch_html = fetch_html;
const test_init = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield fetch_html(url);
    htmlParser.TestInit(html);
});
exports.test_init = test_init;
//# sourceMappingURL=index.js.map