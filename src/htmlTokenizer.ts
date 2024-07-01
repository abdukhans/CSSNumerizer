// NOTE ALWAYS MATCH THE TOKEN WITH GREATEST LENGTH
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

}

export var TOKEN:Tokenizer | undefined  = null;
export var chr:string | undefined = null; 
export var htmlString: string = '';
export var idx:number = 0;
export var lenStr: number = 0 ;
export var valStr:string ='';




export function isWhiteSpace(chr:string):boolean {
    

    return chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r';
}

export function getChr():string {


    return htmlString[idx++];

}


export function isAlphanumeric(str:string | undefined) {
  return (str !== null && /^[a-zA-Z0-9]+$/.test(str)) || chr == '-' ;
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



    
    if (chr === '<') {
        chr = getChr()
        if (chr === "!") {
            
            valStr = '<!';

            chr = getChr();
            while (isAlphanumeric(chr)) {
                valStr += chr;
                chr = getChr();
                // if (idx === lenStr ) {


                //     return Tokenizer.EOF;
                    
                // }
            } 

            valStr += chr;
            
            if (valStr !== "<!DOCTYPE ") {
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
        while (chr !== Quote){
            
            if (idx == lenStr) {
                
                throw new Error('Reached END OF FILE before quote was finished')
            }

            valStr += chr;
            chr = getChr()
        }
        
        chr = getChr()
        return Tokenizer.QUOTED_WORD;
    }
     

    
    

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



export function TestInit(html:string) {


    TOKEN  = null;
    idx = 0;
   
    lenStr= 0 ;
    valStr =''; 
 
    htmlString = html;

    lenStr = htmlString.length;

    chr = getChr(); 



}



