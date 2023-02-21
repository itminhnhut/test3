import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { render24hChange } from 'redux/actions/utils';
import { initMarketWatchItem } from 'src/utils';
import { shuffle } from 'lodash';
import Link from 'next/link';

const TrendingSlide = ({ trending }) => {
    const [listTrending, setListTrending] = useState([]);
    const outerRef = useRef(null);
    const innerRef = useRef(null);
    useEffect(() => {
        if (trending) {
            const trendingShuffle = shuffle(trending?.reduce((newArr, trend) => [...newArr, ...trend.pairs], []));
            setListTrending(trendingShuffle);
        }
    }, [trending]);

    return (
        <div className="looper" ref={outerRef}>
            <div className="looper__innerList" ref={innerRef}>
                {[...Array(3).keys()].map((_, ind) => (
                    <div key={ind} className="looper__listInstance">
                        {listTrending.map((pair) => {
                            const _ = initMarketWatchItem(pair);
                            return (
                                <Link href={`/trade/${_?.baseAsset}-${_?.quoteAsset}`}>
                                    <a className="!text-txtPrimary-dark md:hover:opacity-80 text-xs font-semibold flex mx-4 py-3">
                                        <div>
                                            <span>{_?.baseAsset}</span>
                                            <span>/{_?.quoteAsset}</span>
                                        </div>
                                        {render24hChange(pair)}
                                    </a>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingSlide;
