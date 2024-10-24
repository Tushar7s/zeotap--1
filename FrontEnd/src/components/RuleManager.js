import React, { useEffect, useState, useRef } from 'react';
import { getRules, deleteRule } from '../Api/ruleService';
import RuleForm from './AddRuleForm';
import ErrorHandler from './ErrorHandler';
import Shimmer from './Shimmer'; // Import the Shimmer component

const RuleManager = () => {
    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState(null);
    const [reload, setReload] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const errorHandlerRef = useRef();

    useEffect(() => {
        const fetchRules = async () => {
            setLoading(true);
            try {
                const rulesData = await getRules();
                setRules(rulesData);
            } catch (error) {
                console.error('Error fetching rules:', error);
                errorHandlerRef.current.showError('Error fetching rules. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
    }, [reload]);

    const handleEdit = (rule) => {
        setSelectedRule(rule);
        setIsEditing(true);  // Open popover for editing
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await deleteRule(id);
            setReload((prev) => !prev);  // Refresh the rules list after delete
        } catch (error) {
            console.error('Error deleting rule:', error);
            errorHandlerRef.current.showError('Error deleting rule. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRuleUpdated = () => {
        setReload((prev) => !prev);  // Refresh the rules list after updating
        closePopover();  // Close the popover after rule update
    };

    const closePopover = () => {
        setIsEditing(false);
        setSelectedRule(null);  // Clear selected rule after closing the popover
    };

    return (
        <div className="rule-manager-container">
            <ErrorHandler ref={errorHandlerRef} />
            <h1>Manage Rules</h1>
            {loading && <Shimmer />} {/* Shimmer effect while loading */}
            {isEditing && selectedRule && (
                <div className="popover">
                    <RuleForm
                        existingRule={selectedRule}
                        closePopover={closePopover}  // Pass the close popover handler
                    />
                </div>
            )}
            <h2>Existing Rules</h2>
            <table className="rules-table">
                <thead>
                    <tr>
                        <th>Rule Name</th>
                        <th>Rule String</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rules.map((rule) => (
                        <tr key={rule._id}>
                            <td>{rule.name}</td>
                            <td>{rule.ruleString}</td>
                            <td>
                                <div className="actions">
                                    <button onClick={() => handleEdit(rule)}>Edit</button>
                                    <button onClick={() => handleDelete(rule._id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RuleManager;
