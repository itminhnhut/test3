import classNames from 'classnames';
import React, { useState, useEffect, useMemo } from 'react';
import { PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';

const Network = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [latency, setLatency] = useState(60);

    useEffect(() => {
        const handleOnline = () => {
            setLatency(60);
            setIsOnline(true);
        };
        const handleOffline = () => {
            setLatency(9999);
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        // const ping = () => {
        //     const start = new Date();
        //     ws.send('ping');
        //     ws.onmessage = (event) => {
        //         if (event.data === 'pong') {
        //             const end = new Date();
        //             setLatency(end - start);
        //         }
        //     };
        // };
        // const intervalId = setInterval(ping, 5000); // Ping every 5 seconds.
        // return () => clearInterval(intervalId);
    }, []);

    const renderTitle = () => {
        if (!isOnline) return <span className="text-txtSecondary">Disconnected</span>;
        if (latency > 200) return <span className="text-yellow-1">Unstable connection</span>;

        return <span className="text-teal">Stable connection</span>;
    };

    return (
        <div className="flex items-center space-x-2 text-xs">
            <svg
                className={classNames('text-teal', { '!text-txtSecondary': !isOnline, 'text-yellow-1': latency > 200 })}
                width="12"
                height="9.33"
                viewBox="0 0 12 9.33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width="2" height="3.33" fill="currentColor" y="6"></rect>
                <rect width="2" height="5.33" fill="currentColor" x="3" y="4"></rect>
                <rect width="2" height="7.33" fill="currentColor" x="6" y="2"></rect>
                <rect width="2" height="9.33" fill="currentColor" x="9"></rect>
            </svg>
            <div>{renderTitle()}</div>
        </div>
    );
};

export default Network;
