// const validateRuleString = (ruleString) => {
//   // Trim whitespace from the rule string
//   const trimmedString = ruleString.trim();

//   // Check for empty string
//   if (!trimmedString) {
//       throw new Error('Rule string cannot be empty.');
//   }

//   // Define valid attributes
//   const validAttributes = ['age', 'department', 'salary', 'experience'];

//   // Regular expression to validate the rule string
//   const ruleRegex = /^\s*(\(\s*([a-zA-Z_]\w*)\s*([=<>!]=?|!=|<=?|>=?)\s*(?:\d+|'.*?'|".*?)\s*(AND|OR)?\s*)+\)\s*$/;

//   // Check for matching parentheses
//   const openedParentheses = (trimmedString.match(/\(/g) || []).length;
//   const closedParentheses = (trimmedString.match(/\)/g) || []).length;

//   if (openedParentheses !== closedParentheses) {
//       throw new Error('Unmatched parentheses.');
//   }

//   // Validate the rule string against the regex
//   if (!ruleRegex.test(trimmedString)) {
//       throw new Error('Invalid rule string format.');
//   }

//   // Extract all attributes from the rule string
//   const attributeRegex = /([a-zA-Z_]\w*)\s*([=<>!]=?|!=|<=?|>=?)/g;
//   let match;
//   while ((match = attributeRegex.exec(trimmedString)) !== null) {
//       const attribute = match[1];
//       if (!validAttributes.includes(attribute)) {
//           throw new Error(`Invalid attribute: "${attribute}". Allowed attributes are: ${validAttributes.join(', ')}.`);
//       }
//   }
// };

// export default validateRuleString;