import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const folderApi = {
  // Get all folders
  getAllFolders: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/folders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get single folder
  getFolder: async (folderId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/folders/${folderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Create folder
  createFolder: async (folderData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/folders`, folderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update folder
  updateFolder: async (folderId, folderData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/folders/${folderId}`, folderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Delete folder
  deleteFolder: async (folderId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/folders/${folderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};