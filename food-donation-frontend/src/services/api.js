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
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    getAllUsers: () => api.get('/users'),
    getUserById: (id) => api.get(`/users/${id}`),
    updateUser: (id, userData) => api.put(`/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/users/${id}`)
};

// Food Donation API
export const donationAPI = {
    createDonation: (donationData) => api.post('/donations', donationData),
    getAllDonations: () => api.get('/donations'),
    getDonationById: (id) => api.get(`/donations/${id}`),
    getDonationsByUserId: (userId) => api.get(`/donations/user/${userId}`),
    getAvailableDonations: () => api.get('/donations/available'),
    searchDonations: (foodType) => api.get(`/donations/search?foodType=${foodType}`),
    updateDonation: (id, donationData) => api.put(`/donations/${id}`, donationData),
    updateDonationStatus: (id, status) => api.patch(`/donations/${id}/status`, { status }),
    deleteDonation: (id) => api.delete(`/donations/${id}`)
};

// Request API
export const requestAPI = {
    createRequest: (requestData) => api.post('/requests', requestData),
    getAllRequests: () => api.get('/requests'),
    getRequestById: (id) => api.get(`/requests/${id}`),
    getRequestsByDonationId: (donationId) => api.get(`/requests/donation/${donationId}`),
    getRequestsByReceiverId: (receiverId) => api.get(`/requests/receiver/${receiverId}`),
    updateRequestStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
    updateRequest: (id, requestData) => api.put(`/requests/${id}`, requestData),
    deleteRequest: (id) => api.delete(`/requests/${id}`)
};

// Feedback API
export const feedbackAPI = {
    createFeedback: (feedbackData) => api.post('/feedback', feedbackData),
    getAllFeedback: () => api.get('/feedback'),
    getFeedbackById: (id) => api.get(`/feedback/${id}`),
    getFeedbackByDonationId: (donationId) => api.get(`/feedback/donation/${donationId}`),
    getFeedbackByUserId: (userId) => api.get(`/feedback/user/${userId}`),
    updateFeedback: (id, feedbackData) => api.put(`/feedback/${id}`, feedbackData),
    deleteFeedback: (id) => api.delete(`/feedback/${id}`)
};

// File Upload API
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

// Analytics API
export const analyticsAPI = {
    getStats: () => api.get('/analytics/stats')
};

export default api;
