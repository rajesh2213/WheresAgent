import { useEffect, useState } from "react"
import LoadingSpinner from "../../components/Loading/LoadingSpinner"
import { getAllLevels } from '../../services/levelsServices'
import { useGameContext } from "../../contexts/GameContext"
import LevelCard from '../../components/LevelCard/LevelCard'
import { useLevelContext } from "../../contexts/LevelContext"
import styles from './Home.module.css'
import Leaderboard from "../../components/Leaderboard/Leaderboard"

const Home = () => {
    const { resetGame } = useGameContext()
    const {showLeaderboard, levels, error, loading} = useLevelContext()
    console.log('showLeaderboard: ', showLeaderboard)

    useEffect(() => {
        resetGame()
    }, [])

    return (
        <div className={styles.homePage}>
            {loading ? (
                <LoadingSpinner />
            ) : showLeaderboard ? (
                <Leaderboard />
            ) : (
                <div className={styles.levelsContainer}>
                    {levels && levels.length > 0 && levels.map(level => (
                        <LevelCard key={level.id} level={level} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home