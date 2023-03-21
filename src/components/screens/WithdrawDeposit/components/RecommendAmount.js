import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatPrice } from 'redux/actions/utils';
import { setInput } from 'redux/actions/withdrawDeposit';

const RECOMMENT_AMOUNT = [100000, 500000, 1000000, 2000000];

const RecommendAmount = () => {
    const [rcmdAmount, setRcmdAmount] = useState(RECOMMENT_AMOUNT);
    const dispatch = useDispatch();
    return (
        <div className="flex items-center overflow-x-auto space-x-3 pb-3 mb-3">
            {rcmdAmount.map((amount) => (
                <div
                    onClick={() => {
                        dispatch(setInput(amount));
                        setRcmdAmount((prev) => prev.filter((item) => item !== amount));
                    }}
                    key={amount}
                    className="cursor-pointer border dark:border-divider-dark border-divider rounded-full py-3 px-5 txtSecond-3"
                >
                    {formatPrice(amount, 0)}
                </div>
            ))}
        </div>
    );
};

export default RecommendAmount;
