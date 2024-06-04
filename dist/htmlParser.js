"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_AST = exports.HTML_Node = exports.BuildAst = exports.getToken = exports.getChr = exports.Tokenizer = exports.TOKEN = exports.chr = exports.TestInit = void 0;
class HTML_Node {
    constructor(tagName, className, idName) {
        this.tagName = tagName;
        this.className = className;
        this.idName = idName;
    }
}
exports.HTML_Node = HTML_Node;
class HTML_AST {
    constructor(rootNode) {
        this.rootNode = rootNode;
        this.children = [];
    }
    addNode(node) {
        this.children.push(node);
    }
    setParent(node) {
        this.parent = node;
    }
}
exports.HTML_AST = HTML_AST;
// NOTE ALWAYS MATCH THE TOKEN WITH GREATEST LENGTH
var Tokenizer;
(function (Tokenizer) {
    Tokenizer[Tokenizer["DOCTYPE"] = 0] = "DOCTYPE";
    Tokenizer[Tokenizer["LEFT_ANGLE"] = 1] = "LEFT_ANGLE";
    Tokenizer[Tokenizer["RIGHT_ANGLE"] = 2] = "RIGHT_ANGLE";
    Tokenizer[Tokenizer["CLOSE_ANGLE"] = 3] = "CLOSE_ANGLE";
    Tokenizer[Tokenizer["CLASS_DECL"] = 4] = "CLASS_DECL";
    Tokenizer[Tokenizer["ID_DECL"] = 5] = "ID_DECL";
    Tokenizer[Tokenizer["CLASS_NAME_LIST"] = 6] = "CLASS_NAME_LIST";
    Tokenizer[Tokenizer["ID_NAME_LIST"] = 7] = "ID_NAME_LIST";
    Tokenizer[Tokenizer["WORD"] = 8] = "WORD";
    Tokenizer[Tokenizer["KEY_WORD"] = 9] = "KEY_WORD";
    Tokenizer[Tokenizer["WS"] = 10] = "WS";
    Tokenizer[Tokenizer["BAD_TOKEN"] = 11] = "BAD_TOKEN";
})(Tokenizer || (exports.Tokenizer = Tokenizer = {}));
var TOKEN = null;
exports.TOKEN = TOKEN;
var chr = null;
exports.chr = chr;
var htmlString = '';
var idx = 0;
var lenStr = 0;
var valStr = '';
function getChr() {
    return htmlString[idx++];
}
exports.getChr = getChr;
function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}
function getToken() {
    exports.chr = chr = getChr();
    if (chr === '<') {
        exports.chr = chr = getChr();
        if (chr === "!") {
            valStr = '<!';
            exports.chr = chr = getChr();
            while (isAlphanumeric(chr)) {
                valStr += chr;
                exports.chr = chr = getChr();
            }
            valStr += chr;
            exports.chr = chr = getChr();
            while (isAlphanumeric(chr)) {
                valStr += chr;
                exports.chr = chr = getChr();
            }
            valStr += chr;
            if (valStr !== "<!DOCTYPE html>") {
                throw new Error(`Expected to find the word '!DOCTYPE html' but got ${valStr} instead`);
            }
            // chr = getChr();
            if (chr === '>') {
                return Tokenizer.DOCTYPE;
            }
            else {
                throw new Error(`Expected to find '>' after 'DOCTYPE' gut got ${valStr}`);
            }
        }
        exports.TOKEN = TOKEN = Tokenizer.LEFT_ANGLE;
        return;
    }
    if (isAlphanumeric(chr)) {
        valStr = chr;
        while (isAlphanumeric(chr)) {
            valStr += chr;
            exports.chr = chr = getChr();
        }
        exports.TOKEN = TOKEN = Tokenizer.WORD;
        return;
    }
    //console.log(chr.charCodeAt(0), "\n".charCodeAt(0));
    if (chr === " " || chr === "\n" || chr === "\t" || chr === '\r') {
        exports.chr = chr = getChr();
        while (chr === " " || chr === "\n" || chr === "\t" || chr === '\r') {
            exports.chr = chr = getChr();
        }
        exports.TOKEN = TOKEN = Tokenizer.WS;
        return;
    }
}
exports.getToken = getToken;
function TestInit(html) {
    exports.TOKEN = TOKEN = null;
    exports.chr = chr = null;
    idx = 0;
    lenStr = 0;
    valStr = '';
    htmlString = html;
    lenStr = htmlString.length;
}
exports.TestInit = TestInit;
function BuildAst(html) {
    htmlString = html;
    lenStr = htmlString.length;
    var RootTagname;
    var rootNode;
    getToken();
    if (TOKEN == Tokenizer.LEFT_ANGLE) {
        rootNode = new HTML_Node(valStr, '', '');
    }
    var ast = new HTML_AST(rootNode);
    return ast;
}
exports.BuildAst = BuildAst;
function start() {
    const rootNode = new HTML_Node(valStr, '', '');
    var ast = new HTML_AST(rootNode);
    return ast;
}
//# sourceMappingURL=htmlParser.js.map