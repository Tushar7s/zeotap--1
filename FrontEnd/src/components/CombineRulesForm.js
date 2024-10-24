import React, { useState } from 'react';
import ErrorHandler from './ErrorHandler'; // Ensure this component exists
import { combineRules } from '../Api/ruleService'; // Adjust based on your structure
import '../styles/combinerule.css'
const CombineRulesForm = () => {
    const [rules, setRules] = useState([{ ruleString: '' }]);
    const [operator, setOperator] = useState('AND');
    const errorHandlerRef = React.useRef();

    const handleRuleChange = (index, event) => {
        const newRules = [...rules];
        newRules[index].ruleString = event.target.value;
        setRules(newRules);
    };

    const addRule = () => {
        setRules([...rules, { ruleString: '' }]);
    };

    const removeRule = (index) => {
        const newRules = [...rules];
        newRules.splice(index, 1);
        setRules(newRules);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await combineRules({
                ruleNames: rules.map(rule => rule.ruleString),
                operator
            });
            errorHandlerRef.current.showSuccess(response.data.message);
        } catch (err) {
            // Handle errors uniformly
            const errorMsg = err.message || 'Error combining rules. Please try again.';
            errorHandlerRef.current.showError(errorMsg);
        }
    };

    return (
        <div className="combine-rules-container">
            <ErrorHandler ref={errorHandlerRef} />
            <h1>Combine Rules</h1>
            <form onSubmit={handleSubmit}>
                {rules.map((rule, index) => (
                    <div key={index} className="rule-input">
                        <input
                            type="text"
                            placeholder={`Rule ${index + 1}`}  // Ensure backticks are used
                            value={rule.ruleString}
                            onChange={(e) => handleRuleChange(index, e)}
                            required
                        />
                        {index > 0 && (
                            <button type="button" onClick={() => removeRule(index)}>
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addRule}>
                    Add Another Rule
                </button>
                <div className="operator-selection">
                    <label>
                        Combine using:
                        <select value={operator} onChange={(e) => setOperator(e.target.value)}>
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Combine Rules</button>
            </form>
        </div>
    );
};

export default CombineRulesForm;
