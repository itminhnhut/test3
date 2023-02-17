import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { render24hChange } from 'redux/actions/utils';
import { initMarketWatchItem } from 'src/utils';
import { shuffle } from 'lodash';

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
                ))}
            </div>
        </div>
    );
};

export default TrendingSlide;
