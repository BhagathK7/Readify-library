const API_URL = import.meta.env.VITE_API_URL || 'http://readify-backend:5000/api';

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