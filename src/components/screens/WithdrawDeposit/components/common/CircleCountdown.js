import CountdownTimer from 'components/common/CountdownTimer';
import React from 'react';
import Countdown from 'react-countdown';

const CircleCountdown = ({ timeExpire, size = 80, textSize }) => {
    return timeExpire ? (
        <Countdown date={new Date(timeExpire).getTime()} renderer={({ props, ...countdownProps }) => props.children(countdownProps)}>
            {(props) => (
                <div className="inline-block">
                    <CountdownTimer textSize={textSize} size={size} {...props} />
                </div>
            )}
        </Countdown>
    ) : (
        <></>
    );
};

export default CircleCountdown;
