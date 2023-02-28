import { useEffect, useRef, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import Slider from 'components/trade/InputSlider';
const initPercent = 0;
const FuturesOrderSlider = forwardRef(({ quoteQty, onChange, isAuth, decimals, minQuoteQty, maxQuoteQty, pair }, ref) => {
    const [percent, setPercent] = useState(isAuth && initPercent);

    useImperativeHandle(ref, () => ({
        changePercent: changePercent
    }));

    const changePercent = (max) => {
        const _percent = quoteQty ? (quoteQty * 100) / max : 0;
        setPercent(_percent);
    };

    const arrDot = useMemo(() => {
        const size = 100 / 4;
        const arr = [];
        for (let i = 0; i <= 4; i++) {
            arr.push(i * size);
        }
        return arr;
    }, []);

    useEffect(() => {
        setPercent(0);
        onChange('');
    }, [pair]);

    useEffect(() => {
        const _percent = quoteQty ? (quoteQty * 100) / maxQuoteQty : 0;
        setPercent(_percent);
    }, [quoteQty]);

    const onPercentChange = ({ x }) => {
        if (maxQuoteQty < minQuoteQty) return;
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
            const value = +((+maxQuoteQty * (_x ? _x : x)) / 100).toFixed(decimals?.symbol);
            onChange(value || '');
            setPercent(_x ? _x : x);
        }
    };

    return (
        <Slider disabled={maxQuoteQty < minQuoteQty} useLabel labelSuffix="%" positionLabel="top" axis="x" x={percent} xmax={100} onChange={onPercentChange} />
    );
});

export default FuturesOrderSlider;
