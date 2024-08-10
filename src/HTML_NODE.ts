
export class HTML_Node {

    tagName:string;
    className:string|undefined;
    idName: string|undefined;

    objNum:number;

    

    specialRoot:boolean;

    static obj_id = -1;

    constructor(tagName:string, className:string|undefined, idName: string|undefined){

        this.tagName= tagName;
        this.className = className;
        this.idName = idName;
        this.specialRoot = false;

        HTML_Node.obj_id += 1;

        this.objNum = HTML_Node.obj_id

    }

    setClassName(newClassName:string){
        this.className = newClassName;


    }

    getObjId(){
        return this.objNum;
    }

    makeSpecialRoot(){
        this.specialRoot = true;
    }

    isSpecialRoot(){

        return this.specialRoot;
    }
    setTagName(newTagName:string){
        this.tagName = newTagName;

        
    }

    
    setIdName(newIdName:string){
        this.idName = newIdName;

        
    }
}