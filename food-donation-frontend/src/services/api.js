import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// User API
export const userAPI = {
    register: (userData) => api.post('/users', userData),
    getAllUsers: () => api.get('/users'),
    getUserById: (id) => api.get(`/users/${id}`),
    updateUser: (id, userData) => api.put(`/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/users/${id}`)
};

// Food API
export const foodAPI = {
    createFood: (foodData) => api.post('/foods', foodData),
    getAllFoods: () => api.get('/foods'),
    getFoodById: (id) => api.get(`/foods/${id}`),
    updateFood: (id, foodData) => api.put(`/foods/${id}`, foodData),
    deleteFood: (id) => api.delete(`/foods/${id}`)
};

// File Upload API (Retained just in case it's implemented externally)
export const fileAPI = {
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default api;
