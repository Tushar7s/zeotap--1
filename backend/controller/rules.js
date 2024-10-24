const Rule = require('../schemas/Rule');
const { createRule, combineRules, evaluateRule } = require('../services/RuleService');

module.exports.createRules = async(req, res) => {
  const { name, ruleString } = req.body;
  const ast = createRule(ruleString); // Create AST using rule string
  const newRule = new Rule({ name, ruleString, ast });

  await newRule.save(); // Save rule in the database
  return res.status(201).json({ message: `Rule '${name}' created successfully!` });
}

module.exports.checkEligibility = async(req, res) =>  {
    const { age, department, salary, experience } = req.body;
    const rules = await Rule.find(); // Fetch all eligibility rules from the database
    
    if (rules.length === 0) {
      return res.status(404).json({ error: 'No eligibility rules found.' });
    }
  
    const userData = { age, department, salary, experience };
    const isEligible = rules.some(rule => evaluateRule(rule.ast, userData));
  
    return res.json({ eligible: isEligible });
  }

module.exports.combineRule = async(req, res) => {
  const { ruleNames, operator } = req.body;
  const rules = await Rule.find({ name: { $in: ruleNames } });
  const combinedAst = await combineRules(ruleNames, operator);
  const combinedRuleString = rules.map(rule => rule.ruleString).join(` ${operator} `);

  const newRule = new Rule({
    name: `combined_rule_${Date.now()}`,
    ruleString: combinedRuleString,
    ast: combinedAst
  });

  await newRule.save();
  return res.status(201).json({ message: 'Combined rule created successfully!', rule: newRule });
}

module.exports.updateRule = async(req, res) => {
    const { name, ruleString } = req.body;
    const ast = createRule(ruleString);
    const updatedRule = await Rule.findByIdAndUpdate(req.params.id, { name, ruleString, ast }, { new: true });
    res.status(200).json(updatedRule);
}

module.exports.destroyRule = async(req, res) => {
    const { id } = req.params;
    const rule = await Rule.findByIdAndDelete(id);

    res.status(200).json({ message: 'Rule deleted successfully' });
}

module.exports.displayRules = async(req, res) => {
    const rules = await Rule.find();
  res.status(200).json(rules);
}