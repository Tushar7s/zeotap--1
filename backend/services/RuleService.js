const ASTNode = require('../models/Node'); // Assuming Node is used for DB AST storage
const Rule = require('../schemas/Rule'); // Assuming Rule stores the AST for each rule



class Parser {
    constructor(input) {
        this.tokens = input.split(/\s+/);
        this.currentTokenIndex = 0;
    }

    currentToken() {
        return this.tokens[this.currentTokenIndex];
    }

    advance() {
        this.currentTokenIndex++;
    }

    testAndAdvance(expectedToken) {
        if (this.currentToken() === expectedToken) {
            this.advance();
            return true;
        }
        return false;
    }

    parseExpression() {
        let leftNode = this.parseComparison();

        if (!leftNode) return null;

        while (true) {
            if (this.testAndAdvance("AND")) {
                let rightNode = this.parseComparison();
                if (!rightNode) throw new Error("SyntaxError: Missing expression after AND");
                leftNode = new ASTNode("AND", leftNode, rightNode);
            } else if (this.testAndAdvance("OR")) {
                let rightNode = this.parseComparison();
                if (!rightNode) throw new Error("SyntaxError: Missing expression after OR");
                leftNode = new ASTNode("OR", leftNode, rightNode);
            } else {
                break;
            }
        }

        return leftNode;
    }

    parseComparison() {
        let leftNode = this.parseTerm();
        
        if (!leftNode) return null;

        if (this.testAndAdvance(">")) {
            let rightNode = this.parseTerm();
            if (!rightNode) throw new Error("SyntaxError: Missing right-hand side of comparison");
            return new ASTNode(">", leftNode, rightNode);
        } else if (this.testAndAdvance("<")) {
            let rightNode = this.parseTerm();
            if (!rightNode) throw new Error("SyntaxError: Missing right-hand side of comparison");
            return new ASTNode("<", leftNode, rightNode);
        } else if (this.testAndAdvance(">=")) {
            let rightNode = this.parseTerm();
            if (!rightNode) throw new Error("SyntaxError: Missing right-hand side of comparison");
            return new ASTNode(">=", leftNode, rightNode);
        } else if (this.testAndAdvance("<=")) {
            let rightNode = this.parseTerm();
            if (!rightNode) throw new Error("SyntaxError: Missing right-hand side of comparison");
            return new ASTNode("<=", leftNode, rightNode);
        } else if (this.testAndAdvance("=")) {
            let rightNode = this.parseTerm();
            if (!rightNode) throw new Error("SyntaxError: Missing right-hand side of comparison");
            return new ASTNode("=", leftNode, rightNode);
        } else {
            return leftNode;
        }
    }

    parseTerm() {
        if (this.testAndAdvance("(")) {
            let node = this.parseExpression();
            if (!this.testAndAdvance(")")) throw new Error("SyntaxError: Expected closing parenthesis");
            return node;
        } else {
            return this.parseIdentifierOrNumber();
        }
    }

    parseIdentifierOrNumber() {
        let token = this.currentToken();
        
        if (!isNaN(Number(token))) {
            this.advance();
            return new ASTNode("NUMBER", null, null, Number(token));
        }

        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
            this.advance();
            return new ASTNode("IDENTIFIER", null, null, token);
        }

        return null;
    }
}


// Function to combine multiple rules from the database
async function combineRules(ruleNames, operator = "AND") {
    const rules = await Rule.find({ name: { $in: ruleNames } });

    if (!rules || rules.length === 0) {
        throw new Error('No rules found for the provided names.');
    }

    // Initialize combined AST with the first rule's AST
    let combinedAST = rules[0].ast;

    // Loop through remaining rules and combine them using the operator
    for (let i = 1; i < rules.length; i++) {
        combinedAST = new ASTNode(operator, combinedAST, rules[i].ast);
    }

    return combinedAST;
}

// Function to evaluate a rule against the data set
function evaluateRule(ast, data) {
    if (!ast) {
        console.error('AST is null or undefined.');
        return false;
    }

    switch (ast.type) {
        case "AND":
            return evaluateRule(ast.left, data) && evaluateRule(ast.right, data);
        case "OR":
            return evaluateRule(ast.left, data) || evaluateRule(ast.right, data);
        case ">":
            return Number(data[ast.left.value.toLowerCase()]) > ast.right.value;
        case "<":
            return Number(data[ast.left.value.toLowerCase()]) < ast.right.value;
        case ">=":
            return Number(data[ast.left.value.toLowerCase()]) >= ast.right.value;
        case "<=":
            return Number(data[ast.left.value.toLowerCase()]) <= ast.right.value;
        case "=":
            return data[ast.left.value.toLowerCase()].toString() == ast.right.value.toString();
        case "IDENTIFIER":
            return data[ast.value.toLowerCase()];
        case "NUMBER":
            return ast.value;
        default:
            return false;
    }
}



// Function to create a rule from a string input
function createRule(ruleString) {
    const parser = new Parser(ruleString);
    return parser.parseExpression();
}

module.exports = {
    createRule,
    combineRules,
    evaluateRule
};
