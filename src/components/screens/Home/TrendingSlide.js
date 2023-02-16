import React, { useEffect, useMemo, useRef } from 'react';
import { render24hChange } from 'redux/actions/utils';
import { initMarketWatchItem } from 'src/utils';
import { shuffle } from 'lodash';

const TrendingSlide = ({ trending }) => {
    const increaseRef = useRef(null);
    const moveLeftRef = useRef(true);
    const isHoveringRef = useRef(false);

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            if (increaseRef.current) {
                if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
                    moveLeftRef.current = false;
                } else if (increaseRef.current.scrollLeft === 0) {
                    moveLeftRef.current = true;
                }
                if (!isHoveringRef.current) {
                    increaseRef.current.scrollTo(moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1, 0);
                }
            }
        }, 50);

        return () => {
            clearInterval(scrollInterval);
        };
    }, []);

    const listTrending = useMemo(
        () => (trending ? shuffle(trending?.reduce((newArr, trend) => [...newArr, ...trend.pairs], [])) : []),

        [trending]
    );

    return (
        <div
            onMouseEnter={() => {
                isHoveringRef.current = true;
            }}
            onMouseLeave={() => {
                isHoveringRef.current = false;
            }}
            ref={increaseRef}
            className="flex justify-center z-[1000] overflow-x-hidden "
        >
            {listTrending?.map((pair) => {
                const _ = initMarketWatchItem(pair);
                return (
                    <a href={`/trade/${_?.baseAsset}-${_?.quoteAsset}`} className="text-txtPrimary-dark text-xs font-semibold flex px-4 py-3">
                        <div>
                            <span>{_?.baseAsset}</span>
                            <span>/{_?.quoteAsset}</span>
                        </div>
                        {render24hChange(pair)}
                    </a>
                );
            })}
        </div>
    );
};

export default TrendingSlide;
