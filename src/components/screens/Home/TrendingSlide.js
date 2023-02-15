import React, { useEffect, useMemo, useRef } from 'react';
import { formatPrice, getExchange24hPercentageChange, render24hChange } from 'redux/actions/utils';
import { initMarketWatchItem, sparkLineBuilder } from 'src/utils';
import { shuffle } from 'lodash';

const TrendingSlide = ({ trending }) => {
    const increaseRef = useRef(null);
    const moveLeftRef = useRef(true);

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            if (increaseRef.current) {
                if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
                    moveLeftRef.current = false;
                } else if (increaseRef.current.scrollLeft === 0) {
                    moveLeftRef.current = true;
                }
                increaseRef.current.scrollTo(moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1, 0);
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
        <div ref={increaseRef} className="flex md:mb-20 z-[1000] overflow-x-hidden ">
            {listTrending?.map((pair) => {
                const _ = initMarketWatchItem(pair);
                return (
                    <div className="text-txtPrimary-dark text-xs font-semibold flex px-4 py-3">
                        <div>
                            <span>{_?.baseAsset}</span>
                            <span>/{_?.quoteAsset}</span>
                        </div>
                        {render24hChange(pair)}
                    </div>
                );
            })}
        </div>
    );
};

export default TrendingSlide;
