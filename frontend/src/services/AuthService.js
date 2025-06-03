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

export const register = async (username, email, password) => {
    try {
        const response = await API.post('/auth/register', {username, email, password});
        const { token } = response.data;
        // Store token
        localStorage.setItem('token', token);
        return token;
    } catch (error) {
        throw error.response?.data?.error || "Registration failed";
    }
};

export const retrieveUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        console.log("Retrieving user");
        const response = await API.get('/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message || "Failed to retrieve user";
    }
}