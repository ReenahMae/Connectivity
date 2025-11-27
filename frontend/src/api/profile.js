import axios from "axios";

const API_URL = "http://localhost:8080/api/profile";

const token = localStorage.getItem("token");

export const getProfile = () => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateProfile = (data) => {
  return axios.put(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
    