import CountdownTimer from 'components/common/CountdownTimer';
import TagV2, { TYPES } from 'components/common/V2/TagV2';
import { TimerIcon } from 'components/svg/SvgIcon';
import React from 'react';
import Countdown from 'react-countdown';
import { formatTime } from 'redux/actions/utils';
const getTypeCountdown = (percent) => {
    if (percent > 1 / 2) return TYPES.SUCCESS;
    else if (percent > 1 / 4) return TYPES.WARNING;
    return TYPES.FAILED;
};
const CircleCountdown = ({ timeExpire, countdownTime, size = 80, textSize, onComplete }) => {
    return timeExpire ? (
        <Countdown onComplete={onComplete} date={new Date(timeExpire).getTime()} renderer={({ props, ...countdownProps }) => props.children(countdownProps)}>
            {(props) => {
                return (
                    <div className="inline-block">
                        <CountdownTimer maxCountdown={countdownTime} textSize={textSize} size={size} {...props} />
                    </div>
                );
            }}
        </Countdown>
    ) : null;
};

export const CountdownClock = ({ countdownTime, timeExpire, onComplete }) => {
    return timeExpire ? (
        <Countdown onComplete={onComplete} date={new Date(timeExpire).getTime()} renderer={({ props, ...countdownProps }) => props.children(countdownProps)}>
            {(props) => {
                const type = getTypeCountdown(props.total / countdownTime);
                return props.total > 0 ? (
                    <TagV2 type={type} icon={false}>
                        <div className="flex text-sm gap-2 items-center">
                            <TimerIcon color="currentColor" size={16} />
                            <span>{formatTime(props.total, 'mm:ss')}</span>
                        </div>
                    </TagV2>
                ) : null;
            }}
        </Countdown>
    ) : null;
};

export default CircleCountdown;
