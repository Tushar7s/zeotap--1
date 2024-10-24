// src/models/Node.js
class ASTNode {
    constructor(type, left = null, right = null, value = null) {
        this.type = type; // e.g., "AND", "OR", "Comparison", etc.
        this.left = left;
        this.right = right;
        this.value = value; // for identifiers or numbers
    }
}

module.exports = ASTNode;
