import API from './api.js';

export const createTransaction = async (payload) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const response = await API.post('/transactions/create',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Failed to create transaction";
    }
};

export const editTransaction = async (id, payload) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const response = await API.put(`/transactions/${id}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Failed to edit transaction";
    }
}

export const deleteTransaction = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const response = await API.delete(`/transactions/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    }
    catch (error) {
        throw error.response?.data?.error || "Failed to delete transaction";
    }
}

export const retrieveTransactionsByDate = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const response = await API.get('/transactions/group', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message || "Failed to retrieve grouped transactions";
    }
}