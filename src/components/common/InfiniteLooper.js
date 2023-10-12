import React from 'react';
import styled, { css } from 'styled-components';

// loopSize is the number of duplicates children.
// loopDuration is the duration for one children to finish move on screen.
const InfiniteLooper = ({ children, gap, loopSize, loopDuration, pausedOnHover }) => {
    return (
        <Looper pausedOnHover={pausedOnHover} gap={gap}>
            {[...Array(loopSize).keys()].map((listNumber, index) => (
                <LooperList loopDuration={loopDuration} aria-hidden={index > 0 ? 'true' : 'false'} key={listNumber}>
                    {children}
                </LooperList>
            ))}
        </Looper>
    );
};

InfiniteLooper.defaultProps = {
    loopDuration: 30,
    loopSize: 3,
    gap: 32,
    pausedOnHover: true
};

export default InfiniteLooper;

const Looper = styled.div`
    --gap: ${({ gap }) => gap}px;

    @keyframes scroll {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(calc(-100% - var(--gap)));
        }
    }

    gap: var(--gap);
    display: flex;
    overflow: hidden;
    user-select: none;

    ${({ pausedOnHover }) =>
        pausedOnHover &&
        css`
            :hover {
                > div {
                    animation-play-state: paused;
                }
            }
        `}
`;

const LooperList = styled.div`
    flex-shrink: 0;
    display: flex;
    justify-content: space-around;
    min-width: 100%;
    gap: var(--gap);
    animation: ${({ loopDuration }) => loopDuration}s scroll linear infinite;
`;
