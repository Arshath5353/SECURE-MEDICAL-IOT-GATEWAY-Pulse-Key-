import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const getECGData = async () => {
    return await axios.get(`${API_BASE_URL}/ecg-stream`);
};

export const generateBioKey = async () => {
    return await axios.post(`${API_BASE_URL}/generate-key`);
};

export const encryptData = async (medicalData) => {
    return await axios.post(`${API_BASE_URL}/encrypt`, { medical_data: medicalData });
};

export const decryptData = async () => {
    return await axios.post(`${API_BASE_URL}/decrypt`);
};