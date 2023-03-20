import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SIDE } from 'redux/reducers/withdrawDeposit';

const useLocationSide = () => {
    const router = useRouter();
    useEffect(() => {
        const side = router.query.side;

        if (!side || !SIDE[side] || !SIDE[side.toUpperCase()]) {
            router.push(`?side=${SIDE.BUY}`);
        }
    }, []);
};

export default useLocationSide;
