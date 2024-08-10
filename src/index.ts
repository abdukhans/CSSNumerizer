import fetch from 'node-fetch'
import  * as htmlParser from './htmlParser'
import {Tokenizer, Token } from './htmlTokenizer'
const fetch_html = async (url:string):Promise<string>  => {
    
    const res= await fetch(url,
        {
            method: "GET",
        }
    )


    const text = await res.text()


    return text;
        

}


const test_init =async (url:string) => {

    const html:string = await fetch_html(url);
     
    
    htmlParser.TestInit(html);


}


export {Tokenizer,Token,htmlParser,fetch_html,test_init}