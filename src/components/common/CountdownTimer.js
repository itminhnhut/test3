import { useState, useEffect } from 'react';
import colors from 'styles/colors';
import { formatTime } from 'redux/actions/utils';

const testTime = () => {
    let now = new Date();

    // Add 15 minutes to the current time
    let fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);

    // Get the timestamp for 15 minutes from now
    let timestamp = fifteenMinutesFromNow.getTime();

    return timestamp;
};

const getColor = (percent, isDark) => {
    if (isDark) {
        if (percent > 1 / 2) return colors.green[2];
        else if (percent > 1 / 4) return colors.yellow[2];
        else return colors.red[2];
    } else {
        if (percent > 1 / 2) return colors.green[3];
        else if (percent > 1 / 4) return colors.yellow[2];
        else return colors.red[2];
    }
};

const CountdownTimer = ({ size = 80, timeExpire = '2023-03-21T08:32:25.171Z', isDark = true }) => {
    const [timeLeft, setTimeLeft] = useState(15 * 60); // set initial time in seconds
    const totalTime = 15 * 60; // set total time in seconds
    const radius = 40; // set radius in pixels
    const strokeWidth = 3; // set stroke width in pixels

    // if (Date.now() > +new Date(timeExpire)) return null;

    // useEffect(() => {
    //     // setTimeLeft(+new Date(timeExpire) - Date.now());
    //     setTimeLeft(testTime());
    // }, [timeExpire]);

    // start the timer and update the time left every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (timeLeft && timeLeft > 0) setTimeLeft((timeLeft) => timeLeft - 1);
        }, 1000);

        // cleanup function to clear the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // calculate the circumference of the circle based on the radius
    const circumference = 2 * Math.PI * radius;

    // calculate the stroke dash offset based on the time left and the total time
    const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;

    return (
        <div style={{ width: radius * 2, height: radius * 2 }} className="relative">
            <div className="rounded-full border-[3px] border-divider dark:border-divider-dark h-full w-full flex items-center justify-center">
                <span
                    style={{
                        color: getColor(timeLeft / totalTime, isDark)
                    }}
                    className="text-lg leading-[28px] font-semibold"
                >
                    {formatTime(timeLeft * 1000, 'mm:ss')}
                </span>
            </div>
            <svg
                style={{
                    color: getColor(timeLeft / totalTime, isDark)
                }}
                className="absolute z-20 top-0 left-0 transform -rotate-90"
                width={radius * 2}
                height={radius * 2}
            >
                <circle
                    className="stroke-current"
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
    );
};

export default CountdownTimer;
