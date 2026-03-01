import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const createQRCode = async (campaign_name: string, target_url: string) => {
    let base_url = 'http://localhost:3000';
    if (typeof window !== 'undefined') {
        base_url = window.location.origin;
    }
    const response = await api.post('/qr', { campaign_name, target_url, base_url });
    return response.data;
};

export const getQRCodes = async () => {
    const response = await api.get('/qr');
    return response.data;
};

export const getAnalytics = async (qr_id: string) => {
    const response = await api.get(`/analytics/${qr_id}`);
    return response.data;
};

export default api;
