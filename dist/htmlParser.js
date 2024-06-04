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
    Tokenizer[Tokenizer["DOCTYPE_P1"] = 0] = "DOCTYPE_P1";
    Tokenizer[Tokenizer["DOCTYPE_P2"] = 1] = "DOCTYPE_P2";
    Tokenizer[Tokenizer["LEFT_ANGLE"] = 2] = "LEFT_ANGLE";
    Tokenizer[Tokenizer["RIGHT_ANGLE"] = 3] = "RIGHT_ANGLE";
    Tokenizer[Tokenizer["CLOSE_ANGLE"] = 4] = "CLOSE_ANGLE";
    Tokenizer[Tokenizer["CLASS_DECL"] = 5] = "CLASS_DECL";
    Tokenizer[Tokenizer["ID_DECL"] = 6] = "ID_DECL";
    Tokenizer[Tokenizer["CLASS_NAME_LIST"] = 7] = "CLASS_NAME_LIST";
    Tokenizer[Tokenizer["ID_NAME_LIST"] = 8] = "ID_NAME_LIST";
    Tokenizer[Tokenizer["WORD"] = 9] = "WORD";
    Tokenizer[Tokenizer["KEY_WORD"] = 10] = "KEY_WORD";
    Tokenizer[Tokenizer["WS"] = 11] = "WS";
    Tokenizer[Tokenizer["BAD_TOKEN"] = 12] = "BAD_TOKEN";
})(Tokenizer || (exports.Tokenizer = Tokenizer = {}));
var TOKEN = null;
exports.TOKEN = TOKEN;
var chr = null;
exports.chr = chr;
var htmlString = '';
var idx = 0;
var lenStr = 0;
var valStr = '';
function isWhiteSpace(chr) {
    return chr === " " || chr === "\n" || chr === "\t" || chr === '\r';
}
function getChr() {
    return htmlString[idx++];
}
exports.getChr = getChr;
function isAlphanumeric(str) {
    return str !== null && /^[a-zA-Z0-9]+$/.test(str);
}
function JumpWhiteSpace() {
    while (isWhiteSpace(chr)) {
        exports.chr = chr = getChr();
    }
}
function getToken() {
    JumpWhiteSpace();
    if (chr === '<') {
        exports.chr = chr = getChr();
        if (chr === "!") {
            valStr = '<!';
            exports.chr = chr = getChr();
            while (isAlphanumeric(chr)) {
                valStr += chr;
                exports.chr = chr = getChr();
            }
            if (valStr !== "<!DOCTYPE") {
                throw new Error(`Expected to find the word '<!DOCTYPE' but got ${valStr} instead`);
            }
            else {
                return Tokenizer.DOCTYPE_P1;
            }
        }
    }
    if (chr == 'h') {
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
    exports.TOKEN = TOKEN = null;
    idx = 0;
    lenStr = 0;
    valStr = '';
    htmlString = html;
    lenStr = htmlString.length;
    exports.chr = chr = getChr();
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