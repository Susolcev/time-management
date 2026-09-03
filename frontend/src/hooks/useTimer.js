import { useEffect, useRef, useState } from 'react';

function useTimer() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const start = () => {
        setIsRunning(true);
    };

    const pause = () => {
        setIsRunning(false);
    };

    const reset = () => {
        setIsRunning(false);
        setSeconds(0);
    };

    return {
        seconds,
        isRunning,
        start,
        pause,
        reset
    };
}

export default useTimer;