const express = require('express');
const { createRule, combineRules, evaluateRule } = require('../services/ruleService');
const Rule = require('../schemas/Rule');
const rulesController = require("../controller/rules.js");
const wrapAsync = require('../utils/wrapAsync');  // Import wrapAsync utility
const router = express.Router();
router.use(express.urlencoded({extended:true})); 
const {isUnique, isPresent, validateRule, isRequired, atLeastTwo} = require('../middleware.js');

// API to create a new rule
router.post('/create-rule', validateRule,  isUnique, wrapAsync(rulesController.createRules))

// API to check eligibility
router.post('/check-eligibility', wrapAsync(rulesController.checkEligibility))

// API to combine rules
router.post('/combine-rules', isRequired, isPresent, atLeastTwo, wrapAsync(rulesController.combineRule))

// API to update a rule
router.put('/rules/:id', wrapAsync(rulesController.updateRule))

// API to delete a rule
router.delete('/rules/:id', wrapAsync(rulesController.destroyRule))

// API to get all rules
router.get('/rules', wrapAsync(rulesController.displayRules))

module.exports = router;
