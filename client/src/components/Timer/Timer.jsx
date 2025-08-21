import { useEffect, useState, useRef } from "react"
import useInterval from '../../hooks/useInterval'
import styles from './Timer.module.css'

const Timer = ({ gameState }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if(gameState === 'idle'){
            setSeconds(0)
        }
    }, [gameState])
    useInterval(() => {
        setSeconds(prev => prev + 1);
    }, gameState === 'playing' ? 1000 : null); 

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return (
        <div className={styles.timerContainer}>
            <h2 className={styles.timer}>
                {minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`}
            </h2>
        </div>
    );
};

export default Timer