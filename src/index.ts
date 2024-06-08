import fetch from 'node-fetch'
import  * as htmlParser from './htmlParser'
import * as htmlTokenizer from './htmlTokenizer'
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


// const test_url = "http://localhost:4545/index.html"
// fetch_html(test_url)



export {htmlTokenizer,htmlParser,fetch_html,test_init}