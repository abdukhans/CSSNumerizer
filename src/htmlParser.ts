import {Tokenizer, Token }  from './htmlTokenizer'
import { ATTR_AST } from './ATTR_AST';
import { HTML_AST} from './HTML_AST';
import {HTML_Node} from './HTML_NODE';



var TOKEN:Token;
var TAG_STACK:string[] = [];
var line_num = 0 ;
var isSelfClose:any = false;

const tk = new Tokenizer();
var debugMap = {}






function TestInit(html:string) {


    tk.Init(html);



}

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

const SELF_CLOSE_TAG_NAMES:string[] = [ 
                     'area' ,
                     'base' , 
                     'br'   , 
                     'col'  ,
                     'embed',
                     'hr'   ,
                     'img'  ,
                     'input',
                     'meta' ,
                     'link'   ,
                     'param'  ,
                     'source' ,
                     'track'  ,
                     'wbr'    ,
                     'command',
                     'keygen' ,
                     'menuitem' ,
                     'frame',
                     'wbr'   ]


function isNotEndOfFile(){

    return tk.idx == tk.htmlString.length
}







function atterVal():string{

    const Quote = TOKEN;

    if (Quote!== Token.DOUBLE_QUOTE && Quote!== Token.SINGLE_QUOTE && Quote!== Token.WORD) {
        throw new Error(`Syntax Error, Expected a SINGLE_QUOTE or DOUBLE_QUOTE token but got ${TOKEN} instead`)
    }


   

    if(TOKEN === Token.WORD){

        // TOKEN = getToken();
        return tk.valStr;
    }


    TOKEN = tk.getToken();



    var val = '';
    while (TOKEN !== Quote) {
        if (TOKEN === Token.WORD) {
            val += tk.valStr + ' ';
        }
        
        TOKEN = tk.getToken();
    }

    
    TOKEN = tk.getToken();
    return val;


}


function atterName():string{

    // TOKEN = tk.getToken();

    if (TOKEN == Token['WORD'] ) {

        return tk.valStr;


    }else{
        throw new Error('Syntax Error, Expected a word for atrrName')
    }





}


function className(){
    // TOKEN = tk.getToken();

    if (TOKEN !== Token['QUOTED_WORD']) {

        throw new Error("Syntax Error, Expected a class name")
        
    }


    const className = tk.valStr;

    TOKEN = tk.getToken();

    return className;
}




function idName(){
    // TOKEN = tk.getToken();

    if (TOKEN !== Token['QUOTED_WORD']) {
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

    if (TOKEN === Token['EQUAL']) {
        TOKEN = tk.getToken()
        atterVal();
    }else   {        
        // TOKEN = tk.getToken()
        // throw new Error(`Syntax Error, Expected a WORD but got ${Token[TOKEN]}`);
    }

} 



function HitEOFAtter():Boolean{

    // console.log('RUNNING');
    
    const res = TOKEN === Token['SELF_CLOSE_TAG'] || TOKEN === Token['RIGHT_ANGLE'];
        
    if (TOKEN ===Token['SELF_CLOSE_TAG']){

        // console.log('f');
            
        
        isSelfClose = true;
    }
    

    // console.log('EOF ATTER: = ' , Token[TOKEN]);
    
    return res
}


function NORMAL_ATTRS(){
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
    
    while(!shouldEnd ){
        // console.log("N: " ,tk.valStr);

        
        if (tk.valStr !== "class" && tk.valStr !== "id" && TOKEN === Token['WORD']) {
            TOKEN = tk.getToken();
            NORMAL_ATTR()
        }else{
            break;
        }

        shouldEnd = HitEOFAtter();
        
        
    }
}   



function classAttr():string {

    if (TOKEN !== Token['EQUAL']) {
        throw new Error(`Syntax Error in classAtter, Expected "EQUAL" but got ${TOKEN} instead`)
    }


    TOKEN = tk.getToken();
    return atterVal();
}




function idAttr() {

     if (TOKEN !== Token['EQUAL']) {
        throw new Error(`Syntax Error in idAttr, Expected "EQUAL" but got ${TOKEN} instead`)
    }


    TOKEN = tk.getToken();
    return atterVal();
}


function firstIdThenClass():ATTR_AST{


    const attrList = new ATTR_AST();


    if (TOKEN === Token['EQUAL']) {
        // TOKEN = tk.getToken();
        const idName = idAttr();
        attrList.setIdName(idName);
    }else{
        f();
    }

    NORMAL_ATTRS();


    if (tk.valStr === 'class' && TOKEN === Token['WORD']) {
        TOKEN = tk.getToken();
        const className = classAttr();
        attrList.setClassName(className);
    }


    NORMAL_ATTRS();

    if (TOKEN !== Token['RIGHT_ANGLE'] &&  TOKEN !== Token['SELF_CLOSE_TAG'] ) {        
        throw new Error(`Syntax Error, Cannot have multiple class or id tags got ${Token[TOKEN]} instead `)
    }

    return attrList;
}



const f = () => {throw new Error(`Syntax Error, Expected 'EQUAL' but got ${Token[TOKEN]} instead`)}
function firstClassThenId():ATTR_AST{


    const attrList = new ATTR_AST();


    if (TOKEN === Token['EQUAL'] ) {
    
        const className = classAttr();

        attrList.setClassName(className)
        //  //  console.log(attrList);
        
    }else{
        f()
        
    }
     
    if(tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === Token['WORD']){

        //  //  console.log('R!', tk.valStr);
        
        NORMAL_ATTRS();
    }


    if (TOKEN === Token['WORD'] && tk.valStr === 'id') {
        //  //  console.log('R!', tk.valStr);
        TOKEN = tk.getToken();

        const idName = idAttr();

        attrList.setIdName(idName);

       
    }

    // if(tk.valStr !== 'class' && tk.valStr !== 'id' && TOKEN === Token['WORD']){
    NORMAL_ATTRS();
    


    if (TOKEN !== Token['RIGHT_ANGLE'] && TOKEN !== Token['SELF_CLOSE_TAG'] ) {
        throw new Error(`Syntax Error, Cannot have multiple class or id tags got ${Token[TOKEN]} instread `)
    }

    return attrList;
} 

function idClassAttrs():ATTR_AST{

    const attrList = new ATTR_AST();

    if (tk.valStr === 'class' && TOKEN === Token['WORD']) {
        TOKEN = tk.getToken();


        if (TOKEN !== Token['EQUAL'] ){
            throw new Error("Syntax Error, Expected equal sign")
        }


        TOKEN = tk.getToken();
        const classname = className();
        attrList.setClassName(classname)

    }

    
    if(tk.valStr === 'id' && TOKEN === Token['WORD']){
        TOKEN = tk.getToken();
        const idname = idName();
        attrList.setIdName(idname)

    }
    
    
    if (tk.valStr === "class" && TOKEN === Token['WORD'] ) {
        TOKEN = tk.getToken()
        const classname = className();
        attrList.setClassName(classname)
        
    }

    
    if(tk.valStr === 'id' && TOKEN === Token['WORD']){
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

    isSelfClose = false
    if (TOKEN === Token['RIGHT_ANGLE'] || TOKEN ===  Token['SELF_CLOSE_TAG']){

        if (TOKEN === Token['SELF_CLOSE_TAG']) {
            isSelfClose = true;
        }
        TOKEN = tk.getToken();  
        return attrList;
    
    }  
    
    NORMAL_ATTRS()
    if (tk.valStr === 'class' && TOKEN === Token['WORD']) {
        TOKEN = tk.getToken();
        attrList = firstClassThenId();
    }else if(tk.valStr === 'id' && TOKEN === Token['WORD']){
        TOKEN = tk.getToken();
        attrList = firstIdThenClass();
    }


    NORMAL_ATTRS();

    TOKEN = tk.getToken()
    


    return attrList;
}



function selfCloseTags():HTML_AST{

    const tagName = tk.valStr
    

    // //  //  console.log(tagName);
    
    // Note that we need to make 
    // sure that there is a space 
    // after tag name. But this 
    // is garunteed to happen
    // if we get two word tokens twice 
    // in a row

    
    TOKEN = tk.getToken();





    // if (TOKEN !== Token['WORD']) {
        
    //     throw new Error('Syntax Error, Expected a new word here')
    // }
    const atterList = attrList();

    // if (TOKEN !== Token['RIGHT_ANGLE'] && TOKEN !== Token['SELF_CLOSE_TAG' ] ) {
    //     throw new Error(`Syntax Error, Expected to find to find either RIGHT_ANGLE or SELF_CLOSE_TAG but got ${Token[TOKEN]} instead`)
    // }

    const className: string |undefined = atterList.getClassName();
    const idName   : string |undefined = atterList.getIdName();


    //TOKEN = tk.getToken()
    return new HTML_AST(new HTML_Node(tagName,className,idName));  

}


function regTag():HTML_AST{

    const tagName = tk.valStr;

    TOKEN = tk.getToken();

    const atterList = attrList();


    
    const className: string |undefined = atterList.getClassName();
    const idName   : string |undefined = atterList.getIdName();

    const html_ast = new HTML_AST(new HTML_Node(tagName,className,idName)) 

    if (isSelfClose) {

        if (TOKEN !== Token['SELF_CLOSE_TAG']) {
            throw new Error(`Syntax Error,  Expected a 'SELF_CLOSE_TAG' but got ${Token[TOKEN]} instead`)
        }

       
        
    }else{


        const sub_ast = html();

        html_ast.addNodes(sub_ast)

        
        if (TOKEN !== Token['CLOSE_TAG']) {
            throw new Error(`Syntax Error,  Expected a 'CLOSE_TAG' but got ${Token[TOKEN]} instead`)
        }

        
        TOKEN  = tk.getToken();

        if (!( tk.valStr === tagName && Token['WORD'] === TOKEN  )) {
         
            throw new Error(`Syntax Error, Expected to close with <${tagName}> but got ${Token[TOKEN]} instead with value :"${tk.valStr}"`)
        
        }

        TOKEN = tk.getToken();

        if (TOKEN !== Token['RIGHT_ANGLE'] ) {
            throw new Error(`Syntax Error, Expected to close with <${tagName}> but could not find RIGHT_ANGLE TOKEN`)
        }

        TOKEN = tk.getToken();

    
    }

    return html_ast
  

    
}
// This will match all non self closing tags
// If they do close on themselves then this
// 
function nonselfCloseTags():HTML_AST{

    const tagName = tk.valStr;

    TOKEN = tk.getToken();


    const atterList = attrList();







    // if (!(TOKEN === Token['LEFT_ANGLE'] || TOKEN === Token['WORD'] ||  TOKEN === Token['OPEN_COM'] || TOKEN === Token['SELF_CLOSE_TAG']) ) {
    //     throw new Error(`Syntax Error,  Expected to find to LEFT_ANGLE or WORD or CLOSE_TAG or OPEN_COM but got ${Token[TOKEN]} instead`)
    // }


    //  //  console.log("asd f" ,Token[TOKEN]);
    


    const className: string |undefined = atterList.getClassName();
    const idName   : string |undefined = atterList.getIdName();

    const html_ast = new HTML_AST(new HTML_Node(tagName,className,idName)) 



    console.log("IS SELF CLOSE: " , isSelfClose);



    if (isSelfClose){
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
    


    TOKEN  = tk.getToken();

    while(!( tk.valStr === tagName && Token['WORD'] === TOKEN  )) {
         
        console.log("ERROR DECTECTED");
        



        if (TOKEN !== Token.CLOSE_TAG) {
            html_ast.addNodes(html());

        }else{
            TOKEN = tk.getToken();
        }


        
        
    }

    TOKEN = tk.getToken();

    if (TOKEN !== Token['RIGHT_ANGLE'] ) {
        throw new Error(`Syntax Error, Expected to close with <${tagName}> but could not find RIGHT_ANGLE TOKEN`)
    }

    TOKEN = tk.getToken();
    
    return html_ast ;

}




function whatever(escapeTagName:string){
    while(TOKEN !== Token.EOF ){




        while(TOKEN !== Token['CLOSE_TAG']){
            TOKEN = tk.getJsToken(); 
        
        }

        TOKEN = tk.getToken();

        if(TOKEN === Token.WORD && tk.valStr === escapeTagName){

            TOKEN = tk.getToken();


            if(TOKEN !== Token.RIGHT_ANGLE  ){
                throw new Error(`Syntax Error, Expected a "RIGHT_ANGLE" token but got ${Token[TOKEN]} instead`)
            }
            TOKEN = tk.getToken();
            break;
        }
}

}
function StyleTag():HTML_AST {

    attrList()
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


    whatever('style')
    return new HTML_AST(new HTML_Node("style",null,null))

}

function ScriptTag(){



    // console.log(tk.valStr);
    
    attrList();

    // console.log("SC TAG: " , Token[TOKEN] , tk.valStr);
    
    // if (TOKEN == Token['RIGHT_ANGLE']) {
    //     throw new Error(`Syntax Error, Expected to close opening Script tag with RIGHT_ANGLE but got ${Token[TOKEN]} instead`)
    // }   


    

        // TOKEN = tk.getToken()

    whatever('script')



    return new HTML_AST(new HTML_Node("script",null,null))
}
function tag(): HTML_AST {


    TOKEN = tk.getToken();
    

    if (TOKEN !== Token.WORD) {
        throw new Error("Syntax Error, Expected a tag name here");
    }

    const tagName = tk.valStr;


    if (tagName in debugMap){

        debugMap[tagName] += 1

    }else{
        debugMap[tagName] = 1
    }
    const  num  = debugMap[tagName];

    console.log("TAG NAME:", tagName,` #${num}`);
    

    if (SELF_CLOSE_TAG_NAMES.includes(tagName )){

        return selfCloseTags()
        
    }else if (tagName ==='script'){

        TOKEN = tk.getToken()
        return ScriptTag();

    }else if (tagName === 'style'){

        TOKEN = tk.getToken()
        return StyleTag();
    }
    else{
        return nonselfCloseTags()
    }



    


}


const MISC_CHARS =[  '/',
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

function mics(){

    TOKEN = tk.getToken();

}



const FIRST_SET_TEXT = [Token.WORD, 
                        Token.SINGLE_QUOTE,
                        Token.DOUBLE_QUOTE,
                        Token.RIGHT_ANGLE,
                        Token.EQUAL]
function text(): HTML_AST{

    TOKEN = tk.getToken()



    while (FIRST_SET_TEXT.includes(TOKEN)) {
      
      TOKEN = tk.getToken()   
    }

    return new HTML_AST(new HTML_Node('PLAIN_TEXT', null,null));    
}



function comment (){

    TOKEN = tk.getCommentToken();
    if (TOKEN === Token.EOF){
        throw new Error("Syntax Error, Comment was not closed")
    }else{
        TOKEN = tk.getToken();
    }


}


function html(): HTML_AST[] {





    const lst_ast: HTML_AST[] = [] 


    while (true) {

    
        // TOKEN = tk.getToken();
        //  //  //  console.log("HTML: " ,Token[TOKEN]);
        if (TOKEN === Token.LEFT_ANGLE) {
            lst_ast.push(tag())
        }else if(FIRST_SET_TEXT.includes(TOKEN)){
            lst_ast.push(text());
        }else if (TOKEN === Token.OPEN_COM){
            comment();
        }
        else{
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

    if(  TOKEN !== Token.DOCTYPE_P1 ){
        throw new Error(`Syntax Error at , Exected to find "DOCTYPE_P1" token`)
    }   


    TOKEN  = tk.getToken()

    if(tk.valStr !== 'html'){
        throw new Error('Syntax Error, Exected to find "html"  word')   
    }

    TOKEN = tk.getToken();

    if (TOKEN !== Token.RIGHT_ANGLE) {
        throw new Error(`Syntax Error, Exected to find ">"  but got ${Token[TOKEN]} instead `)       
    }



    const DOCTYPE_node = new HTML_Node('!DOCTYPE',null,null);
    const DOCTYPE_AST  = new HTML_AST(DOCTYPE_node);
    ast.addNode(DOCTYPE_AST);

    TOKEN = tk.getToken()
    ast.addNodes(html())


    
    return ast;

} 

const chr = tk.chr;



const getToken = tk.getToken


export {TestInit,start,chr,TOKEN,Token  ,getToken,HTML_Node,HTML_AST}