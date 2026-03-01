import axios from 'axios';

const getBaseURL = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return `${window.location.origin}/api`;
        }
        return `http://${hostname}:8000/api`;
    }
    return 'http://localhost:8000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

export const createQRCode = async (campaign_name: string, target_url: string) => {
    const response = await api.post('/qr/', { campaign_name, target_url });
    return response.data;
};

export const getQRCodes = async () => {
    const response = await api.get('/qr/');
    return response.data;
};

export const getAnalytics = async (qr_id: string) => {
    const response = await api.get(`/analytics/${qr_id}`);
    return response.data;
};

export default api;
