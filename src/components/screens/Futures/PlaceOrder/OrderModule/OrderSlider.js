import { useEffect, useState } from 'react';
import Slider from 'components/trade/InputSlider';
import { VndcFutureOrderType } from '../Vndc/VndcFutureOrderType';

const FuturesOrderSlider = ({ size, onChange, isVndcFutures, maxBuy, maxSell, side }) => {
    const [percent, setPercent] = useState(0)
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

    useEffect(() => {
        onChange(+quantity * percent / 100);
    }, [side])

    return <Slider axis='x' x={percent} xmax={100} onChange={onPercentChange} />
}

export default FuturesOrderSlider
