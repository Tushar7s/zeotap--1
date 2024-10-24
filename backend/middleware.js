const ExpressError = require("./utils/ExpressError.js");
const Rule = require('./schemas/Rule');
const {ruleSchema} = require('./schema.js');

module.exports.isUnique = async(req, res, next) => {
    const {name} = req.body;
    const existingRule = await Rule.findOne({name});
    if (existingRule) {
        // If listing with the same name exists, throw an error
        return res.status(409).json({ error: 'Rule with this name already exists' });
      }
    next();
}

module.exports.isRequired = async(req, res, next) => {
    const { ruleNames, operator} = req.body;
  if (!ruleNames || !operator) {
    return res.status(400).json({ error: 'Both rule names and operator are required.' });
  }
  next();
}

module.exports.isPresent = async(req, res, next) => {
    const {ruleNames} = req.body;
    const rules = await Rule.find({ name: { $in: ruleNames } });

    // Check if all rule names exist in the database
    const existingRuleNames = rules.map(rule => rule.name);
    const missingRules = ruleNames.filter(ruleName => !existingRuleNames.includes(ruleName));
  
    if (missingRules.length > 0) {
      // If there are missing rules, return an error message with the missing rule names
      return res.status(404).json({ error: `The following rule(s) do not exist: ${missingRules.join(', ')}` });
    }
    next();
}
module.exports.atLeastTwo = async (req, res, next) => {
    const { ruleNames } = req.body;
    // Check if ruleNames is an array and has at least two elements
    if (!Array.isArray(ruleNames) || ruleNames.length < 2) {
        return res.status(400).json({ error: "At least two rules are required." });
    }
    next();
}

module.exports.validateRule = async(req, res, next) => {
    const{error} = ruleSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
