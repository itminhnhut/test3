import { useState } from 'react';
import { formatTime } from 'redux/actions/utils';

const getColor = (percent) => {
    if (percent > 1 / 2) return 'text-green-3 dark:text-green-2';
    else if (percent > 1 / 4) return 'text-yellow-2';
    return 'text-red-2';
};

const styles = {
    countdownContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        margin: 'auto'
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: 'rotateY(-180deg) rotateZ(-90deg)',
        overflow: 'visible'
    },
    button: {
        fontSize: 16,
        padding: '15px 40px',
        margin: '10px auto 30px',
        display: 'block',
        backgroundColor: '#4d4d4d',
        color: 'lightgray',
        border: 'none',
        cursor: 'pointer',
        outline: 0
    }
};

const maxCountdown = 5 * 60 * 1000;
const countDownStep = 10; // Smaller by smaller => Smooth but poor performance

const CountdownTimer = ({ timeExpired = Date.now() + 10000, size = 80, strokeWidth = 3 }) => {
    const radius = size / 2;
    const circumference = size * Math.PI;
    const [countDown, setCountDown] = useState(timeExpired - Date.now());

    const strokeDashoffset = () => -(circumference - (countDown / maxCountdown) * circumference);

    useState(() => {
        const interval = setInterval(() => {
            setCountDown((prev) => {
                if (prev - countDownStep < 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - countDownStep;
            });
        }, countDownStep);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div
                className="flex justify-center items-center relative m-auto"
                style={{
                    height: size,
                    width: size
                }}
                // style={Object.assign({}, countdownSizeStyles)}
            >
                {/* time */}
                <span className={`text-left text-lg font-semibold ${getColor(countDown / maxCountdown)}`}>{formatTime(new Date(countDown), 'mm:ss')}</span>

                {/* circle border back */}
                <svg className="text-divider dark:text-divider-dark" style={styles.svg}>
                    <circle className="stroke-current" cx={radius} cy={radius} r={radius} fill="none" strokeWidth={strokeWidth}></circle>
                </svg>

                {/* circle border front (timer) */}
                <svg style={styles.svg} className={getColor(countDown / maxCountdown) + ''}>
                    <circle
                        className="stroke-current transition-all"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset()}
                        r={radius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                        strokeLinecap="round"
                        // stroke={getColor(countDown / maxCountdown)}
                        strokeWidth={strokeWidth}
                    ></circle>
                </svg>
            </div>
        </div>
    );
};

export default CountdownTimer;
