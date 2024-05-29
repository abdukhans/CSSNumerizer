declare class HTML_Node{
    private  tagName:string;
    private  className:string |undefined;
    private  idName: string | undefined;


    constructor(tagName:string, className:string|undefined, idName: string|undefined);
}



export {HTML_Node}