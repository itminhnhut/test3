import React, { useEffect, useState } from 'react';

const COUNTER = 6;
const useFetchPriceCounter = ({ handleRefetch, loadingPrice, initCounter = COUNTER }) => {
    const [countdown, setCountdown] = useState(initCounter);

    useEffect(() => {
        let interval = setInterval(
            () =>
                setCountdown((prevCoundown) => {
                    // ko cho dem nguoc neu nhu dang fetchPrice
                    if (loadingPrice) return prevCoundown;
                    if (prevCoundown === 1) {
                        handleRefetch();
                    }
                    return prevCoundown === 1 ? COUNTER : prevCoundown - 1;
                }),
            1000
        );

        return () => clearInterval(interval);
    }, [loadingPrice]);

    return countdown;
};

export default useFetchPriceCounter;
