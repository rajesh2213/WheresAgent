import { Link } from 'react-router-dom'
import styles from './LevelCard.module.css'
import OptimizedImage from '../OptimizedImage/OptimizedImage'
import { memo } from 'react'

const LevelCard = ({ level }) => {
    return (
        <Link to={`/level/${level.id}`} className={styles.levelCard}>
            <div className={styles.levelWrapper}>
                <OptimizedImage
                    src={level.imgUrl}
                    alt={`${level.name}'s Image`}
                    className={styles.levelImage}
                    wrapperClassName={styles.imageContainer}
                    lazyLoad={true}
                />
                <div className={styles.imageOverlay}></div>
                <h2 className={styles.levelName}>{level.name}</h2>
            </div>
        </Link>
    )
}

export default memo(LevelCard, (prevProps, nextProps) => {
    return prevProps.level.id === nextProps.level.id;
});