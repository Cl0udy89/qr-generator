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

export const getAnalytics = async (qr_id: string, timeframe: string = 'all') => {
    const response = await api.get(`/analytics/${qr_id}?timeframe=${timeframe}`);
    return response.data;
};

export const getAnalyticsLogs = async (qr_id: string) => {
    const response = await api.get(`/analytics/${qr_id}/logs`);
    return response.data;
};

export const updateQRCode = async (qr_id: string, campaign_name: string, target_url: string) => {
    const response = await api.put(`/qr/${qr_id}`, { campaign_name, target_url });
    return response.data;
};

export const deleteQRCode = async (qr_id: string) => {
    const response = await api.delete(`/qr/${qr_id}`);
    return response.data;
};

export default api;
