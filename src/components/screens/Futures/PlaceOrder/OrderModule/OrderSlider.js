import { useEffect, useRef, useState, useMemo } from 'react';
import Slider from 'components/trade/InputSlider';
import { getMaxQuoteQty } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import floor from 'lodash/floor';
const initPercent = 0;
const initValue = 100000;
const FuturesOrderSlider = ({ pairConfig, quoteQty, onChange, side, type, isAuth, decimals, availableAsset, price, leverage, pairPrice }) => {
    const [percent, setPercent] = useState(isAuth && initPercent);

    const minQuoteQty = useMemo(() => {
        return pairConfig ? +pairConfig?.filters.find((item) => item.filterType === 'MIN_NOTIONAL')?.notional : initValue;
    }, [pairConfig]);

    const maxQuoteQty = useMemo(() => {
        const _maxQuoteQty = getMaxQuoteQty(price, type, side, leverage, availableAsset, pairPrice, pairConfig, true, isAuth);
        const max = Math.min(leverage * availableAsset, _maxQuoteQty);
        return floor(max, decimals?.symbol);
    }, [price, type, side, leverage, availableAsset, pairPrice, pairConfig]);

    const arrDot = useMemo(() => {
        const size = 100 / 4;
        const arr = [];
        for (let i = 0; i <= 4; i++) {
            arr.push(i * size);
        }
        return arr;
    }, []);

    useEffect(() => {
        setPercent((quoteQty * 100) / maxQuoteQty);
    }, [quoteQty]);

    const onPercentChange = ({ x }) => {
        if (!x) {
            onChange(minQuoteQty);
        } else {
            const _x = arrDot.reduce((prev, curr) => {
                let i = 0;
                if (Math.abs(curr - x) < 2 || Math.abs(prev - x) < 2) {
                    i = Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
                }
                return i;
            });
            const value = ((+maxQuoteQty * (_x ? _x : x)) / 100).toFixed(decimals?.symbol);
            onChange(value);
            setPercent(_x ? _x : x);
        }
    };

    return <Slider useLabel labelSuffix="%" positionLabel="top" axis="x" x={percent} xmax={100} onChange={onPercentChange} />;
};

export default FuturesOrderSlider;
