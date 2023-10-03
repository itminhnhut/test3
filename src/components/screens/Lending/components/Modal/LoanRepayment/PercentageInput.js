import React, { useEffect, useState } from 'react';
import InputSlider from 'components/trade/InputSlider';

const DEBOUNCE_TIMER = 150;

const PercentageInput = ({ onHandlerInputChange, tab }) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        let timeout = setTimeout(() => onHandlerInputChange(percentage), DEBOUNCE_TIMER);
        return () => clearTimeout(timeout);
    }, [percentage, tab]);

    return <InputSlider axis="x" labelSuffix="%" useLabel positionLabel="top" x={percentage} onChange={({ x }) => setPercentage(x)} />;
};

export default PercentageInput;
