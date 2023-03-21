import { useState, useEffect } from 'react';
import colors from 'styles/colors';

const CountdownTimer = ({ size = 80 }) => {
    const [timeLeft, setTimeLeft] = useState(60); // set initial time in seconds
    const totalTime = 60; // set total time in seconds
    const radius = 40; // set radius in pixels
    const strokeWidth = 3; // set stroke width in pixels

    // start the timer and update the time left every second
    useEffect(() => {
        if (timeLeft <= 0) return;
        const intervalId = setInterval(() => {
            setTimeLeft((timeLeft) => timeLeft - 1);
        }, 1000);

        // cleanup function to clear the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, [timeLeft]);

    // calculate the circumference of the circle based on the radius
    const circumference = 2 * Math.PI * radius;

    // calculate the stroke dash offset based on the time left and the total time
    const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;

    return (
        <div style={{ width: radius * 2, height: radius * 2 }} className="relative">
            <div className="rounded-full border-[3px] border-divider dark:border-divider-dark h-full w-full flex items-center justify-center">
                <span className="text-lg leading-[28px] text-green-3 dark:text-green-2 font-semibold">{timeLeft}</span>
            </div>
            <svg className="absolute z-20 top-0 left-0 transform -rotate-90 text-green-3" width={radius * 2} height={radius * 2}>
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
