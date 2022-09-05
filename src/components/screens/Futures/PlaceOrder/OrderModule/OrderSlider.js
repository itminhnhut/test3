import { useEffect, useRef, useState } from 'react';
import Slider from 'components/trade/InputSlider';

const initPercent = 25;

const FuturesOrderSlider = ({ size, onChange, isVndcFutures, side, currentType, pair, isAuth, maxSize, decimalScaleQty }) => {
    const [percent, setPercent] = useState(isAuth && initPercent)
    const timer = useRef(null);
    const onPercentChange = ({ x }) => {
        const _size = (+maxSize * x / 100).toFixed(decimalScaleQty);
        onChange(_size)
        setPercent(x)
    }

    useEffect(() => {
        const _size = +String(size).replace(/,/g, '')
        setPercent(_size * 100 / maxSize);
    }, [size, isVndcFutures])

    const refresh = useRef(false);

    useEffect(() => {
        if (!refresh.current) refresh.current = true;
    }, [maxSize])

    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            refresh.current = !refresh.current;
        }, 500);
    }, [pair])

    useEffect(() => {
        if (+maxSize) {
            const _size = (+maxSize * initPercent / 100).toFixed(decimalScaleQty);
            onChange(_size);
            setPercent(initPercent)
        } else if (!+maxSize) {
            onChange(0);
            setPercent(0)
        }

    }, [currentType, refresh.current])

    useEffect(() => {
        const _size = (+maxSize * initPercent / 100).toFixed(decimalScaleQty);
        onChange(_size);
        setPercent(initPercent)
    }, [side])

    return <Slider axis='x' x={percent} xmax={100} onChange={onPercentChange} />
}

export default FuturesOrderSlider
