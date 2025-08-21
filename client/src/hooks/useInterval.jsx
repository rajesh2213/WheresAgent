import { useEffect, useState, useRef } from "react"

/**
 * 
 * @param {Function} cb - call back function
 * @param {Number} delay - delay in seconds
 */
export default function useInterval(cb, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = cb;
    }, [cb]);

    useEffect(() => {
        if (delay !== null) {
            const timer = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(timer);
        }
    }, [delay]);
}