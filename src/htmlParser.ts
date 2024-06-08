import  * as tk  from './htmlTokenizer'

var TOKEN:tk.Tokenizer;
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




function isNotEndOfFile(){

    return tk.idx == tk.htmlString.length
}

function html(): HTML_AST[] {


    throw new Error('NOT IMPLEMENTED YET')
    const rootNode = new HTML_Node(tk.valStr,'','') 

    
   
    var ast:HTML_AST = new HTML_AST(rootNode)

    return [ast];
    
}
function start(): HTML_AST{

    const rootNode = new HTML_Node(tk.valStr,'','') 

    
   
    var ast:HTML_AST = new HTML_AST(rootNode)




    if(  tk.getToken() !== tk.Tokenizer.DOCTYPE_P1 ){

        throw new Error('Syntax Error, Exected to find "DOCTYPE_P1" token')
    }

    if (tk.chr != ' ') {
      throw new Error('Syntax Error, Exected to find " " character')   
    }


    TOKEN  = tk.getToken()

    if(tk.valStr !== 'html'){
        throw new Error('Syntax Error, Exected to find "html"  word')   
    }

    TOKEN = tk.getToken();

    if (TOKEN !== tk.Tokenizer.RIGHT_ANGLE) {
        throw new Error('Syntax Error, Exected to find ">"  ')       
    }
    
    TOKEN  = tk.getToken();

    ast.addNodes(html())
        
    

    
    


    return ast;

} 

const chr = tk.chr;

const Tokenizer = tk.Tokenizer;

const  getChr  = tk.getChr

const getToken = tk.getToken


export {TestInit,start,chr,TOKEN ,getChr,getToken,HTML_Node,HTML_AST}