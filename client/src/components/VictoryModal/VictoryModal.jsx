import styles from './VictoryModal.module.css'

const VictoryModal = ({totalTime}) => {
    console.log('VICTORY')
    return (
        <>
            <div className={styles.modalOverlay}></div>
            <div className={styles.modal}>
                <div className={styles.gameInfo}>
                    <h2>You found everyone</h2>
                    <div>  
                        <h3>Total time taken: <span>{totalTime}</span></h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VictoryModal