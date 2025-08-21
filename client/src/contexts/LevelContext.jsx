import { createContext, useContext, useEffect, useState } from "react";
import { getAllLevels } from "../services/levelsServices";
import { getTimeTaken } from "../utils/commonHandler";
import { useGameContext } from "./GameContext";

const levelContext = createContext()

export const LevelProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [levels, setLevels] = useState([])
    const [showLeaderboard, setShowLeaderBoard] = useState(false)
    const { gameState } = useGameContext()

    const loadLevels = async () => {
        try {
            const { ok, data, error } = await getAllLevels()
            if (ok) {
                if (data.success) {
                    const levels = data.levels.map(level => ({
                        ...level,
                        leaders: level.leaders.map(leader => ({
                            ...leader,
                            duration: getTimeTaken(leader.startedAt, leader.endedAt)
                        }))
                    }))
                    return setLevels(levels)
                } else {
                    return setError(data.message || 'Failed to load levels')
                }
            }
            setError(error)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadLevels()
    }, [])

    useEffect(() => {
        if (gameState === 'completed') {
            loadLevels()
        }
    }, [gameState])

    return (
        <levelContext.Provider value={{
            levels,
            loading,
            error,
            showLeaderboard,
            setShowLeaderBoard
        }}>
            {children}
        </levelContext.Provider>
    )
}

export const useLevelContext = () => useContext(levelContext)