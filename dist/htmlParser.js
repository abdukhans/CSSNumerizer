"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_AST = exports.HTML_Node = exports.getToken = exports.Token = exports.TOKEN = exports.chr = exports.start = exports.TestInit = void 0;
const htmlTokenizer_1 = require("./htmlTokenizer");
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return htmlTokenizer_1.Token; } });
const ATTR_AST_1 = require("./ATTR_AST");
const HTML_AST_1 = require("./HTML_AST");
Object.defineProperty(exports, "HTML_AST", { enumerable: true, get: function () { return HTML_AST_1.HTML_AST; } });
const HTML_NODE_1 = require("./HTML_NODE");
Object.defineProperty(exports, "HTML_Node", { enumerable: true, get: function () { return HTML_NODE_1.HTML_Node; } });
const htmlPermissiveParserUtils_1 = require("./htmlPermissiveParserUtils");
var TOKEN;
var TAG_STACK = [];
var line_num = 0;
var isSelfClose = false;
const tk = new htmlTokenizer_1.Tokenizer();
var debugMap = {};
function TestInit(html) {
    tk.Init(html);
}
exports.TestInit = TestInit;
// function BuildAst(html:string): HTML_AST {
//     tk.TOKEN
//     tk.htmlString = html;
//     tk.lenStr = htmlString.length;
//     var RootTagname:string ;
//     var rootNode:HTML_Node ;
//     getToken();
//     if (TOKEN == Token.LEFT_ANGLE) {
//         rootNode = new HTML_Node(tk.valStr,'','') 
//     }
//     var ast:HTML_AST = new HTML_AST(rootNode)
//     return ast;
// }
const SELF_CLOSE_TAG_NAMES = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'meta',
    'link',
    'param',
    'source',
    'track',
    'wbr',
    'command',
    'keygen',
    'menuitem',
    'frame',
    'wbr'
];
function isNotEndOfFile() {
    return tk.idx == tk.htmlString.length;
}
function atterVal() {
    const Quote = TOKEN;
    if (Quote !== htmlTokenizer_1.Token.DOUBLE_QUOTE && Quote !== htmlTokenizer_1.Token.SINGLE_QUOTE && Quote !== htmlTokenizer_1.Token.WORD) {
        throw new Error(`Syntax Error, Expected a SINGLE_QUOTE or DOUBLE_QUOTE token but got ${TOKEN} instead`);
    }
    if (TOKEN === htmlTokenizer_1.Token.WORD) {
        // TOKEN = getToken();
        return tk.valStr;
    }
    exports.TOKEN = TOKEN = tk.getToken();
    var val = '';
    while (TOKEN !== Quote) {
        if (TOKEN === htmlTokenizer_1.Token.WORD) {
            val += tk.valStr + ' ';
        }
        exports.TOKEN = TOKEN = tk.getToken();
    }
    exports.TOKEN = TOKEN = tk.getToken();
    return val;
}
function atterName() {
    // TOKEN = tk.getToken();
    if (TOKEN == htmlTokenizer_1.Token['WORD']) {
        return tk.valStr;
    }
    else {
        throw new Error('Syntax Error, Expected a word for atrrName');
    }
}
function className() {
    // TOKEN = tk.getToken();
    if (TOKEN !== htmlTokenizer_1.Token['QUOTED_WORD']) {
        throw new Error("Syntax Error, Expected a class name");
    }
    const className = tk.valStr;
    exports.TOKEN = TOKEN = tk.getToken();
    return className;
}
function idName() {
    // TOKEN = tk.getToken();
    if (TOKEN !== htmlTokenizer_1.Token['QUOTED_WORD']) {
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
    if (TOKEN === htmlTokenizer_1.Token['EQUAL']) {
        exports.TOKEN = TOKEN = tk.getToken();
        atterVal();
    }
    else {
        // TOKEN = tk.getToken()
        // throw new Error(`Syntax Error, Expected a WORD but got ${Token[TOKEN]}`);
    }
}
function HitEOFAtter() {
    // console.log('RUNNING');
    const res = TOKEN === htmlTokenizer_1.Token['SELF_CLOSE_TAG'] || TOKEN === htmlTokenizer_1.Token['RIGHT_ANGLE'];
    if (TOKEN === htmlTokenizer_1.Token['SELF_CLOSE_TAG']) {
        // console.log('f');
        isSelfClose = true;
    }
    // console.log('EOF ATTER: = ' , Token[TOKEN]);
    return res;
}
function NORMAL_ATTRS() {
    // const HitEOFAtter = () => {
    //     const res = TOKEN === Token['SELF_CLOSE_TAG'] || TOKEN === Token['RIGHT_ANGLE'];
    //     if (TOKEN ===Token['SELF_CLOSE_TAG']){
    //         console.log('f');
    //         isSelfClose = true;
    //     }
    //     //  //  console.log("HitEOFAtter " , res);
    //     return res
    // }
    isSelfClose = false;
    let shouldEnd = HitEOFAtter();
    while (!shouldEnd) {
        // console.log("N: " ,tk.valStr);
        if (tk.valStr !== "class" && tk.valStr !== "id" && TOKEN === htmlTokenizer_1.Token['WORD']) {
            exports.TOKEN = TOKEN = tk.getToken();
            NORMAL_ATTR();
        }
        else {
            break;
        }
        shouldEnd = HitEOFAtter();
    }
}
function classAttr() {
    if (TOKEN !== htmlTokenizer_1.Token['EQUAL']) {
        throw new Error(`Syntax Error in classAtter, Expected "EQUAL" but got ${TOKEN} instead`);
    }
    exports.TOKEN = TOKEN = tk.getToken();
    return atterVal();
}
function idAttr() {
    if (TOKEN !== htmlTokenizer_1.Token['EQUAL']) {
        throw new Error(`Syntax Error in idAttr, Expected "EQUAL" but got ${TOKEN} instead`);
    }
    exports.TOKEN = TOKEN = tk.getToken();
    return atterVal();
}
function firstIdThenClass() {
    const attrList = new ATTR_AST_1.ATTR_AST();
    if (TOKEN === htmlTokenizer_1.Token['EQUAL']) {
        // TOKEN = tk.getToken();
        const idName = idAttr();
        attrList.setIdName(idName);
    }
    else {
        f();
    }
    NORMAL_ATTRS();
    if (tk.valStr === 'class' && TOKEN === htmlTokenizer_1.Token['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        const className = classAttr();
        attrList.setClassName(className);
    }
    NORMAL_ATTRS();
    if (TOKEN !== htmlTokenizer_1.Token['RIGHT_ANGLE'] && TOKEN !== htmlTokenizer_1.Token['SELF_CLOSE_TAG']) {
        throw new Error(`Syntax Error, Cannot have multiple class or id tags got ${htmlTokenizer_1.Token[TOKEN]} instead `);
    }
    return attrList;
}
const f = () => { throw new Error(`Syntax Error, Expected 'EQUAL' but got ${htmlTokenizer_1.Token[TOKEN]} instead`); };
function firstClassThenId() {
    const attrList = new ATTR_AST_1.ATTR_AST();
    if (TOKEN === htmlTokenizer_1.Token['EQUAL']) {
        const className = classAttr();
        attrList.setClassName(className);
        //  //  console.log(attrList);
    }
    else {
        f();
    }
    if (tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === htmlTokenizer_1.Token['WORD']) {
        //  //  console.log('R!', tk.valStr);
        NORMAL_ATTRS();
    }
    if (TOKEN === htmlTokenizer_1.Token['WORD'] && tk.valStr === 'id') {
        //  //  console.log('R!', tk.valStr);
        exports.TOKEN = TOKEN = tk.getToken();
        const idName = idAttr();
        attrList.setIdName(idName);
    }
    // if(tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === Token['WORD']){
    NORMAL_ATTRS();
    if (TOKEN !== htmlTokenizer_1.Token['RIGHT_ANGLE'] && TOKEN !== htmlTokenizer_1.Token['SELF_CLOSE_TAG']) {
        throw new Error(`Syntax Error, Cannot have multiple class or id tags got ${htmlTokenizer_1.Token[TOKEN]} instread `);
    }
    return attrList;
}
function idClassAttrs() {
    const attrList = new ATTR_AST_1.ATTR_AST();
    if (tk.valStr === 'class' && TOKEN === htmlTokenizer_1.Token['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        if (TOKEN !== htmlTokenizer_1.Token['EQUAL']) {
            throw new Error("Syntax Error, Expected equal sign");
        }
        exports.TOKEN = TOKEN = tk.getToken();
        const classname = className();
        attrList.setClassName(classname);
    }
    if (tk.valStr === 'id' && TOKEN === htmlTokenizer_1.Token['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        const idname = idName();
        attrList.setIdName(idname);
    }
    if (tk.valStr === "class" && TOKEN === htmlTokenizer_1.Token['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        const classname = className();
        attrList.setClassName(classname);
    }
    if (tk.valStr === 'id' && TOKEN === htmlTokenizer_1.Token['WORD']) {
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
    isSelfClose = false;
    if (TOKEN === htmlTokenizer_1.Token['RIGHT_ANGLE'] || TOKEN === htmlTokenizer_1.Token['SELF_CLOSE_TAG']) {
        if (TOKEN === htmlTokenizer_1.Token['SELF_CLOSE_TAG']) {
            isSelfClose = true;
        }
        exports.TOKEN = TOKEN = tk.getToken();
        return attrList;
    }
    NORMAL_ATTRS();
    if (tk.valStr === 'class' && TOKEN === htmlTokenizer_1.Token['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        attrList = firstClassThenId();
    }
    else if (tk.valStr === 'id' && TOKEN === htmlTokenizer_1.Token['WORD']) {
        exports.TOKEN = TOKEN = tk.getToken();
        attrList = firstIdThenClass();
    }
    NORMAL_ATTRS();
    exports.TOKEN = TOKEN = tk.getToken();
    return attrList;
}
function selfCloseTags() {
    const tagName = tk.valStr;
    // //  //  console.log(tagName);
    // Note that we need to make 
    // sure that there is a space 
    // after tag name. But this 
    // is garunteed to happen
    // if we get two word tokens twice 
    // in a row
    exports.TOKEN = TOKEN = tk.getToken();
    // if (TOKEN !== Token['WORD']) {
    //     throw new Error('Syntax Error, Expected a new word here')
    // }
    const atterList = attrList();
    // if (TOKEN !== Token['RIGHT_ANGLE'] && TOKEN !== Token['SELF_CLOSE_TAG' ] ) {
    //     throw new Error(`Syntax Error, Expected to find to find either RIGHT_ANGLE or SELF_CLOSE_TAG but got ${Token[TOKEN]} instead`)
    // }
    const className = atterList.getClassName();
    const idName = atterList.getIdName();
    //TOKEN = tk.getToken()
    return new HTML_AST_1.HTML_AST(new HTML_NODE_1.HTML_Node(tagName, className, idName));
}
function regTag() {
    const tagName = tk.valStr;
    exports.TOKEN = TOKEN = tk.getToken();
    const atterList = attrList();
    const className = atterList.getClassName();
    const idName = atterList.getIdName();
    const html_ast = new HTML_AST_1.HTML_AST(new HTML_NODE_1.HTML_Node(tagName, className, idName));
    if (isSelfClose) {
        if (TOKEN !== htmlTokenizer_1.Token['SELF_CLOSE_TAG']) {
            throw new Error(`Syntax Error,  Expected a 'SELF_CLOSE_TAG' but got ${htmlTokenizer_1.Token[TOKEN]} instead`);
        }
    }
    else {
        const sub_ast = html();
        html_ast.addNodes(sub_ast);
        if (TOKEN !== htmlTokenizer_1.Token['CLOSE_TAG']) {
            throw new Error(`Syntax Error,  Expected a 'CLOSE_TAG' but got ${htmlTokenizer_1.Token[TOKEN]} instead`);
        }
        exports.TOKEN = TOKEN = tk.getToken();
        if (!(tk.valStr === tagName && htmlTokenizer_1.Token['WORD'] === TOKEN)) {
            throw new Error(`Syntax Error, Expected to close with <${tagName}> but got ${htmlTokenizer_1.Token[TOKEN]} instead with value :"${tk.valStr}"`);
        }
        exports.TOKEN = TOKEN = tk.getToken();
        if (TOKEN !== htmlTokenizer_1.Token['RIGHT_ANGLE']) {
            throw new Error(`Syntax Error, Expected to close with <${tagName}> but could not find RIGHT_ANGLE TOKEN`);
        }
        exports.TOKEN = TOKEN = tk.getToken();
    }
    return html_ast;
}
const isAlpha = (chr) => /[a-zA-Z]$/.test(chr);
// This will match all non self closing tags
// If they do close on themselves then this
// 
function nonselfCloseTags() {
    const tagName = tk.valStr;
    if (!isAlpha(tagName[0])) {
        // while(!(TOKEN === Token.LEFT_ANGLE || TOKEN === Token.OPEN_COM)){
        //     TOKEN = tk.getToken();
        // }
        // return new HTML_AST(new HTML_Node('PLAIN_TEXT',null,null))
        // // return text();
        exports.TOKEN = TOKEN = (0, htmlPermissiveParserUtils_1.SkipToNextToken)(tk, [htmlTokenizer_1.Token.LEFT_ANGLE, htmlTokenizer_1.Token.OPEN_COM]);
        return new HTML_AST_1.HTML_AST(new HTML_NODE_1.HTML_Node('PLAIN_TEXT', null, null));
    }
    exports.TOKEN = TOKEN = tk.getToken();
    const atterList = attrList();
    // if (!(TOKEN === Token['LEFT_ANGLE'] || TOKEN === Token['WORD'] ||  TOKEN === Token['OPEN_COM'] || TOKEN === Token['SELF_CLOSE_TAG']) ) {
    //     throw new Error(`Syntax Error,  Expected to find to LEFT_ANGLE or WORD or CLOSE_TAG or OPEN_COM but got ${Token[TOKEN]} instead`)
    // }
    //  //  console.log("asd f" ,Token[TOKEN]);
    const className = atterList.getClassName();
    const idName = atterList.getIdName();
    const html_ast = new HTML_AST_1.HTML_AST(new HTML_NODE_1.HTML_Node(tagName, className, idName));
    // console.log("IS SELF CLOSE: " , isSelfClose);
    if (isSelfClose) {
        // TOKEN = tk.getToken();  
        // console.log('dsfsd');
        return html_ast;
    }
    // TAG_STACK.push(tagName);
    // TOKEN = tk.getToken()
    const html_sub_ast = html();
    html_ast.addNodes(html_sub_ast);
    // if (TOKEN !== Token['CLOSE_TAG']) {
    //     throw new Error(`Syntax Error,  Expected a 'CLOSE_TAG' but got ${Token[TOKEN]} instead`)
    // }  
    //  //  //  console.log(`${Token[TOKEN]} instead`);
    exports.TOKEN = TOKEN = tk.getToken();
    while (!(tk.valStr === tagName && htmlTokenizer_1.Token['WORD'] === TOKEN)) {
        // console.log("ERROR DECTECTED");
        if (TOKEN !== htmlTokenizer_1.Token.CLOSE_TAG) {
            html_ast.addNodes(html());
        }
        else {
            exports.TOKEN = TOKEN = tk.getToken();
        }
    }
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== htmlTokenizer_1.Token['RIGHT_ANGLE']) {
        throw new Error(`Syntax Error, Expected to close with <${tagName}> but could not find RIGHT_ANGLE TOKEN`);
    }
    exports.TOKEN = TOKEN = tk.getToken();
    return html_ast;
}
function whatever(escapeTagName) {
    while (TOKEN !== htmlTokenizer_1.Token.EOF) {
        while (TOKEN !== htmlTokenizer_1.Token['CLOSE_TAG']) {
            exports.TOKEN = TOKEN = tk.getJsToken();
        }
        exports.TOKEN = TOKEN = tk.getToken();
        if (TOKEN === htmlTokenizer_1.Token.WORD && tk.valStr === escapeTagName) {
            exports.TOKEN = TOKEN = tk.getToken();
            if (TOKEN !== htmlTokenizer_1.Token.RIGHT_ANGLE) {
                throw new Error(`Syntax Error, Expected a "RIGHT_ANGLE" token but got ${htmlTokenizer_1.Token[TOKEN]} instead`);
            }
            exports.TOKEN = TOKEN = tk.getToken();
            break;
        }
    }
}
function StyleTag() {
    attrList();
    // if (TOKEN !== Token['RIGHT_ANGLE']) {
    //     throw new Error("Syntax Error, Expected to close opening style tag with RIGHT_ANGLE")
    // }   
    // if(TOKEN !== Token['CLOSE_TAG']){
    //     TOKEN = tk.getToken()
    //     whatever('style')
    // }
    // TOKEN = tk.getToken();
    // if(tk.valStr !== 'style'){
    //     throw new Error(`Syntax Error, Expected to close with style tag but got ${tk.valStr} tag Name instead`)
    // }
    // TOKEN = tk.getToken();
    // if(TOKEN !== Token['RIGHT_ANGLE'] ){
    //     throw new Error(`Syntax Error, Expected RIGHT_ANGLE token in closing with style tag but got ${Token[TOKEN]} instead.`)        
    // }
    // TOKEN = tk.getToken()
    whatever('style');
    return new HTML_AST_1.HTML_AST(new HTML_NODE_1.HTML_Node("style", null, null));
}
function ScriptTag() {
    // console.log(tk.valStr);
    attrList();
    // console.log("SC TAG: " , Token[TOKEN] , tk.valStr);
    // if (TOKEN == Token['RIGHT_ANGLE']) {
    //     throw new Error(`Syntax Error, Expected to close opening Script tag with RIGHT_ANGLE but got ${Token[TOKEN]} instead`)
    // }   
    // TOKEN = tk.getToken()
    whatever('script');
    return new HTML_AST_1.HTML_AST(new HTML_NODE_1.HTML_Node("script", null, null));
}
function tag() {
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== htmlTokenizer_1.Token.WORD) {
        throw new Error("Syntax Error, Expected a tag name here");
    }
    const tagName = tk.valStr;
    if (tagName in debugMap) {
        debugMap[tagName] += 1;
    }
    else {
        debugMap[tagName] = 1;
    }
    const num = debugMap[tagName];
    // console.log("TAG NAME:", tagName,` #${num}`);
    if (SELF_CLOSE_TAG_NAMES.includes(tagName)) {
        return selfCloseTags();
    }
    else if (tagName === 'script') {
        exports.TOKEN = TOKEN = tk.getToken();
        return ScriptTag();
    }
    else if (tagName === 'style') {
        exports.TOKEN = TOKEN = tk.getToken();
        return StyleTag();
    }
    else {
        return nonselfCloseTags();
    }
}
const MISC_CHARS = ['/',
    '\\',
    '+',
    '@',
    '#',
    '"',
    "'",
    "`",
    '~',
    '-',
    '_',
    '?',
    '&',
    '^',
    '+',
    '{',
    '}',
    '[',
    ']',
    '=',
    '$',
];
function mics() {
    exports.TOKEN = TOKEN = tk.getToken();
}
const FIRST_SET_TEXT = [htmlTokenizer_1.Token.WORD,
    htmlTokenizer_1.Token.SINGLE_QUOTE,
    htmlTokenizer_1.Token.DOUBLE_QUOTE,
    htmlTokenizer_1.Token.RIGHT_ANGLE,
    htmlTokenizer_1.Token.EQUAL];
function text() {
    exports.TOKEN = TOKEN = tk.getToken();
    while (FIRST_SET_TEXT.includes(TOKEN)) {
        exports.TOKEN = TOKEN = tk.getToken();
    }
    return new HTML_AST_1.HTML_AST(new HTML_NODE_1.HTML_Node('PLAIN_TEXT', null, null));
}
function comment() {
    exports.TOKEN = TOKEN = tk.getCommentToken();
    if (TOKEN === htmlTokenizer_1.Token.EOF) {
        throw new Error("Syntax Error, Comment was not closed");
    }
    else {
        exports.TOKEN = TOKEN = tk.getToken();
    }
}
function html() {
    const lst_ast = [];
    while (true) {
        // TOKEN = tk.getToken();
        //  //  //  console.log("HTML: " ,Token[TOKEN]);
        if (TOKEN === htmlTokenizer_1.Token.LEFT_ANGLE) {
            lst_ast.push(tag());
        }
        else if (FIRST_SET_TEXT.includes(TOKEN)) {
            lst_ast.push(text());
        }
        else if (TOKEN === htmlTokenizer_1.Token.OPEN_COM) {
            comment();
        }
        else {
            break;
        }
    }
    return lst_ast;
}
function start() {
    const rootNode = new HTML_NODE_1.HTML_Node('', '', '');
    rootNode.makeSpecialRoot();
    const ast = new HTML_AST_1.HTML_AST(rootNode);
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== htmlTokenizer_1.Token.DOCTYPE_P1) {
        throw new Error(`Syntax Error at , Exected to find "DOCTYPE_P1" token`);
    }
    exports.TOKEN = TOKEN = tk.getToken();
    if (tk.valStr !== 'html') {
        throw new Error('Syntax Error, Exected to find "html"  word');
    }
    exports.TOKEN = TOKEN = tk.getToken();
    if (TOKEN !== htmlTokenizer_1.Token.RIGHT_ANGLE) {
        throw new Error(`Syntax Error, Exected to find ">"  but got ${htmlTokenizer_1.Token[TOKEN]} instead `);
    }
    const DOCTYPE_node = new HTML_NODE_1.HTML_Node('!DOCTYPE', null, null);
    const DOCTYPE_AST = new HTML_AST_1.HTML_AST(DOCTYPE_node);
    ast.addNode(DOCTYPE_AST);
    exports.TOKEN = TOKEN = tk.getToken();
    ast.addNodes(html());
    return ast;
}
exports.start = start;
const chr = tk.chr;
exports.chr = chr;
const getToken = tk.getToken;
exports.getToken = getToken;
//# sourceMappingURL=htmlParser.js.map