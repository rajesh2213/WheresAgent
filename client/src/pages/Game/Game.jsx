import { useParams } from "react-router-dom"
import styles from './Game.module.css'
import { useEffect, useRef, useState } from "react"
import LoadingSpinner from "../../components/Loading/LoadingSpinner"
import { getLevelById } from '../../services/levelsServices'
import { validateSelectionService, createGameSession } from '../../services/gameServices'
import PotraitCard from '../../components/PotraitCard/PotraitCard'
import Timer from '../../components/Timer/Timer'
import { useGameContext } from '../../contexts/GameContext'

const Game = ({ playerName, gameState, gameId, setGameId, foundCharacters, resetGame }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [level, setLevel] = useState(null)
    const [optionVisibility, setOptionVisibility] = useState(false)
    const [markerX, setMarkerX] = useState(0)
    const [markerY, setMarkerY] = useState(0)
    const [normalizedX, setNormalizedX] = useState(null)
    const [normalizedY, setNormalizedY] = useState(null)
    const [imageHeight, setImageHeight] = useState(null)
    const [isTimerActive, setIsTimerActive] = useState(false)

    const imgRef = useRef()
    const optionsRef = useRef()
    const hitRef = useRef()
    const hideTimeout = useRef()

    const { levelId } = useParams()
    const { updateFoundCharacters, totalTime } = useGameContext()

    useEffect(() => {
        const loadLevel = async () => {
            try {
                const {ok, data} = await getLevelById(levelId)
                if (ok) {
                    if (!data.success) {
                        setError(data.message)
                        return
                    }
                    return setLevel(data.level)
                }
                return setError('Error loading this game level')
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadLevel()
    }, [])

    useEffect(() => {
        if (!level) return;

        const img = imgRef.current;
        if (!img) {
            console.warn("imgRef is null after level loaded");
            return;
        }

        const updateHeight = () => {
            const height = img.getBoundingClientRect().height;
            if (height > 0) {
                setImageHeight(height);
            } else {
                setTimeout(updateHeight, 100);
            }
        };

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const height = entry.contentRect.height;
                setImageHeight(height);
            }
        });

        resizeObserver.observe(img);

        if (img.complete) {
            updateHeight();
        } else {
            img.addEventListener("load", updateHeight);
        }

        return () => {
            resizeObserver.disconnect();
            img.removeEventListener("load", updateHeight);
        };
    }, [loading]);


    useEffect(() => {
        const gameStart = async () => {
            try {
                const { ok, data, error } = await createGameSession({ playerName, levelId });
                if (!ok) {
                    setError(error);
                    return;
                }
                setGameId(data.game.id);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }
        if (gameState === 'playing' && !gameId) {
            gameStart();
        }
    }, [gameState]);

    const handleImgClick = (e) => {
        const img = e.currentTarget
        if (gameState !== 'playing') {
            if (imgRef.current) {
                imgRef.current.style.cursor = 'not-allowed'
            }
            return
        }
        const imgRect = img.getBoundingClientRect()
        const relativeX = e.clientX - imgRect.left
        const relativeY = e.clientY - imgRect.top
        const normalizedX = relativeX / imgRect.width
        const normalizedY = relativeY / imgRect.height
        setMarkerX(relativeX)
        setMarkerY(relativeY)
        setNormalizedX(normalizedX)
        setNormalizedY(normalizedY)
        showOptions()
    }

    const deNormalizeCoords = (value, axis) => {
        const rect = imgRef.current.getBoundingClientRect();
        const result = value * (axis === 'top' ? rect.height : rect.width);
        return result
    };


    const validateSelection = async (charId) => {
        try {
            if (!normalizedX && !normalizedY) {
                setError('Try again.. click didn\'t register ');
                return;
            }
            const { ok, data, error } = await validateSelectionService(gameId, charId, { x: normalizedX, y: normalizedY });
            if (!ok) {
                setError(error);
                return;
            }
            if (data.validate && data.foundCharacter) {
                await updateFoundCharacters(data.foundCharacter);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setOptionVisibility(false);
        }
    }

    const showOptions = () => {
        setIsTimerActive(false)
        clearTimeout(hideTimeout.current)
        setOptionVisibility(true)
    }

    const hideOptions = () => {
        clearTimeout(hideTimeout.current)
        setIsTimerActive(true)
        hideTimeout.current = setTimeout(() => {
            setIsTimerActive(false)
            setNormalizedX(null)
            setNormalizedY(null)
            setOptionVisibility(false)
        }, 1000)
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (error || !level) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.error}>{error?.message || String(error) || 'Level not found'}</p>
            </div>
        )
    }

    return (
        <div className={styles.gameContainer}

        >
            {level && (
                <>
                    <div className={styles.controlSection}>
                        <Timer gameState={gameState}/>
                        <button className={styles.resetBtn} onClick={resetGame}><h2>Reset</h2></button>
                    </div>
                    <div className={styles.targetsSection}
                        style={{ height: imageHeight ? `${imageHeight}px` : '100vh' }}
                    >
                        <h2>Find the below characters</h2>
                        <div className={styles.potraitContainer}>
                            {level.characters && level.characters.map(char => (
                                <PotraitCard key={char.id} character={char} hit={foundCharacters.some(c => c.id == char.id)} />
                            ))}
                        </div>
                        {/* <div style={{ height: '2000x', outline: 'white' }}></div> */}
                    </div>
                    <div className={styles.imageSection} style={{ position: 'relative' }}>
                        <img onClick={handleImgClick} src={level.imgUrl} alt={level.name} ref={imgRef} />
                        {optionVisibility && (
                            <div
                                className={styles.clickSection}
                                onMouseLeave={hideOptions}
                                onMouseEnter={showOptions}
                                style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none' }}
                            >
                                <div
                                    ref={hitRef}
                                    className={styles.hitMarker}
                                    style={{
                                        top: `${markerY}px`,
                                        left: `${markerX}px`,
                                        pointerEvents: 'auto'
                                    }}
                                >
                                    {isTimerActive && <div className={styles.hitMarkerTimerCircle}></div>}
                                    <img
                                        src="https://res.cloudinary.com/dhasbbkmn/image/upload/w_40,h_40,c_scale/v1749125607/waldo-crosshair_gxlpex.png"
                                        alt=""
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                                <div
                                    ref={optionsRef}
                                    className={styles.optionsBox}
                                    style={{ top: `${markerY + 20}px`, left: `${markerX}px`, pointerEvents: 'auto' }}
                                >
                                    {level.characters && level.characters.map(char => (
                                        <button
                                            key={char.id}
                                            onClick={() => validateSelection(char.id)}
                                            className={styles.optionBtn}
                                        >
                                            {char.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {foundCharacters && foundCharacters.length > 0 && foundCharacters.map(char => (
                            <img key={char.id}
                                src="https://res.cloudinary.com/dhasbbkmn/image/upload/w_40,h_40,c_scale/v1749125607/waldo-crosshair_gxlpex.png"
                                alt="Hit"
                                className={styles.foundCharacterMark}
                                style={{
                                    left: `${deNormalizeCoords(char.x, 'left')}px`,
                                    top: `${deNormalizeCoords(char.y, 'top')}px`,
                                    cursor: 'not-allowed',
                                    pointerEvents: 'none'
                                }}
                            />
                        ))}
                    </div>

                </>
            )}
        </div >
    )
}

export default Game