"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_AST = exports.HTML_Node = exports.getToken = exports.getChr = exports.TOKEN = exports.chr = exports.start = exports.TestInit = void 0;
const tk = require("./htmlTokenizer");
var TOKEN;
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
        node.setParent(this);
    }
    addNodes(nodes) {
        const len = nodes.length;
        for (let idx = 0; idx < len; idx++) {
            const node = nodes[idx];
            this.addNode(node);
        }
    }
    setParent(node) {
        this.parent = node;
    }
}
exports.HTML_AST = HTML_AST;
function TestInit(html) {
    tk.TestInit(html);
}
exports.TestInit = TestInit;
// function BuildAst(html:string): HTML_AST {
//     tk.TOKEN
//     tk.htmlString = html;
//     tk.lenStr = htmlString.length;
//     var RootTagname:string ;
//     var rootNode:HTML_Node ;
//     getToken();
//     if (TOKEN == Tokenizer.LEFT_ANGLE) {
//         rootNode = new HTML_Node(tk.valStr,'','') 
//     }
//     var ast:HTML_AST = new HTML_AST(rootNode)
//     return ast;
// }
function isNotEndOfFile() {
    return tk.idx == tk.htmlString.length;
}
function html() {
    throw new Error('NOT IMPLEMENTED YET');
    const rootNode = new HTML_Node(tk.valStr, '', '');
    var ast = new HTML_AST(rootNode);
    return [ast];
}
function start() {
    const rootNode = new HTML_Node(tk.valStr, '', '');
    var ast = new HTML_AST(rootNode);
    if (tk.getToken() !== tk.Tokenizer.DOCTYPE_P1) {
        throw new Error('Syntax Error, Exected to find "DOCTYPE_P1" token');
    }
    if (tk.chr != ' ') {
        throw new Error('Syntax Error, Exected to find " " character');
    }
    exports.TOKEN = TOKEN = tk.getToken();
    if (tk.valStr !== 'html') {
        throw new Error('Syntax Error, Exected to find "html"  word');
    }
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== tk.Tokenizer.RIGHT_ANGLE) {
        throw new Error('Syntax Error, Exected to find ">"  ');
    }
    exports.TOKEN = TOKEN = tk.getToken();
    ast.addNodes(html());
    return ast;
}
exports.start = start;
const chr = tk.chr;
exports.chr = chr;
const Tokenizer = tk.Tokenizer;
const getChr = tk.getChr;
exports.getChr = getChr;
const getToken = tk.getToken;
exports.getToken = getToken;
//# sourceMappingURL=htmlParser.js.map