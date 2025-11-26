import axios from "axios";

const API = "http://localhost:8080/api/notes";

// Always include token in header
function authHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// GET ALL NOTES
export async function getNotes(userId) {
  const res = await axios.get(`${API}?userId=${userId}`, {
    headers: authHeader(),
  });

  return res.data; // returns array
}

// GET A SINGLE NOTE
export async function getNote(id, userId) {
  const res = await axios.get(`${API}/${id}?userId=${userId}`, {
    headers: authHeader(),
  });

  return res.data; // returns a single note
}

export async function createNote(data) {
  const res = await axios.post(API, data, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  return res.data;
}

export async function updateNote(id, data, userId) {
  const token = localStorage.getItem("token");

  const res = await axios.put(`${API}/${id}?userId=${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

export async function deleteNoteApi(id, userId) {
  await axios.delete(`${API}/${id}?userId=${userId}`, {
    headers: authHeader(),
  });

  return true;
}
