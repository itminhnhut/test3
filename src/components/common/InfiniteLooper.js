import React from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';

// loopSize is the number of duplicates children.
// loopDuration is the duration for one children to finish move on screen.
const InfiniteLooper = ({ children, gap, loopSize = 3, loopDuration = 30, pausedOnHover = true }) => {
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

export default InfiniteLooper;

const Looper = styled.div`
    --gap: ${({ gap }) => gap ?? 32}px;

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
    animation: ${({ loopDuration }) => loopDuration ?? 25}s scroll linear infinite;
`;
