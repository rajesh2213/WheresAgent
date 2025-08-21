import { api } from '../utils/apiClient';

const API = import.meta.env.VITE_API_URL;

export async function createGameSession({ playerName, levelId }) {
    try {
        const data = await api.post(`${API}/game`, {
            playerName,
            levelId
        });
        return { ok: true, data };
    } catch (error) {
        console.error('Error creating game session:', error);
        return { 
            ok: false, 
            error: error.message || 'Failed to create game session' 
        };
    }
}

export async function validateSelectionService(gameId, characterId, clickCoords) {
    try {
        const data = await api.post(`${API}/game/validate`, {
            gameId,
            characterId,
            clickCoords
        });
        return { ok: true, data };
    } catch (error) {
        console.error('Error validating selection:', error);
        return { 
            ok: false, 
            error: error.message || 'Failed to validate selection' 
        };
    }
}

export async function loadCharacters(gameId) {
    try {
        const data = await api.get(`${API}/game/${gameId}/characters`);
        return { ok: true, data };
    } catch (error) {
        console.error('Error loading characters:', error);
        return { 
            ok: false, 
            error: error.message || 'Failed to load characters' 
        };
    }
}

export async function logCompletion(gameId) {
    try {
        const data = await api.put(`${API}/game/${gameId}`);
        return { ok: true, data };
    } catch (error) {
        console.error('Error logging completion:', error);
        return { 
            ok: false, 
            error: error.message || 'Failed to log completion' 
        };
    }
}