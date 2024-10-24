const VALID_VARIABLE = ['AGE', 'SALARY', 'EXPERIENCE', 'DEPARTMENT'];
const VALID_CONDITIONALS = ['AND', 'OR'];
const VALID_OPERATORS = ['=', '!=', '<', '<=', '>', '>='];

const validateRule = (ruleString) => {
    const parts = ruleString.trim().split(/\s+/);

    if (parts.length < 3) {
        throw new Error('Invalid rule format. Rule must contain an attribute, an operator, and a value.');
    }

    let expectingVariable = true;
    let expectingOperator = false;
    let expectingValue = false;
    let expectingConditional = false;
    let currentVariable = null;
    let openBrackets = 0; // Tracks the count of open parentheses

    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];

        // Handle opening parentheses
        if (part === '(') {
            if (!expectingVariable) {
                throw new Error('Opening bracket must be before a variable or conditional.');
            }
            openBrackets++;
            continue; // Move to the next part
        }

        // Handle closing parentheses
        if (part === ')') {
            if (openBrackets === 0) {
                throw new Error('Unmatched closing parenthesis.');
            }
            if (expectingValue || expectingVariable) {
                throw new Error('Closing bracket must come after a value.');
            }
            openBrackets--;
            expectingConditional = true; // Allow conditional after closing parenthesis
            continue; // Move to the next part
        }

        if (expectingVariable) {
            const upperPart = part.toUpperCase();
            if (!VALID_VARIABLE.includes(upperPart)) {
                throw new Error(`Invalid variable "${part}". Expected one of: ${VALID_VARIABLE.join(', ')}.`);
            }
            currentVariable = upperPart; // Store the current variable to validate the value later
            expectingVariable = false;
            expectingOperator = true;
        } else if (expectingOperator) {
            if (!VALID_OPERATORS.includes(part)) {
                throw new Error(`Invalid operator "${part}". Expected one of: ${VALID_OPERATORS.join(', ')}.`);
            }
            expectingOperator = false;
            expectingValue = true;
        } else if (expectingValue) {
            // Check if the value is valid based on the current variable
            if (['AGE', 'SALARY', 'EXPERIENCE'].includes(currentVariable)) {
                if (!/^\d+$/.test(part)) {  // Ensure it's a numeric value
                    throw new Error(`Invalid value "${part}" for ${currentVariable}. Expected an integer.`);
                }
            } else if (currentVariable === 'DEPARTMENT') {
                if (!/^[A-Z]+$/i.test(part)) { // Ensure it's alphabetic
                    throw new Error(`Invalid value "${part}" for ${currentVariable}. Expected a department name.`);
                }
            }

            expectingValue = false;
            expectingConditional = true;
        } else if (expectingConditional) {
            const upperPart = part.toUpperCase();
            if (VALID_CONDITIONALS.includes(upperPart)) {
                expectingConditional = false;
                expectingVariable = true;
            } else {
                throw new Error(`Invalid conditional "${part}". Expected one of: ${VALID_CONDITIONALS.join(', ')} or end of rule.`);
            }
        }
    }

    // Ensure the rule was complete and didn't end prematurely
    if (expectingOperator || expectingValue || expectingVariable) {
        throw new Error('Incomplete rule. Missing operator or value.');
    }

    // Ensure parentheses are balanced
    if (openBrackets !== 0) {
        throw new Error('Unmatched opening parenthesis. Close all parentheses properly.');
    }

    return true; // The rule is valid
};

// Export the validateRule function for use in other files
export default validateRule;
