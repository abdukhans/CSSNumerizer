import {Tokenizer,Token} from './htmlTokenizer'


export function SkipToNextToken(tk:Tokenizer,tokens:Token[]):Token{
    var TOKEN:Token ;
    
    while(!tokens.includes(TOKEN)){

        TOKEN = tk.getToken();    

        // console.log("CUR_TOK: ", Token[TOKEN]);
        

    }
    return TOKEN;
}