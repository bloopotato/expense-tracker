import API from './api.js';

export const login = async (email, password) => {
    try {
        const response = await API.post('/auth/login', {email, password});
        const { token } = response.data;
        // Store token
        localStorage.setItem('token', token);
        return token;
    } catch (error) {
        throw error.response?.data?.error || "Login failed";
    }
};

export const register = async (userData) => {

};