import { useState, useEffect, useMemo, useRef } from 'react';
import colors from 'styles/colors';
import { formatTime } from 'redux/actions/utils';
import classNames from 'classnames';

const getColor = (percent) => {
    if (percent > 1 / 2) return 'text-green-3 dark:text-green-2';
    else if (percent > 1 / 4) return 'text-yellow-2';
    return 'text-red-2';
};

const getCircumference = (radius) => 2 * Math.PI * radius;

const RADIUS = 40; // set radius in pixels
const STROKE_WIDTH = 3; // set stroke width in pixels
const TOTAL_TIME = 5 * 60; // set total time in seconds

export const timeLeftFromExpireTime = (expireTime) => new Date(expireTime).getTime() - Date.now();

const CountdownTimer = ({ size = 80, totalTime = TOTAL_TIME, radius = RADIUS, strokeWidth = STROKE_WIDTH, timeExpire = '2023-03-23T10:03:25.171Z' }) => {
    const [timeLeft, setTimeLeft] = useState(() => {
        const timeExpireInSecond = timeLeftFromExpireTime(timeExpire) / 1000;
        return timeExpireInSecond <= 0 ? 0 : timeExpireInSecond;
    }); // set initial time in seconds
    const timeLeftRef = useRef(null);
    timeLeftRef.current = timeLeft;

    // start the timer and update the time left every second
    useEffect(() => {
        const intervalId = setInterval(function () {
            setTimeLeft((prevTimeLeft) => (prevTimeLeft <= 1 ? 0 : prevTimeLeft - 1));
            if (timeLeftRef.current === 0) clearInterval(intervalId);
        }, 1000);

        // cleanup function to clear the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // calculate the stroke dash offset based on the time left and the total time
    const circumference = useMemo(() => getCircumference(radius), [radius]);
    const strokeDashoffset = useMemo(() => circumference - (timeLeft / totalTime) * circumference, [circumference, timeLeft, totalTime]);

    return (
        timeLeft > 0 && (
            <div style={{ width: radius * 2, height: radius * 2 }} className={classNames('relative', getColor(timeLeft / totalTime))}>
                <div className={classNames('rounded-full border-[3px] border-divider dark:border-divider-dark h-full w-full flex items-center justify-center')}>
                    <span className="text-lg leading-[28px] font-semibold">{formatTime(timeLeft * 1000, 'mm:ss')}</span>
                </div>
                <svg className={classNames('absolute z-20 top-0 left-0 transform -rotate-90')} width={radius * 2} height={radius * 2}>
                    <circle
                        className="stroke-current transition-all"
                        cx={radius}
                        cy={radius}
                        r={radius - strokeWidth / 2}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        fill="transparent"
                    />
                </svg>
            </div>
        )
    );
};

export default CountdownTimer;
