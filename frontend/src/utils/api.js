// frontend/src/utils/api.js

const getApiUrl = () => {
  // If running inside Kubernetes (production build)
  if (window.location.hostname !== "localhost") {
    return "http://readify-backend:5000/api";
  }

  // Local / Jenkins
  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();

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