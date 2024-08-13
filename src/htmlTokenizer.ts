var debugMap = {}

// NOTE THIS SHOULD ALWAYS MATCH THE TOKEN WITH GREATEST LENGTH
export  enum Token{
    DOCTYPE_P1   ,     // '<!DOCTYPE '
    LEFT_ANGLE ,    // '<'
    RIGHT_ANGLE,    // '>'
    SELF_CLOSE_TAG ,     // '/>' 
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

const notTextChar= 
    ['>','<', '"',"'", '/', "=" ," ","\n","\t","\r" ];
export class Tokenizer{



    TOKEN:Token | undefined  = null;
    chr:string | undefined = null; 
    htmlString: string = '';
    idx:number = 0;
    lenStr: number = 0 ;
    valStr:string ='';
    line_num = 1;
    col_num  = 0

    constructor(){
        

        this.TOKEN  = null;
        this.idx = 0;
    
        this.lenStr= 0 ;
        this.valStr =''; 
    
        this.htmlString ;

        this.lenStr = this.htmlString.length;

        this.chr = this.getChr(); 


    }


    public Init(html:string){
        this.TOKEN  = null;
        this.idx = 0;
    
        this.lenStr= 0 ;
        this.valStr =html; 
    
        this.htmlString = html ;

        this.lenStr = this.htmlString.length;

        this.chr = this.getChr(); 
        
        
    }

    
    isWhiteSpace(chr: string) {
            
        if (chr === '\n' ){
            this.line_num += 1;
        }

        return chr === " " || chr === "\n" || chr ===  "\t" || chr === '\r';
       
    }

    public getChr():string{
        return this.htmlString[this.idx++];

    }

    JumpWhiteSpace(){
        while (this.isWhiteSpace(this.chr)) {
        
            this.chr = this.getChr(); 
        }   

    }


    isTxtChrs(str:string | undefined){
        return !(notTextChar.includes(str)) && str !== null;

    }
    public getToken(): Token{


        this.JumpWhiteSpace();

        if(this.idx === this.lenStr + 1 ){
            return Token.EOF;
        }


        switch(this.chr){
            case '/':{                        
                this.chr = this.getChr()
                if(this.chr=== '>'){
                    this.chr= this.getChr();
                    return Token.SELF_CLOSE_TAG;
                }else{
                    this.valStr = '/';
                    while(this.isTxtChrs(this.chr)){
                       this.valStr += this.chr

                        this.chr= this.getChr()

                    }
                    return Token.WORD;
                }

            }
            case '<' :{
               this.valStr = '<'
                this.chr= this.getChr()
    
                if(this.chr=== "!"){
                   this.valStr += this.chr
                    this.chr= this.getChr();
                    if (this.chr=== '-'){
                        this.chr= this.getChr();

                        if(this.chr=== '-'){
                            this.chr= this.getChr();
                            return Token.OPEN_COM;
                        }else{
                            throw new Error(`TOKEN ERROR, Expected to find '<!--' but got '<!${this.chr}' instead.`)
                        }

                    }  


                    // This will tokenize for 
                    // the beginning doctype preamble
                    while (this.isTxtChrs(this.chr)){
                       this.valStr += this.chr
                        this.chr= this.getChr();
                    }
                    

                   this.valStr += this.chr // <--- This is here to allow for the space char
                                //      to be added 
                    
                    
                    if(this.valStr !== "<!DOCTYPE " &&this.valStr !== '<!doctype '){
                        throw new Error(`TOKEN ERROR, Expected to find the "<!DOCTYPE " or "<!doctype " but got ${this.valStr} instead`)
                    }else{
                        return Token.DOCTYPE_P1;
                    }

                }else if(this.chr=== '/'){
                    this.chr= this.getChr();
                    return Token.CLOSE_TAG;
                }

                return Token.LEFT_ANGLE;
            }

            case '=':{
                this.chr= this.getChr();
                return Token.EQUAL;
            }
            case '"':{
                this.chr= this.getChr();   
                return Token.DOUBLE_QUOTE;

            }
            case "'":{
                this.chr= this.getChr();
                return Token.SINGLE_QUOTE;
            }
            case '>':{
                this.chr= this.getChr();
                return Token.RIGHT_ANGLE;
            }

            default:{
                break;
            }

        }

        
        if (this.isTxtChrs(this.chr )) {
           this.valStr = this.chr       
            this.chr= this.getChr()


            while (this.isTxtChrs(this.chr ) && this.chr!== undefined  ) {
                if(this.chr=== '-'){
                    this.chr= this.getChr();
                    if(this.chr!== '-'){
                        if(this.idx === this.lenStr){
                            return Token.BAD_TOKEN;
                        }
                        
                       this.valStr += '-'
                        continue
                    }
                    this.chr= this.getChr()
                    if(this.chr!== '>'){


                        if(this.idx === this.lenStr){
                            return Token.WORD;
                        }
                        
                        this.valStr += '--'
                        continue 
                    }


                    return Token.CLOSE_COM

                }
                
               this.valStr += this.chr
                if(this.idx === this.lenStr){
                    return Token.WORD;
                }  

                this.chr= this.getChr();

            
            }
        
            return Token.WORD;
        }


        this.chr= this.getChr();


        return Token.BAD_TOKEN;
    }
    getCommentToken():Token{

        // TODO: FIX THIS !!!!!!!!!!!!!! make it more readable
        while (true) {
            if (this.chr== '-') {
                this.chr= this.getChr()
                if (this.chr=== '-' ){
                    this.chr= this.getChr()
                    if (this.chr=== '>'){
                        this.chr= this.getChr();
                        return Token.CLOSE_COM; 
                    }
                }
                
            }
            
            if(this.idx === this.lenStr){
                break
            }  

            this.chr= this.getChr();
        
    }


    return Token.EOF;


    }
    getJsToken(): Token{
    
        if(this.chr=== '<'){
                this.chr= this.getChr();
                if (this.chr=== '/') {
                    this.chr= this.getChr();
                    return Token.CLOSE_TAG;
                }
        }

        this.chr= this.getChr();
            
        return Token.JS_TOKEN;
    }

}

