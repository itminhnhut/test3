import React, { useEffect, useState } from 'react';
import InputSlider from 'components/trade/InputSlider';

const DEBOUNCE_TIMER = 150;

const PercentageInput = ({ onHandlerInputChange, isTypingAmountField, percentageFormat }) => {
    const [percentage, setPercentage] = useState(0);
    const percentageValue = isTypingAmountField ? percentageFormat : percentage;

    useEffect(() => {
        let timeout = setTimeout(() => onHandlerInputChange(percentage), DEBOUNCE_TIMER);
        return () => clearTimeout(timeout);
    }, [percentage]);

    return <InputSlider axis="x" labelSuffix="%" useLabel positionLabel="top" x={percentageValue} onChange={({ x }) => setPercentage(+x)} />;
};

export default PercentageInput;
