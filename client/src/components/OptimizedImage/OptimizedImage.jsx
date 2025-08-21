import { useImageLoader } from '../../hooks/useImageLoader';
import styles from './OptimizedImage.module.css';

const OptimizedImage = ({ 
    src, 
    alt, 
    className, 
    lazyLoad = true,
    onLoad,
    onError,
    wrapperClassName,
    ...props 
}) => {
    const { src: imageSrc, isLoading, error, imgRef } = useImageLoader(src, {
        lazyLoad,
        onLoad,
        onError
    });

    return (
        <div className={`${styles.imageWrapper} ${wrapperClassName || ''}`}>
            <img
                ref={imgRef}
                src={imageSrc}
                alt={alt}
                className={`${styles.image} ${isLoading ? styles.loading : ''} ${className || ''}`}
                {...props}
            />
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}
            {error && (
                <div className={styles.errorOverlay}>
                    <p>Failed to load image</p>
                </div>
            )}
        </div>
    );
};

export default OptimizedImage; 