import { api } from '../utils/apiClient';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getAllLevels = async () => {
    try {
        const data = await api.get(`${API}/levels`);
        return { ok: true, data };
    } catch (error) {
        console.error('Error fetching levels:', error);
        return { 
            ok: false, 
            error: error.message || 'Failed to fetch levels' 
        };
    }
}

export const getLevelById = async (id) => {
    try {
        const data = await api.get(`${API}/level/${id}`);
        return { ok: true, data };
    } catch (error) {
        console.error('Error fetching level:', error);
        return { 
            ok: false, 
            error: error.message || 'Failed to fetch level' 
        };
    }
}