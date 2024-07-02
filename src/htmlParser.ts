import  * as tk  from './htmlTokenizer'
import { ATTR_AST } from './ATTR_AST';

var TOKEN:tk.Tokenizer;


class HTML_Node {

    tagName:string;
    className:string|undefined;
    idName: string|undefined;

    objNum:number;

    

    specialRoot:boolean;

    static obj_id = -1;

    constructor(tagName:string, className:string|undefined, idName: string|undefined){

        this.tagName= tagName;
        this.className = className;
        this.idName = idName;
        this.specialRoot = false;

        HTML_Node.obj_id += 1;

        this.objNum = HTML_Node.obj_id

    }

    setClassName(newClassName:string){
        this.className = newClassName;


    }

    getObjId(){
        return this.objNum;
    }

    makeSpecialRoot(){
        this.specialRoot = true;
    }

    isSpecialRoot(){

        return this.specialRoot;
    }
    setTagName(newTagName:string){
        this.tagName = newTagName;

        
    }

    
    setIdName(newIdName:string){
        this.idName = newIdName;

        
    }
}


class HTML_AST{

    parent: HTML_AST | undefined;
    rootNode:HTML_Node; 
    children:HTML_AST[];

    constructor(rootNode:HTML_Node){

        this.rootNode = rootNode;
        this.children = []
    }

    addNode(node:HTML_AST) {
        this.children.push(node);
        node.setParent(this);
    }

    addNodes(nodes:HTML_AST[]){

        const len = nodes.length
            
        for (let idx = 0; idx < len; idx++) {
            const node:HTML_AST = nodes[idx];

            this.addNode(node);
            
        }
    }


    isSpecicalRoot(){
        return this.rootNode.isSpecialRoot();
    }

    setClassName(newClassName:string){

        this.rootNode.setClassName(newClassName);

    }
    setTagName(newTagName:string){

        this.rootNode.setTagName(newTagName);

    }

    setIdName(newIdName:string){

        this.rootNode.setIdName(newIdName);

    }

    private setParent(node:HTML_AST | undefined){
        this.parent = node;
    }

}



function TestInit(html:string) {


    tk.TestInit(html);



}

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

const SELF_CLOSE_TAG_NAMES:string[] = [ 'area' ,
                     'base' , 
                     'br'   , 
                     'col'  ,
                     'embed',
                     'hr'   ,
                     'img'  ,
                     'input',
                     'meta' ,
                     'link' ,
                     'source' ,
                     'track'  ,
                     'wbr'    ,
                     'command',
                     'keygen' ,
                     'menuitem' ,
                     'frame'   ]


function isNotEndOfFile(){

    return tk.idx == tk.htmlString.length
}







function atterVal():string{

    if (TOKEN !== tk.Tokenizer['QUOTED_WORD']) {
        throw new Error("Syntax Error,Expected a qouted word")        
    }


    const val = tk.valStr;

    TOKEN = tk.getToken();
    return val;


}


function alphanum(){





    

}

function atterName():string{

    // TOKEN = tk.getToken();

    if (TOKEN == tk.Tokenizer['WORD'] ) {

        return tk.valStr;


    }else{
        throw new Error('Syntax Error, Expected a word for atrrName')
    }





}


function className(){
    // TOKEN = tk.getToken();

    if (TOKEN !== tk.Tokenizer['QUOTED_WORD']) {

        throw new Error("Syntax Error, Expected a class name")
        
    }


    const className = tk.valStr;

    TOKEN = tk.getToken();

    return className;
}




function idName(){
    // TOKEN = tk.getToken();

    if (TOKEN !== tk.Tokenizer['QUOTED_WORD']) {
        throw new Error("Syntax Error, Expected an ID name")
        
    }

    return tk.valStr;
}



function NORMAL_ATTR(){


    // const attername = atterName()    
    // if (attername === 'classname' ||  attername === 'idname') {
    //     return;
    // }

    // TOKEN = tk.getToken();

    if (TOKEN === tk.Tokenizer['EQUAL']) {

        TOKEN = tk.getToken()



        atterVal();
    }else{
        throw new Error(`Syntax Error, Expected an equal sign for atterval  but got ${tk.Tokenizer[tk.TOKEN]}`)
    }

}


function NORMAL_ATTRS(){


    const HitEOFAtter = () => {
        const res = TOKEN == tk.Tokenizer['SELF_CLOSE_TAG'] || TOKEN == tk.Tokenizer['RIGHT_ANGLE'];
        

        console.log("HitEOFAtter " , res);
        
    
        return res}

    while(!(HitEOFAtter()) ){
        
        if (tk.valStr !== "class" && tk.valStr !== "id" && TOKEN === tk.Tokenizer['WORD']) {
            TOKEN = tk.getToken();
            NORMAL_ATTR()
        }else{
            break;
        }
        
    }
}   



function classAttr():string {

    if (TOKEN !== tk.Tokenizer['EQUAL']) {
        throw new Error(`Syntax Error in classAtter, Expected "EQUAL" but got ${TOKEN} instead`)
    }


    TOKEN = tk.getToken();
    return atterVal();
}




function idAttr() {

     if (TOKEN !== tk.Tokenizer['EQUAL']) {
        throw new Error(`Syntax Error in idAttr, Expected "EQUAL" but got ${TOKEN} instead`)
    }


    TOKEN = tk.getToken();
    return atterVal();
}


function firstIdThenClass():ATTR_AST{


    const attrList = new ATTR_AST();


    if (TOKEN === tk.Tokenizer['EQUAL']) {
        // TOKEN = tk.getToken();
        const idName = idAttr();
        attrList.setIdName(idName);
    }else{
        f();
    }

    NORMAL_ATTRS();


    if (tk.valStr === 'class' && TOKEN === tk.Tokenizer['WORD']) {
        TOKEN = tk.getToken();
        const className = classAttr();
        attrList.setClassName(className);
    }


    NORMAL_ATTRS();

    if (TOKEN !== tk.Tokenizer['RIGHT_ANGLE'] &&  TOKEN !== tk.Tokenizer['SELF_CLOSE_TAG'] ) {        
        throw new Error(`Syntax Error, Cannot have multiple class or id tags got ${Tokenizer[TOKEN]} instread `)
    }


    return attrList;
}



const f = () => {throw new Error(`Syntax Error, Expected 'EQUAL' but got ${Tokenizer[TOKEN]} instead`)}
function firstClassThenId():ATTR_AST{


    const attrList = new ATTR_AST();


    if (TOKEN === Tokenizer['EQUAL'] ) {
    
        const className = classAttr();

        attrList.setClassName(className)
        console.log(attrList);
        
    }else{
        f()
        
    }
     
    if(tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === tk.Tokenizer['WORD']){

        console.log('R!', tk.valStr);
        
        NORMAL_ATTRS();
    }


    if (TOKEN === tk.Tokenizer['WORD'] && tk.valStr === 'id') {
        console.log('R!', tk.valStr);
        TOKEN = tk.getToken();

        const idName = idAttr();

        attrList.setIdName(idName);

       
    }

    // if(tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === tk.Tokenizer['WORD']){
    NORMAL_ATTRS();
    


    if (TOKEN !== tk.Tokenizer['RIGHT_ANGLE'] && TOKEN !== tk.Tokenizer['SELF_CLOSE_TAG'] ) {
        throw new Error(`Syntax Error, Cannot have multiple class or id tags got ${Tokenizer[TOKEN]} instread `)
    }

    return attrList;
} 

function idClassAttrs():ATTR_AST{

    const attrList = new ATTR_AST();

    if (tk.valStr === 'class' && TOKEN === tk.Tokenizer['WORD']) {
        TOKEN = tk.getToken();


        if (TOKEN !== tk.Tokenizer['EQUAL'] ){
            throw new Error("Syntax Error, Expected equal sign")
        }


        TOKEN = tk.getToken();
        const classname = className();
        attrList.setClassName(classname)

    }

    
    if(tk.valStr === 'id' && TOKEN === tk.Tokenizer['WORD']){
        TOKEN = tk.getToken();
        const idname = idName();
        attrList.setIdName(idname)

    }
    
    
    if (tk.valStr === "class" && TOKEN === tk.Tokenizer['WORD'] ) {
        TOKEN = tk.getToken()
        const classname = className();
        attrList.setClassName(classname)


       

        
    }

    
    if(tk.valStr === 'id' && TOKEN === tk.Tokenizer['WORD']){
        TOKEN = tk.getToken();
        const idname = idName();
        attrList.setIdName(idname)

    }


    //TOKEN = tk.getToken();


    return attrList;


}


function attrList():ATTR_AST{
    var attrList = new ATTR_AST();
    //TOKEN = tk.getToken();


    if (TOKEN === tk.Tokenizer['RIGHT_ANGLE'] || TOKEN ===  tk.Tokenizer['SELF_CLOSE_TAG']){
        TOKEN = tk.getToken();
        return attrList;
    
    }


    //TOKEN = tk.getToken();



    // if (tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === tk.Tokenizer['WORD'] ) {
    //     console.log('asf');
        
    //     NORMAL_ATTRS();
    // }else{
    //     TOKEN = tk.getToken()
    // }
    

    NORMAL_ATTRS()
    if (tk.valStr === 'class' && TOKEN === tk.Tokenizer['WORD']) {
        TOKEN = tk.getToken();
        attrList = firstClassThenId();
    }else if(tk.valStr === 'id' && TOKEN === tk.Tokenizer['WORD']){
        TOKEN = tk.getToken();
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



function selfCloseTags():HTML_AST{

    const tagName = tk.valStr
    
    // Note that we need to make 
    // sure that there is a space
    // after tag name. But this 
    // is garunteed to happen
    // if we get two word tokens twice 
    // in a row
    
    TOKEN = tk.getToken();

    // if (TOKEN !== tk.Tokenizer['WORD']) {
        
    //     throw new Error('Syntax Error, Expected a new word here')
    // }
    const atterList = attrList();

    const className: string |undefined = atterList.getClassName();
    const idName   : string |undefined = atterList.getIdName();


    TOKEN = tk.getToken()
    return new HTML_AST(new HTML_Node(tagName,className,idName));  

}

function nonselfCloseTags():HTML_AST{




    
    return new HTML_AST(new HTML_Node('','',''));

}

function tag(): HTML_AST {



    TOKEN = tk.getToken();

    


    if (TOKEN !== tk.Tokenizer.WORD) {
        throw new Error("Syntax Error, Expected a tag name here");
    }

    const tagName = tk.valStr;

    if (SELF_CLOSE_TAG_NAMES.includes(tagName )){

        return selfCloseTags()
        
    }else{
        return nonselfCloseTags()
    }



    


    return new HTML_AST(new HTML_Node('','',''));
}


function isAlphanumeric(str:string){
    return /^[a-zA-Z0-9]+$/.test(str)
}


function text(): HTML_AST{

    TOKEN = tk.getToken()
    while (TOKEN === tk.Tokenizer.WORD) {
      TOKEN = tk.getToken()   

    }

    return new HTML_AST(new HTML_Node('PLAIN_TEXT', null,null));    
}

function html(): HTML_AST[] {





    const lst_ast: HTML_AST[] = [] 


    while (true) {

        // TOKEN = tk.getToken();


         console.log(tk.Tokenizer[TOKEN]);
        if (TOKEN === tk.Tokenizer.LEFT_ANGLE) {
            lst_ast.push(tag())
        }else if(TOKEN === tk.Tokenizer.WORD){
            lst_ast.push(text());
            
        }else{

            break;
            
        }



       
        
        

     
        
    

    }


    
    return lst_ast;
    
}
function start(): HTML_AST{

    const rootNode = new HTML_Node('','','')
    
    rootNode.makeSpecialRoot()


    
    const ast:HTML_AST = new HTML_AST(rootNode)

    TOKEN = tk.getToken()

    if(  TOKEN !== tk.Tokenizer.DOCTYPE_P1 ){
        throw new Error(`Syntax Error at , Exected to find "DOCTYPE_P1" token`)
    }   


    // if (tk.chr != ' ') {
    //   throw new Error('Syntax Error, Exected to find " " character')   
    // }


    TOKEN  = tk.getToken()

    if(tk.valStr !== 'html'){
        throw new Error('Syntax Error, Exected to find "html"  word')   
    }

    TOKEN = tk.getToken();

    if (TOKEN !== tk.Tokenizer.RIGHT_ANGLE) {
        throw new Error(`Syntax Error, Exected to find ">"  but got ${tk.Tokenizer[TOKEN]} instead `)       
    }



    const DOCTYPE_node = new HTML_Node('!DOCTYPE',null,null);
    const DOCTYPE_AST = new HTML_AST(DOCTYPE_node);
    ast.addNode(DOCTYPE_AST);

    TOKEN = tk.getToken()
    ast.addNodes(html())


    
    return ast;

} 

const chr = tk.chr;

const Tokenizer = tk.Tokenizer;
const  getChr  = tk.getChr

const getToken = tk.getToken


export {TestInit,start,chr,TOKEN,tk,Tokenizer ,getChr,getToken,HTML_Node,HTML_AST}