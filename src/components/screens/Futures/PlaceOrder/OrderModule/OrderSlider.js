import { useEffect, useRef, useState } from 'react';
import Slider from 'components/trade/InputSlider';
import { VndcFutureOrderType } from '../Vndc/VndcFutureOrderType';
import { FuturesOrderTypes as OrderTypes, } from 'redux/reducers/futures';

const initPercent = 25;

const FuturesOrderSlider = ({ size, onChange, isVndcFutures, maxBuy, maxSell, side, currentType }) => {
    const [percent, setPercent] = useState(isVndcFutures ? initPercent : 0)
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
        firstTime.current = true;
    }, [currentType])

    useEffect(() => {
        if (firstTime.current) {
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                firstTime.current = false;
                onChange(+quantity * initPercent / 100);
                setPercent(initPercent)
            }, 200);
        }

    }, [currentType, quantity])

    useEffect(() => {
        onChange(+quantity * initPercent / 100);
        setPercent(initPercent)
    }, [side])

    return <Slider axis='x' x={percent} xmax={100} onChange={onPercentChange} />
}

export default FuturesOrderSlider
