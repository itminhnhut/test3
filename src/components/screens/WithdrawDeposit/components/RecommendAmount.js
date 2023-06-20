import Chip from 'components/common/V2/Chip';
import TabV2 from 'components/common/V2/TabV2';
import useFetchApi from 'hooks/useFetchApi';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { API_GET_HISTORY_DW_PARTNERS } from 'redux/actions/apis';
import { PartnerOrderStatus } from 'redux/actions/const';
import { formatPrice } from 'redux/actions/utils';

const MAXIMUM_RECOMMEND_LENGTH = 3;

const MULTIPLIES_AMOUNT = {
    72: [10e3, 10e4, 10e5, 10e6],
    22: [10, 10e1, 10e2, 10e3]
};

const getArraySuggestion = (amount, min, max) => {
    const x = [];
    for (let i = -10; i < 10; i++) {
        const value = amount * 10 ** i;
        if (value >= min && value <= max) x.push(value);
    }
    return x;
};

const RecommendAmount = ({ amount, setAmount, loadingRate }) => {
    const { minimumAllowed, maximumAllowed } = useSelector((state) => state.withdrawDeposit);
    const [rcmdAmount, setRcmdAmount] = useState([]);
    const router = useRouter();
    const { side, assetId } = router?.query;
    const { data: lastOrders, loading: loadingOrders } = useFetchApi(
        {
            url: API_GET_HISTORY_DW_PARTNERS,
            params: {
                page: 0,
                pageSize: MAXIMUM_RECOMMEND_LENGTH,
                lastId: null,
                mode: 'user',
                side,
                assetId
            }
        },
        side && assetId,
        [side, assetId]
    );

    useEffect(() => {
        if (minimumAllowed > 0 && maximumAllowed > 0) {
            if (!amount) {
                if (lastOrders && lastOrders.orders.length) {
                    setRcmdAmount(lastOrders.orders.map((order) => order.baseQty));
                } else {
                    setRcmdAmount(
                        MULTIPLIES_AMOUNT[assetId]
                            .map((times) => times)
                            .filter((amountRecommend) => amountRecommend >= minimumAllowed && amountRecommend <= maximumAllowed)
                    );
                }
            } else if (amount) {
                const suggestArr = getArraySuggestion(amount, minimumAllowed, maximumAllowed);
                setRcmdAmount(suggestArr);
                // setRcmdAmount(
                //     MULTIPLIES_AMOUNT[assetId]
                //         .map((times) => +amount * times)
                //         .filter((amountRecommend) => amountRecommend >= minimumAllowed && amountRecommend <= maximumAllowed)
                // );
            }
        }
    }, [lastOrders, amount, maximumAllowed, minimumAllowed]);

    return (
        <div className={`flex items-center gap-3 flex-wrap ${!loadingOrders && !loadingRate && rcmdAmount.length && 'mb-6'}`}>
            {!loadingOrders && !loadingRate && rcmdAmount.length ? (
                <TabV2
                    //  chipClassName="!bg-white hover:!bg-gray-6"
                    isOverflow={true}
                    activeTabKey={amount}
                    onChangeTab={(key) => setAmount(key)}
                    tabs={rcmdAmount.map((amountRcmd) => ({
                        key: amountRcmd + '',
                        children: formatPrice(amountRcmd, 0)
                    }))}
                />
            ) : (
                // rcmdAmount.map((amountRcmd, index) => (
                //     <Chip
                //         selected={+amount === amountRcmd}
                //         variants={'suggestion'}
                //         onClick={() => {
                //             setAmount(amountRcmd);
                //             // setRcmdAmount((prev) => prev.filter((item) => item !== amountRcmd));
                //         }}
                //         key={index}
                //     >
                //         {formatPrice(amountRcmd, 0)}
                //     </Chip>
                // ))
                <></>
            )}
        </div>
    );
};

export default RecommendAmount;
