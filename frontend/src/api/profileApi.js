import axios from "axios";

const API_URL = "http://localhost:8080/api/profile"; // your backend

// Get profile by userId
export const getProfile = (userId) => {
  const token = localStorage.getItem("token");
  return axios.get(`http://localhost:8080/api/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// Update profile by userId
export const updateProfile = (userId, profileData) => {
  const token = localStorage.getItem("token"); // JWT token
  return axios.put(`${API_URL}/${userId}`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
