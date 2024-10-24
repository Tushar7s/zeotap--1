import React, { useState, useRef } from 'react';
import { checkEligibility } from '../Api/ruleService';
import ErrorHandler from './ErrorHandler';
import Shimmer from './Shimmer'; // Import the Shimmer component
import '../styles/eligibility.css'
const Eligibility = () => {
    const [data, setData] = useState({
        age: '',
        department: '',
        salary: '',
        experience: ''
    });
    const [eligibility, setEligibility] = useState(null);
    const [loading, setLoading] = useState(false);
    const errorHandlerRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    };

    const handleEligibilityCheck = async () => {
        setLoading(true);
        if (!data.age || !data.department || !data.salary || !data.experience) {
            errorHandlerRef.current.showError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            const response = await checkEligibility(data);
            setEligibility(response.eligible);
            if (response.eligible) {
                errorHandlerRef.current.showSuccess('You are eligible!');
            } else {
                errorHandlerRef.current.showError('You are not eligible.');
            }
        } catch (error) {
            console.log(error);
            errorHandlerRef.current.showError(error.message || 'An error occurred while checking eligibility.');
            setEligibility(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="eligibility-container">
            <h1>Check Your Eligibility</h1>
            <input
                type="number"
                name="age"
                placeholder="Age"
                value={data.age}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="department"
                placeholder="Department"
                value={data.department.toUpperCase()}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={data.salary}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                value={data.experience}
                onChange={handleChange}
                required
            />
            <button onClick={handleEligibilityCheck} disabled={loading}>
                {loading ? 'Checking...' : 'Check Eligibility'}
            </button>

            <table>
                <thead>
                    <tr>
                        <th>Age</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Experience</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && <Shimmer />} {/* Show shimmer while loading */}
                    {eligibility !== null && (
                        <tr className={`eligibility-result ${eligibility ? 'eligible' : 'not-eligible'}`}>
                            <td>{data.age}</td>
                            <td>{data.department}</td>
                            <td>{data.salary}</td>
                            <td>{data.experience}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <ErrorHandler ref={errorHandlerRef} />
        </div>
    );
};

export default Eligibility;
