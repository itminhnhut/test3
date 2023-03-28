import React, { useEffect, useState } from 'react';
import { formatPrice } from 'redux/actions/utils';

const RECOMMENT_AMOUNT = {
    VNDC: [100000, 500000, 1000000, 2000000, 5000000],
    USDT: [50, 100, 500, 1000, 2000, 5000]
};

const RecommendAmount = ({ amount, setAmount, assetCode }) => {
    const [rcmdAmount, setRcmdAmount] = useState([]);
    useEffect(() => {
        if (!amount && assetCode) {
            setRcmdAmount(RECOMMENT_AMOUNT[assetCode]);
        }
    }, [assetCode, amount]);
    return (
        <div className="flex items-center overflow-x-auto space-x-3 pb-3 mb-3">
            {rcmdAmount?.map((amountRcmd) => (
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
