"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestInit = exports.getCSSToken = exports.getJsToken = exports.getCommentToken = exports.getToken = exports.JumpWhiteSpace = exports.isTxtChrs = exports.getChr = exports.isWhiteSpace = exports.col_num = exports.line_num = exports.valStr = exports.lenStr = exports.idx = exports.htmlString = exports.chr = exports.TOKEN = exports.Tokenizer = void 0;
var debugMap = {};
// NOTE THIS SHOULD ALWAYS MATCH THE TOKEN WITH GREATEST LENGTH
var Tokenizer;
(function (Tokenizer) {
    Tokenizer[Tokenizer["DOCTYPE_P1"] = 0] = "DOCTYPE_P1";
    Tokenizer[Tokenizer["LEFT_ANGLE"] = 1] = "LEFT_ANGLE";
    Tokenizer[Tokenizer["RIGHT_ANGLE"] = 2] = "RIGHT_ANGLE";
    Tokenizer[Tokenizer["SELF_CLOSE_TAG"] = 3] = "SELF_CLOSE_TAG";
    Tokenizer[Tokenizer["CLOSE_TAG"] = 4] = "CLOSE_TAG";
    Tokenizer[Tokenizer["EQUAL"] = 5] = "EQUAL";
    Tokenizer[Tokenizer["QUOTED_WORD"] = 6] = "QUOTED_WORD";
    Tokenizer[Tokenizer["CLASS_DECL"] = 7] = "CLASS_DECL";
    Tokenizer[Tokenizer["ID_DECL"] = 8] = "ID_DECL";
    Tokenizer[Tokenizer["CLASS_NAME_LIST"] = 9] = "CLASS_NAME_LIST";
    Tokenizer[Tokenizer["ID_NAME_LIST"] = 10] = "ID_NAME_LIST";
    Tokenizer[Tokenizer["WORD"] = 11] = "WORD";
    Tokenizer[Tokenizer["KEY_WORD"] = 12] = "KEY_WORD";
    Tokenizer[Tokenizer["WS"] = 13] = "WS";
    Tokenizer[Tokenizer["TEXT"] = 14] = "TEXT";
    Tokenizer[Tokenizer["BAD_TOKEN"] = 15] = "BAD_TOKEN";
    Tokenizer[Tokenizer["EOF"] = 16] = "EOF";
    Tokenizer[Tokenizer["JS_TOKEN"] = 17] = "JS_TOKEN";
    Tokenizer[Tokenizer["CSS_TOKEN"] = 18] = "CSS_TOKEN";
    Tokenizer[Tokenizer["OPEN_COM"] = 19] = "OPEN_COM";
    Tokenizer[Tokenizer["CLOSE_COM"] = 20] = "CLOSE_COM";
    Tokenizer[Tokenizer["DASH"] = 21] = "DASH";
    Tokenizer[Tokenizer["DOUBLE_QUOTE"] = 22] = "DOUBLE_QUOTE";
    Tokenizer[Tokenizer["SINGLE_QUOTE"] = 23] = "SINGLE_QUOTE";
})(Tokenizer || (exports.Tokenizer = Tokenizer = {}));
exports.TOKEN = null;
exports.chr = null;
exports.htmlString = '';
exports.idx = 0;
exports.lenStr = 0;
exports.valStr = '';
exports.line_num = 1;
exports.col_num = 0;
function isWhiteSpace(chr) {
    if (chr === '\n') {
        exports.line_num += 1;
    }
    return chr === " " || chr === "\n" || chr === "\t" || chr === '\r';
}
exports.isWhiteSpace = isWhiteSpace;
function getChr() {
    return exports.htmlString[exports.idx++];
}
exports.getChr = getChr;
// TODO: FIX THIS  !!!!!!
// export function isTxtChrs(str:string | undefined) {
//   return (str !== null && /^[a-zA-Z0-9]+$/.test(str)) || chr ==='�' || chr === '|' || chr ==='`'|| chr ==='~' ||chr ==='$' || chr=== "*" || chr === '^' || chr === "_"|| chr === "@"|| chr === ')' || chr === '(' || chr  === '?'|| chr === '!' || chr === '-' || chr === '&' || chr === ','  ||chr === '.'  || chr === ';' || chr === '%' || chr === '#'  || chr === ':'  || chr === '+' ;
// }
const notTextChar = ['>', '<', '"', "'", '/', "=", " ", "\n", "\t", "\r"];
function isTxtChrs(str) {
    return !(notTextChar.includes(str)) && exports.chr !== null;
}
exports.isTxtChrs = isTxtChrs;
function JumpWhiteSpace() {
    while (isWhiteSpace(exports.chr)) {
        exports.chr = getChr();
    }
}
exports.JumpWhiteSpace = JumpWhiteSpace;
function getToken() {
    JumpWhiteSpace();
    if (exports.idx === exports.lenStr + 1) {
        return Tokenizer.EOF;
    }
    switch (exports.chr) {
        case '/': {
            exports.chr = getChr();
            if (exports.chr === '>') {
                exports.chr = getChr();
                return Tokenizer.SELF_CLOSE_TAG;
            }
            else {
                exports.valStr = '/';
                while (isTxtChrs(exports.chr)) {
                    exports.valStr += exports.chr;
                    exports.chr = getChr();
                }
                return Tokenizer.WORD;
            }
        }
        case '<': {
            exports.valStr = '<';
            exports.chr = getChr();
            if (exports.chr === "!") {
                exports.valStr += exports.chr;
                exports.chr = getChr();
                if (exports.chr === '-') {
                    exports.chr = getChr();
                    if (exports.chr === '-') {
                        exports.chr = getChr();
                        return Tokenizer.OPEN_COM;
                    }
                    else {
                        throw new Error(`TOKEN ERROR, Expected to find '<!--' but got '<!${exports.chr}' instead.`);
                    }
                }
                // This will tokenize for 
                // the beginning doctype preamble
                while (isTxtChrs(exports.chr)) {
                    exports.valStr += exports.chr;
                    exports.chr = getChr();
                }
                exports.valStr += exports.chr; // <--- This is here to allow for the space char
                //      to be added 
                if (exports.valStr !== "<!DOCTYPE " && exports.valStr !== '<!doctype ') {
                    throw new Error(`TOKEN ERROR, Expected to find the "<!DOCTYPE " or "<!doctype " but got ${exports.valStr} instead`);
                }
                else {
                    return Tokenizer.DOCTYPE_P1;
                }
            }
            else if (exports.chr === '/') {
                exports.chr = getChr();
                return Tokenizer.CLOSE_TAG;
            }
            return Tokenizer.LEFT_ANGLE;
        }
        case '=': {
            exports.chr = getChr();
            return Tokenizer.EQUAL;
        }
        case '"': {
            exports.chr = getChr();
            return Tokenizer.DOUBLE_QUOTE;
        }
        case "'": {
            exports.chr = getChr();
            return Tokenizer.SINGLE_QUOTE;
        }
        case '>': {
            exports.chr = getChr();
            return Tokenizer.RIGHT_ANGLE;
        }
        default: {
            break;
        }
    }
    if (isTxtChrs(exports.chr)) {
        exports.valStr = exports.chr;
        exports.chr = getChr();
        while (isTxtChrs(exports.chr) && exports.chr !== undefined) {
            if (exports.chr === '-') {
                exports.chr = getChr();
                if (exports.chr !== '-') {
                    if (exports.idx === exports.lenStr) {
                        return Tokenizer.BAD_TOKEN;
                    }
                    exports.valStr += '-';
                    continue;
                }
                exports.chr = getChr();
                if (exports.chr !== '>') {
                    if (exports.idx === exports.lenStr) {
                        return Tokenizer.WORD;
                    }
                    exports.valStr += '--';
                    continue;
                }
                return Tokenizer.CLOSE_COM;
            }
            exports.valStr += exports.chr;
            if (exports.idx === exports.lenStr) {
                return Tokenizer.WORD;
            }
            exports.chr = getChr();
        }
        return Tokenizer.WORD;
    }
    exports.chr = getChr();
    return Tokenizer.BAD_TOKEN;
}
exports.getToken = getToken;
function getCommentToken() {
    while (true) {
        if (exports.chr == '-') {
            exports.chr = getChr();
            if (exports.chr === '-') {
                exports.chr = getChr();
                if (exports.chr === '>') {
                    exports.chr = getChr();
                    return Tokenizer.CLOSE_COM;
                }
            }
        }
        if (exports.idx === exports.lenStr) {
            break;
        }
        exports.chr = getChr();
    }
    return Tokenizer.EOF;
}
exports.getCommentToken = getCommentToken;
function getJsToken() {
    if (exports.chr === '<') {
        exports.chr = getChr();
        if (exports.chr === '/') {
            exports.chr = getChr();
            return Tokenizer.CLOSE_TAG;
        }
    }
    exports.chr = getChr();
    return Tokenizer.JS_TOKEN;
}
exports.getJsToken = getJsToken;
function getCSSToken() {
    if (exports.chr === '<') {
        exports.chr = getChr();
        if (exports.chr === '/') {
            exports.chr = getChr();
            return Tokenizer.CLOSE_TAG;
        }
    }
    exports.chr = getChr();
    return Tokenizer.CSS_TOKEN;
}
exports.getCSSToken = getCSSToken;
function TestInit(html) {
    exports.TOKEN = null;
    exports.idx = 0;
    exports.lenStr = 0;
    exports.valStr = '';
    exports.htmlString = html;
    exports.lenStr = exports.htmlString.length;
    exports.chr = getChr();
}
exports.TestInit = TestInit;
//# sourceMappingURL=htmlTokenizer.js.map