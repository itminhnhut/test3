import { useEffect, useRef, useState } from 'react';
import Slider from 'components/trade/InputSlider';
import { VndcFutureOrderType } from '../Vndc/VndcFutureOrderType';
import { FuturesOrderTypes as OrderTypes, } from 'redux/reducers/futures';

const initPercent = 25;

const FuturesOrderSlider = ({ size, onChange, isVndcFutures, maxBuy, maxSell, side, currentType, pair, isAuth }) => {
    const [percent, setPercent] = useState(isAuth && isVndcFutures ? initPercent : 0)
    const quantity = side === VndcFutureOrderType.Side.BUY ? maxBuy : maxSell;

    const onPercentChange = ({ x }) => {
        onChange(isVndcFutures ? (+quantity * x / 100) : `${x}%`)
        setPercent(x)
    }

    useEffect(() => {
        if (isVndcFutures) {
            const _size = +String(size).replaceAll(',', '')
            setPercent(_size * 100 / quantity);
            return;
        }
        if (!size || !size?.includes('%')) {
            setPercent(0)
        }
    }, [size, isVndcFutures])

    const timer = useRef(null);
    const firstTime = useRef(true);

    useEffect(() => {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            firstTime.current = true;
        }, 200);
    }, [currentType, pair])

    useEffect(() => {
        if (!isAuth) return;
        if (firstTime.current && +quantity) {
            firstTime.current = false;
            onChange(+quantity * initPercent / 100);
            setPercent(initPercent)
        } else if (!+quantity) {
            onChange(0);
            setPercent(0)
        }

    }, [currentType, quantity, firstTime.current, isAuth])

    useEffect(() => {
        if (!isAuth) return;
        onChange(+quantity * initPercent / 100);
        setPercent(initPercent)
    }, [side, isAuth])

    return <Slider axis='x' x={percent} xmax={100} onChange={onPercentChange} />
}

export default FuturesOrderSlider
