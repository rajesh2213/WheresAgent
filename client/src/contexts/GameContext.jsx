import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { loadCharacters, logCompletion } from '../services/gameServices'
import {getTimeTaken} from '../utils/commonHandler'

const gameContext = createContext()

export const GameProvider = ({ children }) => {
    const [gameId, setGameId] = useState(null)
    const [gameState, setGameState] = useState('idle')
    const [loading, setLoading] = useState(true);
    const [totalTime, setTotalTime] = useState(null)
    const [foundCharacters, setFoundCharacters] = useState([])

    useEffect(() => {
        const savedGameId = localStorage.getItem('gameId');
        const savedGameState = localStorage.getItem('gameState');
        const savedTotalTime = localStorage.getItem('totalTime');
        if (savedGameId) {
            setGameId(savedGameId);
            setGameState(savedGameState || 'playing');
            if (savedTotalTime) {
                setTotalTime(savedTotalTime);
            }
        }
        setLoading(false)
    }, []);

    const loadFoundCharacters = useCallback(async () => {
        if (!gameId) return;
        try {
            const { ok, data, error } = await loadCharacters(gameId);
            if (!ok) {
                console.error(error);
                return;
            }

            if (data.success && data.characters) {
                const characters = data.characters?.filter(c => c.found) ?? [];
                setFoundCharacters(characters);
                
                if (data.characters.length === characters.length && 
                    gameState === 'playing' && 
                    !localStorage.getItem('gameCompleted')) {
                    
                    const { ok: completionOk, data: completionData, error: completionError } = await logCompletion(gameId);
                    if (!completionOk) {
                        console.error(completionError);
                        return;
                    }

                    if (completionData.success) {
                        const timeTaken = getTimeTaken(completionData.game.startedAt, completionData.game.endedAt)

                        setTotalTime(timeTaken);
                        localStorage.setItem('totalTime', timeTaken);
                        setGameState('completed');
                        localStorage.setItem('gameState', 'completed');
                        localStorage.setItem('gameCompleted', 'true');
                    }
                }
            }
        } catch (err) {
            console.error(`[ERROR]: ${err}`);
        }
    }, [gameId, gameState]);

    const updateFoundCharacters = useCallback(async () => {
        if (!gameId) return;
        await loadFoundCharacters();
    }, [gameId, loadFoundCharacters]);

    useEffect(() => {
        if (gameState === 'playing' && gameId) {
            if (!localStorage.getItem('gameId')) {
                localStorage.setItem('gameId', gameId)
            }
            loadFoundCharacters()
        }
    }, [gameId, gameState, loadFoundCharacters])

    const resetGame = () => {
        setGameId(null)
        setFoundCharacters([])
        if (localStorage.getItem('gameId')) {
            localStorage.removeItem('gameId')
        }
        if (localStorage.getItem('gameState')) {
            localStorage.removeItem('gameState')
        }
        if (localStorage.getItem('gameCompleted')) {
            localStorage.removeItem('gameCompleted')
        }
        if (localStorage.getItem('totalTime')) {
            localStorage.removeItem('totalTime')
        }
        setGameState('idle')
        setTotalTime(null)
    }

    return (
        <gameContext.Provider value={{
            gameId,
            setGameId,
            gameState,
            setGameState,
            foundCharacters,
            setFoundCharacters,
            updateFoundCharacters,
            resetGame,
            totalTime,
            loading
        }}>
            {children}
        </gameContext.Provider>
    )
}

export const useGameContext = () => useContext(gameContext)