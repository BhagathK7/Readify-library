// frontend/src/utils/api.js

// 🔥 FINAL FIXED API URL (use your Minikube backend URL)
const API_URL = "http://192.168.49.2:32524/api";

export const fetchJSON = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}${url}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    },
    ...options
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.message || 'API Error');
  }

  return data;
};