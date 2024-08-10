"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_AST = void 0;
class HTML_AST {
    constructor(rootNode) {
        this.rootNode = rootNode;
        this.children = [];
    }
    addNode(node) {
        this.children.push(node);
        node.setParent(this);
    }
    addNodes(nodes) {
        const len = nodes.length;
        for (let idx = 0; idx < len; idx++) {
            const node = nodes[idx];
            this.addNode(node);
        }
    }
    isSpecicalRoot() {
        return this.rootNode.isSpecialRoot();
    }
    setClassName(newClassName) {
        this.rootNode.setClassName(newClassName);
    }
    setTagName(newTagName) {
        this.rootNode.setTagName(newTagName);
    }
    setIdName(newIdName) {
        this.rootNode.setIdName(newIdName);
    }
    setParent(node) {
        this.parent = node;
    }
}
exports.HTML_AST = HTML_AST;
//# sourceMappingURL=HTML_AST.js.map