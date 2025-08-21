import LoadingSpinner from '../Loading/LoadingSpinner';
import styles from './Leaderboard.module.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLevelContext } from '../../contexts/LevelContext';

const Leaderboard = () => {
    const { levels, loading, setShowLeaderBoard } = useLevelContext();
    const [leaderboardLevels, setLeaderboardLevels] = useState([]);
    // const [leaders, setLeaders] = useState(null); // This state seems unused
    const location = useLocation();
    const locationArray = location.pathname.split('/');
    const levelId = locationArray[locationArray.indexOf('level') + 1];
    // console.log('LEVEL : ', levelId); // Avoid console logs in render path too much
    // console.log('levelssss: ', levels);

    useEffect(() => {
        if (!levels) return;
        if (levelId) {
            setLeaderboardLevels(levels.find(level => level.id == levelId) ? [levels.find(level => level.id == levelId)] : []); // Ensure it's an array
        } else {
            setLeaderboardLevels(levels);
        }
    }, [levels, levelId]);

    const modalClasses = `${styles.modal} ${setShowLeaderBoard ? styles.active : ''}`;
    const overlayClasses = `${styles.modalOverlay} ${setShowLeaderBoard ? styles.active : ''}`;


    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div className={overlayClasses}></div>
            <div className={modalClasses}>
                <button
                    onClick={() => setShowLeaderBoard(false)}
                    className={styles.closeBtn}
                >
                    ❌
                </button>
                <h2>Leaderboard</h2>
                {leaderboardLevels && leaderboardLevels.length > 0 ? (
                    leaderboardLevels.map(level => (
                        <div key={level.id} className={styles.leaderboardContainer}>
                            <h3>{level.name}</h3>
                            <div className={styles.leaderBoardList}>
                                <div className={`${styles.row} ${styles.header}`}>
                                    <div className={styles.col}>Player</div>
                                    <div className={styles.col}>Time</div>
                                </div>
                                {level.leaders && Array.isArray(level.leaders) && level.leaders.map(leader => (
                                    <div key={leader.id} className={styles.row}>
                                        <div className={styles.col}>{leader.name}</div>
                                        {/* Assuming leader.duration is already formatted for display */}
                                        <div className={styles.col}>{leader.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{textAlign: 'center'}}>No leaderboard data available.</p>
                )}
            </div>
        </>
    );
};

export default Leaderboard;