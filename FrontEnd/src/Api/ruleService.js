import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Fetch all rules
export const getRules = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/rules`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rules:', error);
        throw new Error(error.response?.data?.error || 'Error fetching rules.');
    }
};

// Delete a rule by ID
export const deleteRule = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/rules/${id}`);
    } catch (error) {
        console.error('Error deleting rule:', error);
        throw new Error(error.response?.data?.error || 'Error deleting rule.');
    }
};

// Save or update a rule
export const saveOrUpdateRule = async (id, name, ruleString) => {
    const data = { name, ruleString };
    try {
        if (id) {
            await axios.put(`${BASE_URL}/rules/${id}`, data);
        } else {
            await axios.post(`${BASE_URL}/create-rule`, data);
        }
    } catch (error) {
        console.log("api");
        console.error('Error saving rule:', error);
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.error || 'An unexpected error occurred';
            if (status === 400) {
                throw new Error('Validation Error: ' + message);
            } else if (status === 500) {
                if (message.includes('duplicate key error')) {
                    throw new Error('A rule with this name already exists.');
                }
                throw new Error('Server Error: ' + message);
            } else {
                throw new Error(message);
            }
        } else if (error.request) {
            throw new Error('Network Error: No response from server.');
        } else {
            throw new Error('Error: ' + error.message);
        }
    }
};

// Combine rules
export const combineRules = async ({ ruleNames, operator }) => {
    const data = { ruleNames, operator };
    try {
        const response = await axios.post(`${BASE_URL}/combine-rules`, data);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(error.response.data.error);
            throw new Error(error.response.data.error);
        }
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || 'An unexpected error occurred while combining rules.');
        } else {
            throw new Error('Network Error: Unable to connect to the server.');
        }
    }
};

// Check eligibility
export const checkEligibility = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/check-eligibility`, data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || 'An unexpected error occurred while combining rules.');
        }else{
        throw new Error('Error while checking eligibility: ' + error.message);
        }
    }
};
