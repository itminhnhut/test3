import useFetchApi from 'hooks/useFetchApi';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { API_GET_HISTORY_DW_PARTNERS } from 'redux/actions/apis';
import { PartnerOrderStatus } from 'redux/actions/const';
import { formatPrice } from 'redux/actions/utils';

const MAXIMUM_RECOMMEND_LENGTH = 3;

const MULTIPLIES_AMOUNT = {
    72: [10e4, 10e5, 10e6],
    22: [10, 10e1, 10e2, 10e3]
};

const RecommendAmount = ({ amount, setAmount, minimumAllowed, maximumAllowed }) => {
    const [rcmdAmount, setRcmdAmount] = useState([]);
    const router = useRouter();
    const { side, assetId } = router?.query;
    const { data: lastSuccessOrders, loading } = useFetchApi(
        {
            url: API_GET_HISTORY_DW_PARTNERS,
            params: {
                page: 0,
                pageSize: MAXIMUM_RECOMMEND_LENGTH,
                lastId: null,
                mode: 'user',
                side,
                // status: PartnerOrderStatus.SUCCESS,
                assetId
            }
        },
        side && assetId,
        [side, assetId]
    );

    useEffect(() => {
        if (minimumAllowed > 0 && maximumAllowed > 0) {
            if ((!amount || +amount === 0) && lastSuccessOrders && lastSuccessOrders.orders) {
                setRcmdAmount(lastSuccessOrders.orders.map((order) => order.baseQty));
            } else if (amount) {
                setRcmdAmount(
                    MULTIPLIES_AMOUNT[assetId]
                        .map((times) => +amount * times)
                        .filter((amountRecommend) => amountRecommend >= minimumAllowed && amountRecommend <= maximumAllowed)
                );
            }
        }
    }, [lastSuccessOrders, amount, maximumAllowed, minimumAllowed]);

    return (
        <div className="flex items-center overflow-x-auto space-x-3 pb-3 mb-3">
            {rcmdAmount.length ? (
                rcmdAmount.map((amountRcmd, index) => (
                    <div
                        onClick={() => {
                            setAmount(amountRcmd);
                            setRcmdAmount((prev) => prev.filter((item) => item !== amountRcmd));
                        }}
                        key={index}
                        className="cursor-pointer border min-w-[80px] text-center dark:border-divider-dark border-divider rounded-full py-3 px-5 txtSecond-3"
                    >
                        {formatPrice(amountRcmd, 0)}
                    </div>
                ))
            ) : (
                <></>
            )}
        </div>
    );
};

export default React.memo(RecommendAmount);
