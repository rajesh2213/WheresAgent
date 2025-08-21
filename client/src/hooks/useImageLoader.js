import { useState, useEffect, useRef } from 'react';
import { loadImage, Cache } from '../utils/performance';

const imageCache = new Cache();

export function useImageLoader(src, options = {}) {
    const {
        placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        lazyLoad = true,
        onLoad,
        onError
    } = options;

    const [image, setImage] = useState({
        src: placeholder,
        isLoading: true,
        error: null
    });

    const imgRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const loadImageWithCache = async () => {
            try {
                const cachedImage = imageCache.get(src);
                if (cachedImage) {
                    if (isMounted) {
                        setImage({
                            src: cachedImage,
                            isLoading: false,
                            error: null
                        });
                        onLoad?.(cachedImage);
                    }
                    return;
                }

                const img = await loadImage(src);
                
                if (isMounted) {
                    imageCache.set(src, img.src);
                    
                    setImage({
                        src: img.src,
                        isLoading: false,
                        error: null
                    });
                    onLoad?.(img.src);
                }
            } catch (error) {
                if (isMounted) {
                    setImage({
                        src: placeholder,
                        isLoading: false,
                        error
                    });
                    onError?.(error);
                }
            }
        };

        if (lazyLoad && imgRef.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        loadImageWithCache();
                        observer.disconnect();
                    }
                },
                { 
                    threshold: 0.1,
                    rootMargin: '50px'
                }
            );

            observer.observe(imgRef.current);

            return () => {
                observer.disconnect();
                isMounted = false;
            };
        } else {
            loadImageWithCache();
            return () => {
                isMounted = false;
            };
        }
    }, [src, lazyLoad, onLoad, onError]);

    return { ...image, imgRef };
} 