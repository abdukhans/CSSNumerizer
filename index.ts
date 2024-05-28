import fetch from 'node-fetch'
const fetch_html = async (url:string):Promise<string>  => {
    
    const res= await fetch(url,
        {
            method: "GET",
        }
    )


    const text = await res.text()


    return text;
        

}



// const test_url = "http://localhost:4545/index.html"
// fetch_html(test_url)

export { fetch_html}