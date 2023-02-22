import React from 'react';
import classNames from 'classnames';

// loopSize is the number of duplicates children.
// loopDuration is the duration for one children to finish move on screen.
const InfiniteLooper = ({ children, loopSize = 3, loopDuration = 30, onHoverPaused = true }) => {
    return (
        <div
            className={classNames('looper', {
                'looper-hover__paused': onHoverPaused
            })}
        >
            {[...Array(loopSize).keys()].map((listNumber, index) => (
                <div
                    className="looper__listInstance"
                    style={{ animationDuration: `${loopDuration}s` }}
                    aria-hidden={index > 0 ? 'true' : 'false'}
                    key={listNumber}
                >
                    {children}
                </div>
            ))}
        </div>
    );
};

export default InfiniteLooper;
