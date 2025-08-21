import { Link, useLocation, useParams } from 'react-router-dom'
import styles from './Header.module.css'
import { loadCharacters } from '../../services/gameServices'
import { useEffect, useState } from 'react'
import { useLevelContext } from '../../contexts/LevelContext'

const Header = () => {
    const {setShowLeaderBoard} = useLevelContext()

    return (
        <header className={styles.headerWrapper}>
            <Link to='/' className={styles.title}>Find Us</Link>
            <div className={styles.headerBtnsWrapper}>
                <button onClick={() =>  setShowLeaderBoard(true)} 
                    className={styles.headerBtns}>Leaderboards</button>
            </div>
        </header>
    )
}

export default Header