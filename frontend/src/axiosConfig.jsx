import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000', // local
  baseURL: 'http://3.27.174.126:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
