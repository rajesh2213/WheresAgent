import { useState } from "react"
import styles from './IntroModal.module.css'


const IntroModal = ({ setName, setGameState }) => {
    const [page, setPage] = useState(1)
    const [tempName, setTempName] = useState('')

    const handleSubmit = () => {
        setName(tempName)
        setPage(2)
    }

    return (
        <>
            <div className={styles.modalOverlay}></div>
            <div className={styles.modal}>
                {page === 1 ? (
                    <>
                        <div className={styles.textSection}>
                            <h2>The hunt is on detective</h2>
                            <p>
                                Before we clock your spotting skills,
                                what should we call the legend behind this click-or
                                skip if you're feeling mysterious
                            </p>
                        </div>
                        <div className={styles.formSection}>
                            <input type="text"
                                value={tempName}
                                placeholder="Enter your name..."
                                onChange={(e) => setTempName(e.target.value)}
                            />
                            <div className={styles.btnContainer}>
                                <button
                                    className={styles.submitBtn}
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                                <button
                                    className={styles.skipBtn}
                                    onClick={() => setPage(2)}
                                >
                                    Skip
                                </button>
                            </div>
                        </div>

                    </>
                ) : (
                    <>
                        <div className={styles.textSection}>
                            <h2>Mission Brief:</h2>
                            <p>The characters on the left?
                                They're hiding someWhere in the chaos.
                                Your job is to track them down in the scene to the right.
                                Zoom in (with your eyes), click on the right spot and
                                choose the right character
                            </p>
                        </div>
                        <button
                            className={styles.startBtn}
                            onClick={() => setGameState('playing')}
                        >
                            Lets the Hunt Begin!
                        </button>
                    </>
                )}
            </div>
        </>
    )
}

export default IntroModal