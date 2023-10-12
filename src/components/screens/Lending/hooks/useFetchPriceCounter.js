import React, { useEffect, useState } from 'react';

const INIT_COUNTER = 6;
const useFetchPriceCounter = ({ loadingPrice, initCounter = INIT_COUNTER }) => {
    const [countdown, setCountdown] = useState(initCounter);

    useEffect(() => {
        let interval = setInterval(
            () =>
                setCountdown((prevCountdown) => {
                    // ko cho dem nguoc neu nhu dang fetchPrice
                    // or countdown == null
                    if (loadingPrice || prevCountdown === null) return prevCountdown;
                    return prevCountdown === 1 ? null : prevCountdown - 1;
                }),
            1000
        );

        return () => clearInterval(interval);
    }, [loadingPrice]);
    const resetCountdown = () => setCountdown(initCounter);
    return [countdown, resetCountdown];
};

export default useFetchPriceCounter;
