import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000', // local
  baseURL: 'http://13.54.207.234:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
