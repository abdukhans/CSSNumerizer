class HTML_Node {

    tagName:string;
    className:string|undefined;
    idName: string|undefined;


    constructor(tagName:string, className:string|undefined, idName: string|undefined){

        this.tagName= tagName;
        this.className = className;
        this.idName = idName;
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
    }


    setParent(node:HTML_AST | undefined){
        this.parent = node;
    }

}


// NOTE ALWAYS MATCH THE TOKEN WITH GREATEST LENGTH
enum Tokenizer{
    LEFT_ANGLE ,    // '<'
    RIGHT_ANGLE,     // '>'
    CLOSE_ANGLE,    // '/>'
    CLASS_DECL,     // 'class' (ws*) '='class_name_list  
    ID_DECL ,       // 'id' (ws*) '=' id_name_list
    CLASS_NAME_LIST , // ((ws*)(alpahnum)+(ws*))+
    ID_NAME_LIST ,    //   ((ws*)(alpahnum)+(ws*))+
    WORD     ,       // (alphanum)+
    KEY_WORD ,      // 'class' | 'id'  | '/>' 
    WS     ,        // (' '| \t | \n )+
    BAD_TOKEN  ,   // FOR DEBUG PURPOSES 

}


var TOKEN:Tokenizer | undefined  = null;
var chr:string | undefined = null; 
var htmlString: string = '';
var idx:number = 0;
var lenStr: number = 0 ;
var valStr:string ='';


function getChr() {

    chr = htmlString[idx++];
}


function isAlphanumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}



function getToken()  {

    getChr();

    

    if (chr === '<') {
        

        TOKEN =  Tokenizer.LEFT_ANGLE;
        return;
    }

    if (isAlphanumeric(chr)) {
        valStr = chr;
    
        while (isAlphanumeric(chr)) {
            valStr += chr;
            getChr();
        
        }
        TOKEN =  Tokenizer.WORD;
        return;
    }
    
  

    
    console.log(chr.charCodeAt(0), "\n".charCodeAt(0));
    if(chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r'){

        getChr();

     
        
        while (chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r') {
            getChr();            
            
        }

        TOKEN =  Tokenizer.WS;

        return
    }   





}

function TestInit(html:string) {
    
    htmlString = html;

    lenStr = htmlString.length;



}

function BuildAst(html:string): HTML_AST {

    htmlString = html;

    lenStr = htmlString.length;


    var RootTagname:string ;


    var rootNode:HTML_Node ;


    getToken();

    if (TOKEN == Tokenizer.LEFT_ANGLE) {
        
        rootNode = new HTML_Node(valStr,'','') 



    }


   
    var ast:HTML_AST = new HTML_AST(rootNode)
    
    


    return ast;



    

    
    
}



export {TestInit,chr,TOKEN,Tokenizer,getChr,getToken,BuildAst,HTML_Node,HTML_AST}