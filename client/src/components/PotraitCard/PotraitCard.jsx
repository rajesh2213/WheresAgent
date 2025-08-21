import {memo} from 'react'
import styles from './PotraitCard.module.css'

const PotraitCard = ({ character, hit, show=true }) => {
    console.log(`Character: ${character.name} was hit: ${hit}`)
    const QUESTION_IMG_URL = 'https://res.cloudinary.com/dhasbbkmn/image/upload/v1749062833/question_xre7ec.png'

    return (
        <div className={styles.potraitCard}>
            <div className={`${styles.potraitWrapper} ${hit===true ? styles.hit : ''}`}>
                <img src={show ? character.potrait : QUESTION_IMG_URL} alt={`${character.name}'s Image`
                } className={styles.potraitImage} />
            </div>
             <h3 className={styles.potraitName}>{show ? character.name : ''}</h3>
        </div>
    )
}

export default memo(PotraitCard)