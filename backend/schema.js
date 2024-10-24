const Joi = require('joi');

module.exports.ruleSchema = Joi.object({
  name: Joi.string().required(),  // Name of the rule should be a required string
  ruleString: Joi.string().required(),  // Rule string should be a required string
  ast: Joi.object(),  // AST should be a required object
  // createdAt: Joi.date().default(() => new Date(), 'current date')  // Comment this out temporarily
});
