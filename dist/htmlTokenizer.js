"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = exports.Token = void 0;
var debugMap = {};
// NOTE THIS SHOULD ALWAYS MATCH THE TOKEN WITH GREATEST LENGTH
var Token;
(function (Token) {
    Token[Token["DOCTYPE_P1"] = 0] = "DOCTYPE_P1";
    Token[Token["LEFT_ANGLE"] = 1] = "LEFT_ANGLE";
    Token[Token["RIGHT_ANGLE"] = 2] = "RIGHT_ANGLE";
    Token[Token["SELF_CLOSE_TAG"] = 3] = "SELF_CLOSE_TAG";
    Token[Token["CLOSE_TAG"] = 4] = "CLOSE_TAG";
    Token[Token["EQUAL"] = 5] = "EQUAL";
    Token[Token["QUOTED_WORD"] = 6] = "QUOTED_WORD";
    Token[Token["CLASS_DECL"] = 7] = "CLASS_DECL";
    Token[Token["ID_DECL"] = 8] = "ID_DECL";
    Token[Token["CLASS_NAME_LIST"] = 9] = "CLASS_NAME_LIST";
    Token[Token["ID_NAME_LIST"] = 10] = "ID_NAME_LIST";
    Token[Token["WORD"] = 11] = "WORD";
    Token[Token["KEY_WORD"] = 12] = "KEY_WORD";
    Token[Token["WS"] = 13] = "WS";
    Token[Token["TEXT"] = 14] = "TEXT";
    Token[Token["BAD_TOKEN"] = 15] = "BAD_TOKEN";
    Token[Token["EOF"] = 16] = "EOF";
    Token[Token["JS_TOKEN"] = 17] = "JS_TOKEN";
    Token[Token["CSS_TOKEN"] = 18] = "CSS_TOKEN";
    Token[Token["OPEN_COM"] = 19] = "OPEN_COM";
    Token[Token["CLOSE_COM"] = 20] = "CLOSE_COM";
    Token[Token["DASH"] = 21] = "DASH";
    Token[Token["DOUBLE_QUOTE"] = 22] = "DOUBLE_QUOTE";
    Token[Token["SINGLE_QUOTE"] = 23] = "SINGLE_QUOTE";
})(Token || (exports.Token = Token = {}));
const notTextChar = ['>', '<', '"', "'", '/', "=", " ", "\n", "\t", "\r"];
class Tokenizer {
    constructor() {
        this.TOKEN = null;
        this.chr = null;
        this.htmlString = '';
        this.idx = 0;
        this.lenStr = 0;
        this.valStr = '';
        this.line_num = 1;
        this.col_num = 0;
        this.TOKEN = null;
        this.idx = 0;
        this.lenStr = 0;
        this.valStr = '';
        this.htmlString;
        this.lenStr = this.htmlString.length;
        this.chr = this.getChr();
    }
    Init(html) {
        this.TOKEN = null;
        this.idx = 0;
        this.lenStr = 0;
        this.valStr = html;
        this.htmlString = html;
        this.lenStr = this.htmlString.length;
        this.chr = this.getChr();
    }
    isWhiteSpace(chr) {
        if (chr === '\n') {
            this.line_num += 1;
        }
        return chr === " " || chr === "\n" || chr === "\t" || chr === '\r';
    }
    getChr() {
        return this.htmlString[this.idx++];
    }
    JumpWhiteSpace() {
        while (this.isWhiteSpace(this.chr)) {
            this.chr = this.getChr();
        }
    }
    isTxtChrs(str) {
        return !(notTextChar.includes(str)) && str !== null;
    }
    getToken() {
        this.JumpWhiteSpace();
        if (this.idx === this.lenStr + 1) {
            return Token.EOF;
        }
        switch (this.chr) {
            case '/': {
                this.chr = this.getChr();
                if (this.chr === '>') {
                    this.chr = this.getChr();
                    return Token.SELF_CLOSE_TAG;
                }
                else {
                    this.valStr = '/';
                    while (this.isTxtChrs(this.chr)) {
                        this.valStr += this.chr;
                        this.chr = this.getChr();
                    }
                    return Token.WORD;
                }
            }
            case '<': {
                this.valStr = '<';
                this.chr = this.getChr();
                if (this.chr === "!") {
                    this.valStr += this.chr;
                    this.chr = this.getChr();
                    if (this.chr === '-') {
                        this.chr = this.getChr();
                        if (this.chr === '-') {
                            this.chr = this.getChr();
                            return Token.OPEN_COM;
                        }
                        else {
                            throw new Error(`TOKEN ERROR, Expected to find '<!--' but got '<!${this.chr}' instead.`);
                        }
                    }
                    // This will tokenize for 
                    // the beginning doctype preamble
                    while (this.isTxtChrs(this.chr)) {
                        this.valStr += this.chr;
                        this.chr = this.getChr();
                    }
                    this.valStr += this.chr; // <--- This is here to allow for the space char
                    //      to be added 
                    if (this.valStr !== "<!DOCTYPE " && this.valStr !== '<!doctype ') {
                        throw new Error(`TOKEN ERROR, Expected to find the "<!DOCTYPE " or "<!doctype " but got ${this.valStr} instead`);
                    }
                    else {
                        return Token.DOCTYPE_P1;
                    }
                }
                else if (this.chr === '/') {
                    this.chr = this.getChr();
                    return Token.CLOSE_TAG;
                }
                return Token.LEFT_ANGLE;
            }
            case '=': {
                this.chr = this.getChr();
                return Token.EQUAL;
            }
            case '"': {
                this.chr = this.getChr();
                return Token.DOUBLE_QUOTE;
            }
            case "'": {
                this.chr = this.getChr();
                return Token.SINGLE_QUOTE;
            }
            case '>': {
                this.chr = this.getChr();
                return Token.RIGHT_ANGLE;
            }
            default: {
                break;
            }
        }
        if (this.isTxtChrs(this.chr)) {
            this.valStr = this.chr;
            this.chr = this.getChr();
            while (this.isTxtChrs(this.chr) && this.chr !== undefined) {
                if (this.chr === '-') {
                    this.chr = this.getChr();
                    if (this.chr !== '-') {
                        if (this.idx === this.lenStr) {
                            return Token.BAD_TOKEN;
                        }
                        this.valStr += '-';
                        continue;
                    }
                    this.chr = this.getChr();
                    if (this.chr !== '>') {
                        if (this.idx === this.lenStr) {
                            return Token.WORD;
                        }
                        this.valStr += '--';
                        continue;
                    }
                    return Token.CLOSE_COM;
                }
                this.valStr += this.chr;
                if (this.idx === this.lenStr) {
                    return Token.WORD;
                }
                this.chr = this.getChr();
            }
            return Token.WORD;
        }
        this.chr = this.getChr();
        return Token.BAD_TOKEN;
    }
    getCommentToken() {
        // TODO: FIX THIS !!!!!!!!!!!!!! make it more readable
        while (true) {
            if (this.chr == '-') {
                this.chr = this.getChr();
                if (this.chr === '-') {
                    this.chr = this.getChr();
                    if (this.chr === '>') {
                        this.chr = this.getChr();
                        return Token.CLOSE_COM;
                    }
                }
            }
            if (this.idx === this.lenStr) {
                break;
            }
            this.chr = this.getChr();
        }
        return Token.EOF;
    }
    getJsToken() {
        if (this.chr === '<') {
            this.chr = this.getChr();
            if (this.chr === '/') {
                this.chr = this.getChr();
                return Token.CLOSE_TAG;
            }
        }
        this.chr = this.getChr();
        return Token.JS_TOKEN;
    }
}
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=htmlTokenizer.js.map