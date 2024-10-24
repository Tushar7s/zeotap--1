import React, { useState, useEffect } from 'react';
import { saveOrUpdateRule } from '../Api/ruleService';
import ErrorHandler from './ErrorHandler'; // Import ErrorHandler
import validateRule from './RuleValidation';

const AddRuleForm = ({ existingRule = null, closePopover }) => {
    const [ruleName, setRuleName] = useState(existingRule ? existingRule.name : '');
    const [ruleString, setRuleString] = useState(existingRule ? existingRule.ruleString : '');
    const errorHandlerRef = React.useRef();

    useEffect(() => {
        if (existingRule) {
            setRuleName(existingRule.name);
            setRuleString(existingRule.ruleString);
        }
    }, [existingRule]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ruleName) {
            errorHandlerRef.current.showError('Please enter a rule name.');
            return;
        }

        try {
            // Validate the rule string before saving
            validateRule(ruleString);

            // If validation passes, save or update the rule
            await saveOrUpdateRule(existingRule?._id, ruleName, ruleString);
            
            errorHandlerRef.current.showSuccess('Rule saved successfully!');
            
            // After successful update, call onRuleUpdated and closePopover
        } catch (err) {
            console.log(err);
            errorHandlerRef.current.showError(err.message || 'Error saving the rule. Please try again.');
        }
    };

    return (
        <div className="rule-form-container">
            <ErrorHandler ref={errorHandlerRef} />
            <h2>{existingRule ? 'Edit Rule' : 'Add New Rule'}</h2>
            <button className="close-button" onClick={closePopover}>×</button> {/* Add close button here */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="ruleName">Rule Name:</label>
                    <input
                        type="text"
                        id="ruleName"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        placeholder="Enter rule name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ruleString">Rule String:</label>
                    <input
                        type="text"
                        id="ruleString"
                        value={ruleString.toUpperCase()}
                        onChange={(e) => setRuleString(e.target.value)}
                        placeholder="( ( AGE > 30 AND DEPARTMENT = SALES ) OR ( AGE > 45 AND SALARY > 5000 ) ) ENSURE PROPER SPACING AS SHOWN, DEPARTMENT NAME WITHOUT QUOTES"
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="submit">{existingRule ? 'Update Rule' : 'Add Rule'}</button>
                </div>
            </form>
        </div>
    );
};

export default AddRuleForm;
