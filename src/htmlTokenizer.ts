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


export function isAlphanumeric(str:string | undefined) {
  return (str !== null && /^[a-zA-Z0-9]+$/.test(str)) || chr === "_"|| chr === "@"|| chr === ')' || chr === '(' || chr === "'"|| chr  === '?'|| chr === '!' || chr === '-' || chr === '&' || chr === ','  ||chr === '.'  || chr === ';' || chr === '%' || chr === '#' || chr === '/' || chr === ':'  || chr === '+' ;
}



export function JumpWhiteSpace(): void{

    while (isWhiteSpace(chr)) {
        
        chr = getChr();
    }
}


export function getToken(): Tokenizer  {

    JumpWhiteSpace()

    if(idx === lenStr + 1 ){

        return Tokenizer.EOF;
    }


    if(chr === '/'){
        chr = getChr();


        if (chr === '>'){

            chr = getChr()

            return Tokenizer.SELF_CLOSE_TAG
        }else{

            while(isAlphanumeric(chr)){

                chr = getChr();
            }

            return Tokenizer.WORD;

        }
    }

    
    if (chr === '<') {
        chr = getChr()
        if (chr === "!") {
            
            valStr = '<!';

            chr = getChr();
            
            if(chr === '-'){

                chr = getChr();

                
                if (chr === '-'){
                    chr = getChr();
                    return Tokenizer.OPEN_COM;

                }else{

                    throw new Error(`TOKEN ERROR, Expected to find '<!--'  but got  '<!-${chr}' instead`)
                }

            }

            let isComment = false;
            while (isAlphanumeric(chr)) {
                
                valStr += chr;
                chr = getChr();
              
            } 

            valStr += chr;
            
            if (valStr !== "<!DOCTYPE " && valStr !== "<!doctype "  ) {
                throw new Error(`TOKEN ERROR, Expected to find the word '<!DOCTYPE ' but got ${valStr} instead` );
            }else{
                return Tokenizer.DOCTYPE_P1;
            }


        }else if(chr == '/')
        {
            chr = getChr()
            return Tokenizer.CLOSE_TAG;
        }
        return Tokenizer.LEFT_ANGLE
    }

    

    if (isAlphanumeric(chr) ) {
        valStr = chr;
       
        chr = getChr()
        
        // valStr = chr;
        while (isAlphanumeric(chr)  && chr !== undefined) {


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



    if (chr == '>') {
        
        chr = getChr()
        return Tokenizer.RIGHT_ANGLE;
        
    }


    if (chr == '/'){

        chr = getChr()
 
        if (chr == '>') {

            chr = getChr();
            return Tokenizer.SELF_CLOSE_TAG;
            
        }


        throw new Error(`TOKEN ERROR, Expected a '>' but got ${chr} instead`)
    }


    if (chr == '='){
        chr = getChr();
        return Tokenizer.EQUAL
    }


    if (chr == '"' || chr == "'"){


        const Quote = chr;

        chr = getChr();
        valStr = '';
        while (chr !== Quote ){
            
            if (idx == lenStr) {
                
                throw new Error('Reached END OF FILE before quote was finished')
            }

            valStr += chr;
            chr = getChr()
        }
        
        chr = getChr()
        return Tokenizer.QUOTED_WORD;
    }
     

    
    
    chr = getChr()
    return Tokenizer.BAD_TOKEN;

    
  

    
    //console.log(chr.charCodeAt(0), "\n".charCodeAt(0));
    // if(chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r'){

    //     chr = getChr();

     
        
    //     while (chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r') {
    //         chr = getChr();            
            
    //     }


    //     return Tokenizer.WS;

    // }   





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



