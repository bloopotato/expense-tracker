import API from './api.js';

export const createCategory = async (name, colour, type) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const response = await API.post('/categories/create', {name, colour, type},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Failed to create category";
    }
};

export const retrieveCategories = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const response = await API.get('/categories', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message || "Failed to retrieve categories";
    }
}

export const editCategory = async (id, name, colour, type) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const response = await API.put(`/categories/${id}`,
            {name, colour, type},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message || "Failed to edit category";
    }
}

export const deleteCategory = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const response = await API.delete(`/categories/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message || "Failed to edit category";
    }
}