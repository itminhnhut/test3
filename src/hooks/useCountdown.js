import { useEffect, useState, useRef } from 'react';

const useCountdown = (targetDate) => {
    const countDownDate = new Date(targetDate).getTime();
    // const intervalRef = useRef()
    const stopTimer = () => {
        // if (intervalRef.current) clearInterval(intervalRef.current)
    }

    const [countDown, setCountDown] = useState(
        countDownDate - new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    const result = getReturnValues(countDown);
    return result;
};

const getReturnValues = (countDown) => {
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return {days, hours, minutes, seconds};
};

export { useCountdown };
