"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_Node = void 0;
class HTML_Node {
    constructor(tagName, className, idName) {
        this.tagName = tagName;
        this.className = className;
        this.idName = idName;
        this.specialRoot = false;
        HTML_Node.obj_id += 1;
        this.objNum = HTML_Node.obj_id;
    }
    setClassName(newClassName) {
        this.className = newClassName;
    }
    getObjId() {
        return this.objNum;
    }
    makeSpecialRoot() {
        this.specialRoot = true;
    }
    isSpecialRoot() {
        return this.specialRoot;
    }
    setTagName(newTagName) {
        this.tagName = newTagName;
    }
    setIdName(newIdName) {
        this.idName = newIdName;
    }
}
exports.HTML_Node = HTML_Node;
HTML_Node.obj_id = -1;
//# sourceMappingURL=HTML_NODE.js.map