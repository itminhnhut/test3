import { useEffect, useRef, useState } from 'react';
import Slider from 'components/trade/InputSlider';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { FuturesOrderTypes as OrderTypes, } from 'redux/reducers/futures';

const initPercent = 25;

const FuturesOrderSlider = ({ size, onChange, isVndcFutures, maxBuy, maxSell, side, currentType, pair, isAuth, maxSize }) => {
    const [percent, setPercent] = useState(isAuth && isVndcFutures ? initPercent : 0)

    const onPercentChange = ({ x }) => {
        onChange(isVndcFutures ? (+maxSize * x / 100) : `${x}%`)
        setPercent(x)
    }

    useEffect(() => {
        if (isVndcFutures) {
            const _size = +String(size).replaceAll(',', '')
            setPercent(_size * 100 / maxSize);
            return;
        }
        if (!size || !String(size)?.includes('%')) {
            setPercent(0)
        }
    }, [size, isVndcFutures])

    const refresh = useRef(false);

    useEffect(() => {
        if (!refresh.current) refresh.current = true;
    }, [maxSize])

    useEffect(() => {
        refresh.current = !refresh.current;
    }, [pair])

    useEffect(() => {
        if (+maxSize) {
            onChange(+maxSize * initPercent / 100);
            setPercent(initPercent)
        } else if (!+maxSize) {
            onChange(0);
            setPercent(0)
        }

    }, [currentType, refresh.current])

    useEffect(() => {
        onChange(+maxSize * initPercent / 100);
        setPercent(initPercent)
    }, [side])

    return <Slider axis='x' x={percent} xmax={100} onChange={onPercentChange} />
}

export default FuturesOrderSlider
