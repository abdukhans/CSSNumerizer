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
        node.setParent(this);
    }

    addNodes(nodes:HTML_AST[]){

        const len = nodes.length
            
        for (let idx = 0; idx < len; idx++) {
            const node:HTML_AST = nodes[idx];

            this.addNode(node);
            
        }
    }

    private setParent(node:HTML_AST | undefined){
        this.parent = node;
    }

}


// NOTE ALWAYS MATCH THE TOKEN WITH GREATEST LENGTH
enum Tokenizer{
    DOCTYPE_P1   ,     // '<!DOCTYPE'
    DOCTYPE_P2   ,    //  'html>' 
    LEFT_ANGLE ,    // '<'
    RIGHT_ANGLE,     // '>'
    CLOSE_ANGLE,    // '/>'
    CLASS_DECL,     // 'class' (ws*) '='class_name_list  
    ID_DECL ,       // 'id' (ws*) '=' id_name_list
    CLASS_NAME_LIST , // ((ws*)(alpahnum)+(ws*))+
    ID_NAME_LIST ,    //   ((ws*)(alpahnum)+(ws*))+
    WORD     ,       // (alphanum)+
    KEY_WORD ,      // 'class' | 'id'  | '/>'  | ''
    WS     ,        // (' '| '\t' | '\n' | '\r' )
    BAD_TOKEN  ,   // FOR DEBUG PURPOSES 

}

var TOKEN:Tokenizer | undefined  = null;
var chr:string | undefined = null; 
var htmlString: string = '';
var idx:number = 0;
var lenStr: number = 0 ;
var valStr:string ='';



function isWhiteSpace(chr:string):boolean {
    

    return chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r';
}

function getChr():string {

    
    
    return htmlString[idx++];

}


function isAlphanumeric(str:string | undefined) {
  return str !== null && /^[a-zA-Z0-9]+$/.test(str) ;
}



function JumpWhiteSpace(): void{

    while (isWhiteSpace(chr)) {
        chr = getChr();
    }
}


function getToken(): Tokenizer  {

    JumpWhiteSpace()
    
    if (chr === '<') {
    
        chr = getChr()

        if (chr === "!") {
            

            valStr = '<!';
            

            chr = getChr();
            while (isAlphanumeric(chr)) {
                valStr += chr;
                chr = getChr();
            }
            if (valStr !== "<!DOCTYPE") {
                throw new Error(`TOKEN ERROR, Expected to find the word '<!DOCTYPE' but got ${valStr} instead` );
            }else{
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
            chr = getChr();
        
        }
       
        return Tokenizer.WORD;
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

function TestInit(html:string) {


    TOKEN  = null;
    idx = 0;
   
    lenStr= 0 ;
    valStr ='';

    htmlString = html;

    lenStr = htmlString.length;

    chr = getChr(); 



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




function isNotEndOfFile(){

    return idx == htmlString.length
}

function html(): HTML_AST[] {


    throw new Error('NOT IMPLEMENTED YET')
    const rootNode = new HTML_Node(valStr,'','') 

    
   
    var ast:HTML_AST = new HTML_AST(rootNode)

    return [ast];
    
}
function start(): HTML_AST{

    const rootNode = new HTML_Node(valStr,'','') 

    
   
    var ast:HTML_AST = new HTML_AST(rootNode)

    TOKEN = getToken();


    if( TOKEN !== Tokenizer.DOCTYPE_P1 ){

        throw new Error('Syntax Error, Exected to find "DOCTYPE_P1" token')
    }

    if (chr != ' ') {
      throw new Error('Syntax Error, Exected to find " " character')   
    }


    TOKEN = getToken()

    if(valStr !== 'html'){
        throw new Error('Syntax Error, Exected to find "html"  word')   
    }

    TOKEN = getToken();

    if (TOKEN !== Tokenizer.RIGHT_ANGLE) {
        throw new Error('Syntax Error, Exected to find ">"  ')       
    }
    
    TOKEN = getToken();

    ast.addNodes(html())
        
    

    
    


    return ast;

} 


export {TestInit,chr,TOKEN,Tokenizer,getChr,getToken,BuildAst,HTML_Node,HTML_AST}