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
    DOCTYPE   ,     // '<!DOCTYPE>'
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


function getChr():string {

    
    
    return htmlString[idx++];

}


function isAlphanumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}



function getToken(): Tokenizer  {

    chr = getChr();

    

    if (chr === '<') {
        
        

        chr = getChr()

        if (chr === "!") {
            

            valStr = '<!';

            chr = getChr();

            while (isAlphanumeric(chr)) {
                valStr += chr;
                chr = getChr();
            }
           



            valStr += chr;
            

            chr = getChr()
            while (isAlphanumeric(chr)) {
                valStr += chr;
                chr = getChr();
            }

            valStr += chr





            

            if (valStr !== "<!DOCTYPE html>") {
                
           

                throw new Error(`Expected to find the word '!DOCTYPE html' but got ${valStr} instead` );
                
            }
            // chr = getChr();

           
            if(chr === '>'){
                
                return Tokenizer.DOCTYPE;
            }else{
                
                throw new Error(`Expected to find '>' after 'DOCTYPE' gut got ${valStr}` );
            }


        }



        TOKEN =  Tokenizer.LEFT_ANGLE;
        return;
    }

    if (isAlphanumeric(chr)) {
        valStr = chr;
    
        while (isAlphanumeric(chr)) {
            valStr += chr;
            chr = getChr();
        
        }
        TOKEN =  Tokenizer.WORD;
        return;
    }
    
  

    
    //console.log(chr.charCodeAt(0), "\n".charCodeAt(0));
    if(chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r'){

        chr = getChr();

     
        
        while (chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r') {
            chr = getChr();            
            
        }

        TOKEN =  Tokenizer.WS;

        return
    }   





}

function TestInit(html:string) {


    TOKEN  = null;
    chr = null; 
    idx = 0;
    lenStr= 0 ;
    valStr ='';

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



function start(): HTML_AST{

    const rootNode = new HTML_Node(valStr,'','') 

    
   
    var ast:HTML_AST = new HTML_AST(rootNode)
    
    


    return ast;

} 


export {TestInit,chr,TOKEN,Tokenizer,getChr,getToken,BuildAst,HTML_Node,HTML_AST}