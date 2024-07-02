"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_AST = exports.HTML_Node = exports.getToken = exports.getChr = exports.Tokenizer = exports.tk = exports.TOKEN = exports.chr = exports.start = exports.TestInit = void 0;
const tk = require("./htmlTokenizer");
exports.tk = tk;
const ATTR_AST_1 = require("./ATTR_AST");
var TOKEN;
var TAG_STACK = [];
class HTML_Node {
    constructor(tagName, className, idName) {
        this.tagName = tagName;
        this.className = className;
        this.idName = idName;
        this.specialRoot = false;
        HTML_Node.obj_id += 1;
        this.objNum = HTML_Node.obj_id;
    }
    setClassName(newClassName) {
        this.className = newClassName;
    }
    getObjId() {
        return this.objNum;
    }
    makeSpecialRoot() {
        this.specialRoot = true;
    }
    isSpecialRoot() {
        return this.specialRoot;
    }
    setTagName(newTagName) {
        this.tagName = newTagName;
    }
    setIdName(newIdName) {
        this.idName = newIdName;
    }
}
exports.HTML_Node = HTML_Node;
HTML_Node.obj_id = -1;
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
    isSpecicalRoot() {
        return this.rootNode.isSpecialRoot();
    }
    setClassName(newClassName) {
        this.rootNode.setClassName(newClassName);
    }
    setTagName(newTagName) {
        this.rootNode.setTagName(newTagName);
    }
    setIdName(newIdName) {
        this.rootNode.setIdName(newIdName);
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
const SELF_CLOSE_TAG_NAMES = ['area',
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
function atterVal() {
    if (TOKEN !== tk.Tokenizer['QUOTED_WORD']) {
        throw new Error("Syntax Error,Expected a qouted word");
    }
    const val = tk.valStr;
    exports.TOKEN = TOKEN = tk.getToken();
    return val;
}
function alphanum() {
}
function atterName() {
    // TOKEN = tk.getToken();
    if (TOKEN == tk.Tokenizer['WORD']) {
        return tk.valStr;
    }
    else {
        throw new Error('Syntax Error, Expected a word for atrrName');
    }
}
function className() {
    // TOKEN = tk.getToken();
    if (TOKEN !== tk.Tokenizer['QUOTED_WORD']) {
        throw new Error("Syntax Error, Expected a class name");
    }
    const className = tk.valStr;
    exports.TOKEN = TOKEN = tk.getToken();
    return className;
}
function idName() {
    // TOKEN = tk.getToken();
    if (TOKEN !== tk.Tokenizer['QUOTED_WORD']) {
        throw new Error("Syntax Error, Expected an ID name");
    }
    return tk.valStr;
}
function NORMAL_ATTR() {
    // const attername = atterName()    
    // if (attername === 'classname' ||  attername === 'idname') {
    //     return;
    // }
    // TOKEN = tk.getToken();
    if (TOKEN === tk.Tokenizer['EQUAL']) {
        exports.TOKEN = TOKEN = tk.getToken();
        atterVal();
    }
    else {
        throw new Error(`Syntax Error, Expected an equal sign for atterval  but got ${tk.Tokenizer[tk.TOKEN]}`);
    }
}
function NORMAL_ATTRS() {
    const HitEOFAtter = () => {
        const res = TOKEN == tk.Tokenizer['SELF_CLOSE_TAG'] || TOKEN == tk.Tokenizer['RIGHT_ANGLE'];
        console.log("HitEOFAtter ", res);
        return res;
    };
    while (!(HitEOFAtter())) {
        if (tk.valStr !== "class" && tk.valStr !== "id" && TOKEN === tk.Tokenizer['WORD']) {
            exports.TOKEN = TOKEN = tk.getToken();
            NORMAL_ATTR();
        }
        else {
            break;
        }
    }
}
function classAttr() {
    if (TOKEN !== tk.Tokenizer['EQUAL']) {
        throw new Error(`Syntax Error in classAtter, Expected "EQUAL" but got ${TOKEN} instead`);
    }
    exports.TOKEN = TOKEN = tk.getToken();
    return atterVal();
}
function idAttr() {
    if (TOKEN !== tk.Tokenizer['EQUAL']) {
        throw new Error(`Syntax Error in idAttr, Expected "EQUAL" but got ${TOKEN} instead`);
    }
    exports.TOKEN = TOKEN = tk.getToken();
    return atterVal();
}
function firstIdThenClass() {
    const attrList = new ATTR_AST_1.ATTR_AST();
    if (TOKEN === tk.Tokenizer['EQUAL']) {
        // TOKEN = tk.getToken();
        const idName = idAttr();
        attrList.setIdName(idName);
    }
    else {
        f();
    }
    NORMAL_ATTRS();
    if (tk.valStr === 'class' && TOKEN === tk.Tokenizer['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        const className = classAttr();
        attrList.setClassName(className);
    }
    NORMAL_ATTRS();
    if (TOKEN !== tk.Tokenizer['RIGHT_ANGLE'] && TOKEN !== tk.Tokenizer['SELF_CLOSE_TAG']) {
        throw new Error(`Syntax Error, Cannot have multiple class or id tags got ${Tokenizer[TOKEN]} instread `);
    }
    return attrList;
}
const f = () => { throw new Error(`Syntax Error, Expected 'EQUAL' but got ${Tokenizer[TOKEN]} instead`); };
function firstClassThenId() {
    const attrList = new ATTR_AST_1.ATTR_AST();
    if (TOKEN === Tokenizer['EQUAL']) {
        const className = classAttr();
        attrList.setClassName(className);
        console.log(attrList);
    }
    else {
        f();
    }
    if (tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === tk.Tokenizer['WORD']) {
        console.log('R!', tk.valStr);
        NORMAL_ATTRS();
    }
    if (TOKEN === tk.Tokenizer['WORD'] && tk.valStr === 'id') {
        console.log('R!', tk.valStr);
        exports.TOKEN = TOKEN = tk.getToken();
        const idName = idAttr();
        attrList.setIdName(idName);
    }
    // if(tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === tk.Tokenizer['WORD']){
    NORMAL_ATTRS();
    if (TOKEN !== tk.Tokenizer['RIGHT_ANGLE'] && TOKEN !== tk.Tokenizer['SELF_CLOSE_TAG']) {
        throw new Error(`Syntax Error, Cannot have multiple class or id tags got ${Tokenizer[TOKEN]} instread `);
    }
    return attrList;
}
function idClassAttrs() {
    const attrList = new ATTR_AST_1.ATTR_AST();
    if (tk.valStr === 'class' && TOKEN === tk.Tokenizer['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        if (TOKEN !== tk.Tokenizer['EQUAL']) {
            throw new Error("Syntax Error, Expected equal sign");
        }
        exports.TOKEN = TOKEN = tk.getToken();
        const classname = className();
        attrList.setClassName(classname);
    }
    if (tk.valStr === 'id' && TOKEN === tk.Tokenizer['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        const idname = idName();
        attrList.setIdName(idname);
    }
    if (tk.valStr === "class" && TOKEN === tk.Tokenizer['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        const classname = className();
        attrList.setClassName(classname);
    }
    if (tk.valStr === 'id' && TOKEN === tk.Tokenizer['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        const idname = idName();
        attrList.setIdName(idname);
    }
    //TOKEN = tk.getToken();
    return attrList;
}
function attrList() {
    var attrList = new ATTR_AST_1.ATTR_AST();
    //TOKEN = tk.getToken();
    if (TOKEN === tk.Tokenizer['RIGHT_ANGLE'] || TOKEN === tk.Tokenizer['SELF_CLOSE_TAG']) {
        exports.TOKEN = TOKEN = tk.getToken();
        return attrList;
    }
    //TOKEN = tk.getToken();
    // if (tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === tk.Tokenizer['WORD'] ) {
    //     console.log('asf');
    //     NORMAL_ATTRS();
    // }else{
    //     TOKEN = tk.getToken()
    // }
    NORMAL_ATTRS();
    if (tk.valStr === 'class' && TOKEN === tk.Tokenizer['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        attrList = firstClassThenId();
    }
    else if (tk.valStr === 'id' && TOKEN === tk.Tokenizer['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        attrList = firstIdThenClass();
    }
    // if(tk.valStr == 'classname' ){
    //     const classname = className();
    //     attrList.setClassName(classname);
    // }
    // TOKEN = tk.getToken();
    // if(tk.valStr == 'id'){
    //     const idname = idName();
    //     attrList.setIdName(idname);
    // }
    // TOKEN = tk.getToken();
    // if(tk.valStr == 'classname' ){
    //     const classname = className();
    //     attrList.setClassName(classname);
    // }
    // if(tk.valStr == 'id'){
    //     const idname = idName();
    //     attrList.setIdName(idname);
    // }
    // if (tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === tk.Tokenizer['WORD'] ) {
    //     NORMAL_ATTRS();
    // }else{
    //     TOKEN = tk.getToken()
    // }
    NORMAL_ATTRS();
    return attrList;
}
function selfCloseTags() {
    const tagName = tk.valStr;
    // Note that we need to make 
    // sure that there is a space
    // after tag name. But this 
    // is garunteed to happen
    // if we get two word tokens twice 
    // in a row
    exports.TOKEN = TOKEN = tk.getToken();
    // if (TOKEN !== tk.Tokenizer['WORD']) {
    //     throw new Error('Syntax Error, Expected a new word here')
    // }
    const atterList = attrList();
    if (TOKEN !== tk.Tokenizer['RIGHT_ANGLE'] && TOKEN !== tk.Tokenizer['SELF_CLOSE_TAG']) {
        throw new Error(`Syntax Error, Expected to find to find either RIGHT_ANGLE or SELF_CLOSE_TAG but got ${tk.Tokenizer[TOKEN]} instead`);
    }
    const className = atterList.getClassName();
    const idName = atterList.getIdName();
    exports.TOKEN = TOKEN = tk.getToken();
    return new HTML_AST(new HTML_Node(tagName, className, idName));
}
function nonselfCloseTags() {
    const tagName = tk.valStr;
    exports.TOKEN = TOKEN = tk.getToken();
    const atterList = attrList();
    if (TOKEN !== tk.Tokenizer['RIGHT_ANGLE']) {
        throw new Error(`Syntax Error, Expected to find to RIGHT_ANGLE but got ${tk.Tokenizer[TOKEN]} instead`);
    }
    const className = atterList.getClassName();
    const idName = atterList.getIdName();
    const html_ast = new HTML_AST(new HTML_Node(tagName, className, idName));
    // TAG_STACK.push(tagName);
    exports.TOKEN = TOKEN = tk.getToken();
    const html_sub_ast = html();
    html_ast.addNodes(html_sub_ast);
    if (TOKEN !== tk.Tokenizer['CLOSE_TAG']) {
        throw new Error(`Syntax Error, Expected a 'CLOSE_TAG' but got ${tk.Tokenizer[TOKEN]} instead`);
    }
    exports.TOKEN = TOKEN = tk.getToken();
    if (!(tk.valStr === tagName && tk.Tokenizer['WORD'] === TOKEN)) {
        throw new Error(`Syntax Error, Expected to close with <${tagName}>`);
    }
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== tk.Tokenizer['RIGHT_ANGLE']) {
        throw new Error(`Syntax Error, Expected to close with <${tagName}> but could not find RIGHT_ANGLE TOKEN`);
    }
    exports.TOKEN = TOKEN = tk.getToken();
    return html_ast;
}
function tag() {
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== tk.Tokenizer.WORD) {
        throw new Error("Syntax Error, Expected a tag name here");
    }
    const tagName = tk.valStr;
    if (SELF_CLOSE_TAG_NAMES.includes(tagName)) {
        return selfCloseTags();
    }
    else {
        return nonselfCloseTags();
    }
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
    const lst_ast = [];
    while (true) {
        // TOKEN = tk.getToken();
        console.log(tk.Tokenizer[TOKEN]);
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
    const rootNode = new HTML_Node('', '', '');
    rootNode.makeSpecialRoot();
    const ast = new HTML_AST(rootNode);
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== tk.Tokenizer.DOCTYPE_P1) {
        throw new Error(`Syntax Error at , Exected to find "DOCTYPE_P1" token`);
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
        throw new Error(`Syntax Error, Exected to find ">"  but got ${tk.Tokenizer[TOKEN]} instead `);
    }
    const DOCTYPE_node = new HTML_Node('!DOCTYPE', null, null);
    const DOCTYPE_AST = new HTML_AST(DOCTYPE_node);
    ast.addNode(DOCTYPE_AST);
    exports.TOKEN = TOKEN = tk.getToken();
    ast.addNodes(html());
    return ast;
}
exports.start = start;
const chr = tk.chr;
exports.chr = chr;
const Tokenizer = tk.Tokenizer;
exports.Tokenizer = Tokenizer;
const getChr = tk.getChr;
exports.getChr = getChr;
const getToken = tk.getToken;
exports.getToken = getToken;
//# sourceMappingURL=htmlParser.js.map