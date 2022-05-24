import React, {useCallback, useEffect, useState} from "react";
import {debounce} from "lodash/function";
import Slider from "components/trade/InputSlider";

export default function SliderAmount({value = 0, onChange}) {
    const [internalPercent, setInternalPercent] = useState(0)
    const _onChange = useCallback(debounce((amount) => {
        if (onChange) {
            onChange(amount)
        }
    }, 200), [onChange])

    const handleChange = ({x}) => {
        setInternalPercent(x)
        _onChange(x)
    }
    useEffect(() => {
        if (value !== internalPercent) {
            setInternalPercent(value)
        }
    }, [value])
    return <Slider axis='x' useLabel x={internalPercent} xmax={100} onChange={handleChange}/>
}
