export class ATTR_AST{


    className:string|undefined;
    idName:string|undefined;

    constructor(){
        this.className = null;
        this.idName    = null;
    }

    getClassName(){
        return this.className;

    }

    setClassName(className:string){

        this.className = className;
    }

    setIdName(idName:string){
        this.idName = idName;
    }


    getIdName(){
        return this.idName;

    }

}