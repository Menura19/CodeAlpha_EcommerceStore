import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const api = axios.create({ baseURL });

// Attach the token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn every failure into a plain Error whose message is safe to show a user.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token rejected: clear it and send them back to sign in.
    if (status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }

    const friendly = error.response?.data?.message
      || (error.code === 'ERR_NETWORK'
        ? 'Cannot reach the server. Check that the backend is running.'
        : 'Something went wrong. Try again.');

    const err = new Error(friendly);
    err.status = status;
    return Promise.reject(err);
  }
);

export default api;
