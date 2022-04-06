import { useEffect, useState } from 'react'
import Slider from 'components/trade/InputSlider'
import { faBullseye } from '@fortawesome/free-solid-svg-icons'

const FuturesOrderSlider = ({ size, onChange }) => {
    const [percent, setPercent] = useState(0)

    const onPercentChange = ({ x }) => {
        onChange(`${x}%`)
        setPercent(x)
    }

    useEffect(() => {
        if (!size || !size?.includes('%')) {
            setPercent(0)
        }
    }, [size])

    return <Slider axis='x' x={percent} xmax={100} onChange={onPercentChange} />
}

export default FuturesOrderSlider
