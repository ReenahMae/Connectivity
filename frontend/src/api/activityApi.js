import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const activityApi = {
  // 1. READ
  getAllLogs: async () => {
    const token = localStorage.getItem('token');
    return (await axios.get(`${API_BASE_URL}/activity`, { headers: { Authorization: `Bearer ${token}` } })).data;
  },

  // 2. CREATE
  createLog: async (logData) => {
    const token = localStorage.getItem('token');
    return (await axios.post(`${API_BASE_URL}/activity`, logData, { headers: { Authorization: `Bearer ${token}` } })).data;
  },

  // 3. UPDATE
  updateLog: async (logId, logData) => {
    const token = localStorage.getItem('token');
    // Ensure URL matches Controller: /api/activity/{logId}
    return (await axios.put(`${API_BASE_URL}/activity/${logId}`, logData, { headers: { Authorization: `Bearer ${token}` } })).data;
  },

  // 4. DELETE
  deleteLog: async (logId) => {
    const token = localStorage.getItem('token');
    return (await axios.delete(`${API_BASE_URL}/activity/${logId}`, { headers: { Authorization: `Bearer ${token}` } })).data;
  }
};