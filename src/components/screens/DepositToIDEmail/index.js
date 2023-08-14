import React from 'react';
import DepositHistory from './components/DepositHistory';
import DepositInputCard from './components/DepositInputCard';

const index = () => {
    return (
        <div className="w-full">
            <div className="mb-20 flex justify-center">
                <DepositInputCard />
            </div>
            <DepositHistory />
        </div>
    );
};

export default index;
