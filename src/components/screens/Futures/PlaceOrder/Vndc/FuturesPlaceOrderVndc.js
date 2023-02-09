import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import { FuturesOrderTypes as OrderTypes, FuturesStopOrderMode } from 'redux/reducers/futures';
import { useSelector } from 'react-redux';
import { ApiStatus, DefaultFuturesFee } from 'redux/actions/const';
import FuturesOrderModule from 'components/screens/Futures/PlaceOrder/OrderModule';
import FuturesOrderTypes from 'components/screens/Futures/PlaceOrder/OrderTypes';
import axios from 'axios';
import OrderSide from '../OrderModule/OrderSide';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';

const FuturesPlaceOrderVndc = ({ pairConfig, userSettings, pairPrice, isAuth, isVndcFutures, pair, decimals }) => {
    const [leverage, setLeverage] = useState(1);
    const [availableAsset, setAvailableAsset] = useState(null);
    const [side, setSide] = useState(VndcFutureOrderType.Side.BUY);

    const preloadedForm = useSelector((state) => state.futures.preloadedState);
    const avlbAsset = useSelector((state) => state.wallet?.FUTURES);
    const currentType = useMemo(() => preloadedForm?.orderType || OrderTypes.Limit, [preloadedForm]);

    const getLeverage = async (symbol) => {
        const { data } = await axios.get(API_FUTURES_LEVERAGE, {
            params: {
                symbol
            }
        });
        if (data?.status === ApiStatus.SUCCESS) {
            setLeverage(data?.data?.[pairConfig?.pair]);
        }
    };

    useEffect(() => {
        isAuth && getLeverage(pairConfig?.pair);
    }, [pairConfig, isAuth]);

    useEffect(() => {
        if (avlbAsset) {
            const _avlb = avlbAsset?.[pairConfig?.quoteAssetId];
            setAvailableAsset(_avlb?.value - _avlb?.locked_value);
        }
    }, [avlbAsset, pairConfig]);

    return (
        <div className="p-6 pl-4 h-full overflow-x-hidden overflow-y-auto">
            <OrderSide side={side} setSide={setSide} leverage={leverage} />
            <FuturesOrderTypes currentType={currentType} orderTypes={pairConfig?.orderTypes} isVndcFutures={true} />

            <FuturesOrderModule
                leverage={leverage}
                type={currentType}
                pairConfig={pairConfig}
                positionMode={userSettings?.dualSidePosition || false}
                availableAsset={availableAsset}
                isVndcFutures={isVndcFutures}
                isAuth={isAuth}
                side={side}
                pair={pair}
                decimals={decimals}
                pairPrice={pairPrice}
            />
        </div>
    );
};

export default FuturesPlaceOrderVndc;
