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
    Tokenizer[Tokenizer["LEFT_ANGLE"] = 0] = "LEFT_ANGLE";
    Tokenizer[Tokenizer["RIGHT_ANGLE"] = 1] = "RIGHT_ANGLE";
    Tokenizer[Tokenizer["CLOSE_ANGLE"] = 2] = "CLOSE_ANGLE";
    Tokenizer[Tokenizer["CLASS_DECL"] = 3] = "CLASS_DECL";
    Tokenizer[Tokenizer["ID_DECL"] = 4] = "ID_DECL";
    Tokenizer[Tokenizer["CLASS_NAME_LIST"] = 5] = "CLASS_NAME_LIST";
    Tokenizer[Tokenizer["ID_NAME_LIST"] = 6] = "ID_NAME_LIST";
    Tokenizer[Tokenizer["WORD"] = 7] = "WORD";
    Tokenizer[Tokenizer["KEY_WORD"] = 8] = "KEY_WORD";
    Tokenizer[Tokenizer["WS"] = 9] = "WS";
    Tokenizer[Tokenizer["BAD_TOKEN"] = 10] = "BAD_TOKEN";
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
    exports.chr = chr = htmlString[idx++];
}
exports.getChr = getChr;
function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}
function getToken() {
    getChr();
    if (chr === '<') {
        exports.TOKEN = TOKEN = Tokenizer.LEFT_ANGLE;
        return;
    }
    if (isAlphanumeric(chr)) {
        valStr = chr;
        while (isAlphanumeric(chr)) {
            valStr += chr;
            getChr();
        }
        exports.TOKEN = TOKEN = Tokenizer.WORD;
        return;
    }
    console.log(chr.charCodeAt(0), "\n".charCodeAt(0));
    if (chr === " " || chr === "\n" || chr === "\t" || chr === '\r') {
        getChr();
        while (chr === " " || chr === "\n" || chr === "\t" || chr === '\r') {
            getChr();
        }
        exports.TOKEN = TOKEN = Tokenizer.WS;
        return;
    }
}
exports.getToken = getToken;
function TestInit(html) {
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
//# sourceMappingURL=htmlParser.js.map