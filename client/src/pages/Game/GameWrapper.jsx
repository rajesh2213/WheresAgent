import { useState } from "react"
import Game from "./Game"
import IntroModal from "../../components/IntroModal/IntroModal"
import LoadingSpinner from "../../components/Loading/LoadingSpinner"
import { useGameContext } from '../../contexts/GameContext'
import VictoryModal from '../../components/VictoryModal/VictoryModal'
import Leaderboard from "../../components/Leaderboard/Leaderboard"
import { useLevelContext } from '../../contexts/LevelContext'

const GameWrapper = () => {
    const { showLeaderboard } = useLevelContext()
    const [name, setName] = useState('')
    console.log('showLeaderboard: ', showLeaderboard)
    const {
        gameId,
        setGameId,
        gameState,
        setGameState,
        foundCharacters,
        resetGame,
        loading,
        totalTime
    } = useGameContext()

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <>
            {showLeaderboard ? (
                <Leaderboard />
            ) : gameState === 'idle' && !gameId ? (
                <IntroModal
                    setName={setName}
                    setGameState={setGameState}
                />
            ) : gameState === 'completed' ? (
                <VictoryModal totalTime={totalTime} />
            ) : null}
            
            <Game
                playerName={name}
                gameState={gameState}
                gameId={gameId}
                setGameId={setGameId}
                resetGame={resetGame}
                foundCharacters={foundCharacters}
            />
        </>
    )
}

export default GameWrapper
