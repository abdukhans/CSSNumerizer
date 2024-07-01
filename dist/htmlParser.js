"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_AST = exports.HTML_Node = exports.getToken = exports.getChr = exports.TOKEN = exports.chr = exports.start = exports.TestInit = void 0;
var tk = require("./htmlTokenizer");
var TOKEN;
var HTML_Node = /** @class */ (function () {
    function HTML_Node(tagName, className, idName) {
        this.tagName = tagName;
        this.className = className;
        this.idName = idName;
        this.specialRoot = false;
        HTML_Node.obj_id += 1;
        this.objNum = HTML_Node.obj_id;
    }
    HTML_Node.prototype.setClassName = function (newClassName) {
        this.className = newClassName;
    };
    HTML_Node.prototype.getObjId = function () {
        return this.objNum;
    };
    HTML_Node.prototype.makeSpecialRoot = function () {
        this.specialRoot = true;
    };
    HTML_Node.prototype.isSpecialRoot = function () {
        return this.specialRoot;
    };
    HTML_Node.prototype.setTagName = function (newTagName) {
        this.tagName = newTagName;
    };
    HTML_Node.prototype.setIdName = function (newIdName) {
        this.idName = newIdName;
    };
    HTML_Node.obj_id = -1;
    return HTML_Node;
}());
exports.HTML_Node = HTML_Node;
var HTML_AST = /** @class */ (function () {
    function HTML_AST(rootNode) {
        this.rootNode = rootNode;
        this.children = [];
    }
    HTML_AST.prototype.addNode = function (node) {
        this.children.push(node);
        node.setParent(this);
    };
    HTML_AST.prototype.addNodes = function (nodes) {
        var len = nodes.length;
        for (var idx = 0; idx < len; idx++) {
            var node = nodes[idx];
            this.addNode(node);
        }
    };
    HTML_AST.prototype.isSpecicalRoot = function () {
        return this.rootNode.isSpecialRoot();
    };
    HTML_AST.prototype.setClassName = function (newClassName) {
        this.rootNode.setClassName(newClassName);
    };
    HTML_AST.prototype.setTagName = function (newTagName) {
        this.rootNode.setTagName(newTagName);
    };
    HTML_AST.prototype.setIdName = function (newIdName) {
        this.rootNode.setIdName(newIdName);
    };
    HTML_AST.prototype.setParent = function (node) {
        this.parent = node;
    };
    return HTML_AST;
}());
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
var SELF_CLOSE_TAG_NAMES = ['area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'meta',
    'link',
    'source',
    'track',
    'wbr',
    'command',
    'keygen',
    'menuitem',
    'frame'];
function isNotEndOfFile() {
    return tk.idx == tk.htmlString.length;
}
function selfCloseTags() {
    var tagName = tk.valStr;
    var a = 3;
    return new HTML_AST(new HTML_Node(tagName, '', ''));
}
function nonselfCloseTags() {
    return new HTML_AST(new HTML_Node('', '', ''));
}
function tag() {
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== tk.Tokenizer.WORD) {
        throw new Error("Syntax Error, Expected a tag name here");
    }
    var tagName = tk.valStr;
    if (SELF_CLOSE_TAG_NAMES.includes(tagName)) {
        selfCloseTags();
    }
    else {
        nonselfCloseTags();
    }
    return new HTML_AST(new HTML_Node('', '', ''));
}
function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}
function text() {
    exports.TOKEN = TOKEN = tk.getToken();
    while (TOKEN === tk.Tokenizer.WORD) {
        exports.TOKEN = TOKEN = tk.getToken();
    }
    return new HTML_AST(new HTML_Node('PLAIN_TEXT', null, null));
}
function html() {
    var lst_ast = [];
    while (true) {
        exports.TOKEN = TOKEN = tk.getToken();
        if (TOKEN === tk.Tokenizer.LEFT_ANGLE) {
            lst_ast.push(tag());
        }
        else if (TOKEN === tk.Tokenizer.WORD) {
            lst_ast.push(text());
        }
        else {
            break;
        }
    }
    return lst_ast;
}
function start() {
    var rootNode = new HTML_Node('', '', '');
    rootNode.makeSpecialRoot();
    var ast = new HTML_AST(rootNode);
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== tk.Tokenizer.DOCTYPE_P1) {
        throw new Error("Syntax Error at , Exected to find \"DOCTYPE_P1\" token");
    }
    // if (tk.chr != ' ') {
    //   throw new Error('Syntax Error, Exected to find " " character')   
    // }
    exports.TOKEN = TOKEN = tk.getToken();
    if (tk.valStr !== 'html') {
        throw new Error('Syntax Error, Exected to find "html"  word');
    }
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== tk.Tokenizer.RIGHT_ANGLE) {
        throw new Error("Syntax Error, Exected to find \">\"  but ".concat(tk.Tokenizer[TOKEN], " "));
    }
    var DOCTYPE_node = new HTML_Node('!DOCTYPE', null, null);
    var DOCTYPE_AST = new HTML_AST(DOCTYPE_node);
    ast.addNode(DOCTYPE_AST);
    ast.addNodes(html());
    return ast;
}
exports.start = start;
var chr = tk.chr;
exports.chr = chr;
var Tokenizer = tk.Tokenizer;
var getChr = tk.getChr;
exports.getChr = getChr;
var getToken = tk.getToken;
exports.getToken = getToken;
