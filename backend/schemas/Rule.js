// src/models/Rule.js
const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  ruleString: {
    type: String,
    required: true,
  },
  ast: {
    type: Object,  // AST representation of the rule
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rule = mongoose.model('Rule', ruleSchema);
module.exports = Rule;
