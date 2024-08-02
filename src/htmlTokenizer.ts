import { tk } from "./htmlParser";
var debugMap = {}

// NOTE THIS SHOULD ALWAYS MATCH THE TOKEN WITH GREATEST LENGTH
export enum Tokenizer{
    DOCTYPE_P1   ,     // '<!DOCTYPE '
    LEFT_ANGLE ,    // '<'
    RIGHT_ANGLE,    // '>'
    SELF_CLOSE_TAG , // '/>' 
    CLOSE_TAG      ,    // '</'
    EQUAL          ,    // '='
    QUOTED_WORD    ,  //  (("'" (anyChar / "'") "'") | ('"' (anyChar / '"') '"')  ) 
    CLASS_DECL,     // 'class' (ws*) '='class_name_list  
    ID_DECL ,       // 'id' (ws*) '=' id_name_list
    CLASS_NAME_LIST , // ((ws*)(alpahnum)+(ws*))+
    ID_NAME_LIST ,    //   ((ws*)(alpahnum)+(ws*))+
    WORD     ,       // (alphanum)+
    KEY_WORD ,      // 'class' | 'id'  | '/>'  | ''
    WS     ,        // (' '| '\t' | '\n' | '\r' )
    TEXT    ,      //  (alphanum)(alphanum |  ws)*
    BAD_TOKEN  ,   // FOR DEBUG PURPOSES 
    EOF        , 
    JS_TOKEN   ,  // This token means that we are currently parsing javaScript
    CSS_TOKEN  ,  // This token means that we are currently parsing css
    OPEN_COM   ,  // This token matches on '<!--'
    CLOSE_COM  ,  // This token matches on '-->'
    DASH       ,  // This token matches on '-'

    DOUBLE_QUOTE, // This token matches on '"'
    SINGLE_QUOTE , // This token matches on "'"

}

export var TOKEN:Tokenizer | undefined  = null;
export var chr:string | undefined = null; 
export var htmlString: string = '';
export var idx:number = 0;
export var lenStr: number = 0 ;
export var valStr:string ='';
export var line_num = 1;
export var col_num  = 0;

export function isWhiteSpace(chr:string):boolean {

    if (chr === '\n' ){
        line_num += 1;
    }

    return chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r';
}

export function getChr():string {


    return htmlString[idx++];

}



// TODO: FIX THIS  !!!!!!
export function isTxtChrs(str:string | undefined) {
  return (str !== null && /^[a-zA-Z0-9]+$/.test(str)) || chr ==='`'|| chr ==='~' ||chr ==='$' || chr=== "*" || chr === '^' || chr === "_"|| chr === "@"|| chr === ')' || chr === '(' || chr  === '?'|| chr === '!' || chr === '-' || chr === '&' || chr === ','  ||chr === '.'  || chr === ';' || chr === '%' || chr === '#'  || chr === ':'  || chr === '+' ;
}


export function JumpWhiteSpace(): void{

    while (isWhiteSpace(chr)) {
        
        chr = getChr();
    }
}

export function getToken(): Tokenizer{


    JumpWhiteSpace();

    if(idx === lenStr + 1 ){
        return Tokenizer.EOF;
    }


    switch(chr){
        case '/':{                        
            chr = getChr()
            if(chr === '>'){
                chr = getChr();
                return Tokenizer.SELF_CLOSE_TAG;
            }else{
                valStr = '/';
                while(isTxtChrs(chr)){
                    valStr += chr;

                    chr = getChr();

                }
                return Tokenizer.WORD;
            }

        }
        case '<' :{
            valStr = '<'
            chr = getChr()
            if(chr === "!"){
                valStr += chr;
                chr = getChr();
                if (chr === '-'){
                    chr = getChr();

                    if(chr === '-'){
                        chr = getChr();
                        return Tokenizer.OPEN_COM;
                    }else{
                        throw new Error(`TOKEN ERROR, Expected to find '<!--' but got '<!${chr}' instead.`)
                    }

                }  


                // This will tokenize for 
                // the beginning doctype preamble
                while (isTxtChrs(chr)){
                    valStr += chr;
                    chr = getChr();
                }
                

                valStr += chr; // <--- This is here to allow for the space char
                               //      to be added 
                
                
                if(valStr !== "<!DOCTYPE " && valStr !== '<!doctype '){
                    throw new Error(`TOKEN ERROR, Expected to find the "<!DOCTYPE " or "<!doctype " but got ${valStr} instead`)
                }else{
                    return Tokenizer.DOCTYPE_P1;
                }

            }else if(chr === '/'){
                chr = getChr();
                return Tokenizer.CLOSE_TAG;
            }

            return Tokenizer.LEFT_ANGLE;
        }

        case '=':{
            chr = getChr();
            return Tokenizer.EQUAL;
        }
        case '"':{
            chr = getChr();   
            return Tokenizer.DOUBLE_QUOTE;

        }
        case "'":{
            chr = getChr();
            return Tokenizer.SINGLE_QUOTE;
        }
        case '>':{
            chr = getChr();
            return Tokenizer.RIGHT_ANGLE;
        }

        default:{
            break;
        }

    }

    
    if (isTxtChrs(chr) ) {
        valStr = chr;       
        chr = getChr()


        while (isTxtChrs(chr) && chr !== undefined  ) {
            if(chr === '-'){
                chr = getChr();
                if(chr !== '-'){
                    if(idx === lenStr){
                        return Tokenizer.BAD_TOKEN;
                    }
                    
                    valStr += '-'
                    continue
                }
                chr = getChr()
                if(chr !== '>'){


                    if(idx === lenStr){
                        return Tokenizer.WORD;
                    }
                    
                    valStr += '--'
                    continue 
                }


                return Tokenizer.CLOSE_COM

            }
            
            valStr += chr;
            if(idx === lenStr){
                return Tokenizer.WORD;
            }  

            chr = getChr();

           
        }
       
        return Tokenizer.WORD;
    }


    chr = getChr();


    return Tokenizer.BAD_TOKEN;


}




export function getCommentToken():Tokenizer{
    while (true) {
        if (chr == '-') {
            chr = getChr()
            if (chr === '-' ){
                chr = getChr()
                if (chr === '>'){
                    chr = getChr();
                    return Tokenizer.CLOSE_COM; 
                }
            }
            
        }
        
        if(idx === lenStr){
            break
        }  

        chr = getChr();
       
    }


    return Tokenizer.EOF;


}

export function getJsToken(): Tokenizer{
   
    if(chr === '<'){
            chr = getChr();
            if (chr === '/') {
                chr = getChr();
                return Tokenizer.CLOSE_TAG;
            }
    }

    chr = getChr();
        
    return Tokenizer.JS_TOKEN;
}


export function getCSSToken(): Tokenizer{
   
    if(chr === '<'){
            chr = getChr();
            if (chr === '/') {
                chr = getChr();
                return Tokenizer.CLOSE_TAG;
            }
    }
    chr = getChr();
        
    return Tokenizer.CSS_TOKEN;
}



export function TestInit(html:string) {


    TOKEN  = null;
    idx = 0;
   
    lenStr= 0 ;
    valStr =''; 
 
    htmlString = html;

    lenStr = htmlString.length;

    chr = getChr(); 



}



