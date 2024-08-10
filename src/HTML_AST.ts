import {HTML_Node} from './HTML_NODE'
export class HTML_AST{

    parent: HTML_AST | undefined;
    rootNode:HTML_Node; 
    children:HTML_AST[];

    constructor(rootNode:HTML_Node){

        this.rootNode = rootNode;
        this.children = []
    }

    addNode(node:HTML_AST) {
        this.children.push(node);
        node.setParent(this);
    }

    addNodes(nodes:HTML_AST[]){

        const len = nodes.length
            
        for (let idx = 0; idx < len; idx++) {
            const node:HTML_AST = nodes[idx];

            this.addNode(node);
            
        }
    }


    isSpecicalRoot(){
        return this.rootNode.isSpecialRoot();
    }

    setClassName(newClassName:string){

        this.rootNode.setClassName(newClassName);

    }
    setTagName(newTagName:string){

        this.rootNode.setTagName(newTagName);

    }

    setIdName(newIdName:string){

        this.rootNode.setIdName(newIdName);

    }

    private setParent(node:HTML_AST | undefined){
        this.parent = node;
    }

}