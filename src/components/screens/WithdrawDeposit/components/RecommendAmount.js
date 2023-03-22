import React, { useState } from 'react';
import { formatPrice } from 'redux/actions/utils';

const RECOMMENT_AMOUNT = [100000, 500000, 1000000, 2000000];

const RecommendAmount = ({ amount, setAmount }) => {
    const [rcmdAmount, setRcmdAmount] = useState(RECOMMENT_AMOUNT);
    return (
        <div className="flex items-center overflow-x-auto space-x-3 pb-3 mb-3">
            {rcmdAmount.map((amountRcmd) => (
                <div
                    onClick={() => {
                        setAmount(amountRcmd);
                        setRcmdAmount((prev) => prev.filter((item) => item !== amountRcmd));
                    }}
                    key={amountRcmd}
                    className="cursor-pointer border dark:border-divider-dark border-divider rounded-full py-3 px-5 txtSecond-3"
                >
                    {formatPrice(amountRcmd, 0)}
                </div>
            ))}
        </div>
    );
};

export default React.memo(RecommendAmount);
