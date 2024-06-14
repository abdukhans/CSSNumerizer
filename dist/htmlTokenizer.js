"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestInit = exports.getToken = exports.JumpWhiteSpace = exports.isAlphanumeric = exports.getChr = exports.isWhiteSpace = exports.valStr = exports.lenStr = exports.idx = exports.htmlString = exports.chr = exports.TOKEN = exports.Tokenizer = void 0;
// NOTE ALWAYS MATCH THE TOKEN WITH GREATEST LENGTH
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
    Tokenizer[Tokenizer["BAD_TOKEN"] = 14] = "BAD_TOKEN";
})(Tokenizer || (exports.Tokenizer = Tokenizer = {}));
exports.TOKEN = null;
exports.chr = null;
exports.htmlString = '';
exports.idx = 0;
exports.lenStr = 0;
exports.valStr = '';
function isWhiteSpace(chr) {
    return chr === " " || chr === "\n" || chr === "\t" || chr === '\r';
}
exports.isWhiteSpace = isWhiteSpace;
function getChr() {
    return exports.htmlString[exports.idx++];
}
exports.getChr = getChr;
function isAlphanumeric(str) {
    return (str !== null && /^[a-zA-Z0-9]+$/.test(str)) || exports.chr == '-';
}
exports.isAlphanumeric = isAlphanumeric;
function JumpWhiteSpace() {
    while (isWhiteSpace(exports.chr)) {
        exports.chr = getChr();
    }
}
exports.JumpWhiteSpace = JumpWhiteSpace;
function getToken() {
    JumpWhiteSpace();
    if (exports.chr === '<') {
        exports.chr = getChr();
        if (exports.chr === "!") {
            exports.valStr = '<!';
            exports.chr = getChr();
            while (isAlphanumeric(exports.chr)) {
                exports.valStr += exports.chr;
                exports.chr = getChr();
            }
            exports.valStr += exports.chr;
            if (exports.valStr !== "<!DOCTYPE ") {
                throw new Error(`TOKEN ERROR, Expected to find the word '<!DOCTYPE ' but got ${exports.valStr} instead`);
            }
            else {
                return Tokenizer.DOCTYPE_P1;
            }
        }
        else if (exports.chr == '/') {
            exports.chr = getChr();
            return Tokenizer.CLOSE_TAG;
        }
        return Tokenizer.LEFT_ANGLE;
    }
    if (isAlphanumeric(exports.chr)) {
        exports.valStr = exports.chr;
        exports.chr = getChr();
        while (isAlphanumeric(exports.chr)) {
            exports.valStr += exports.chr;
            exports.chr = getChr();
        }
        return Tokenizer.WORD;
    }
    if (exports.chr == '>') {
        exports.chr = getChr();
        return Tokenizer.RIGHT_ANGLE;
    }
    if (exports.chr == '/') {
        exports.chr = getChr();
        if (exports.chr == '>') {
            exports.chr = getChr();
            return Tokenizer.SELF_CLOSE_TAG;
        }
        throw new Error(`TOKEN ERROR, Expected a '>' but got ${exports.chr} instead`);
    }
    if (exports.chr == '=') {
        exports.chr = getChr();
        return Tokenizer.EQUAL;
    }
    if (exports.chr == '"' || exports.chr == "'") {
        const Quote = exports.chr;
        exports.chr = getChr();
        exports.valStr = '';
        while (exports.chr !== Quote) {
            exports.valStr += exports.chr;
            exports.chr = getChr();
        }
        exports.chr = getChr();
        return Tokenizer.QUOTED_WORD;
    }
    return Tokenizer.BAD_TOKEN;
    //console.log(chr.charCodeAt(0), "\n".charCodeAt(0));
    // if(chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r'){
    //     chr = getChr();
    //     while (chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r') {
    //         chr = getChr();            
    //     }
    //     return Tokenizer.WS;
    // }   
}
exports.getToken = getToken;
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