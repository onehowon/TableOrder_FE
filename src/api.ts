import axios from 'axios';

const api = axios.create({
  baseURL: 'http://134.185.112.154', // 실제 배포 IP
});

export default api; 