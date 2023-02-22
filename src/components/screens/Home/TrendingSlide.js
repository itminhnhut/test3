import React, { useEffect, useState } from 'react';
import { render24hChange } from 'redux/actions/utils';
import { initMarketWatchItem } from 'src/utils';
import { shuffle } from 'lodash';
import Link from 'next/link';

const LOOPER_LIST_SIZE = 2 

const TrendingSlide = ({ trending }) => {
    const [listTrending, setListTrending] = useState([]);
    useEffect(() => {
        if (trending) {
            const trendingShuffle = shuffle(trending?.reduce((newArr, trend) => [...newArr, ...trend.pairs], []));
            setListTrending([...trendingShuffle]);
        }
    }, [trending]);

    return (
        <div className="looper bg-transparent">
            {[...Array(LOOPER_LIST_SIZE).keys()].map((content, index) => (
                <div className="looper__listInstance" key={content} aria-hidden={index > 0  ? 'true' : 'false'}>
                    {listTrending.map((pair) => {
                        const _ = initMarketWatchItem(pair);
                        return (
                            <Link key={_?.symbol} href={`/trade/${_?.baseAsset}-${_?.quoteAsset}`}>
                                <a className="!text-txtPrimary-dark md:hover:opacity-80 text-xs font-semibold flex py-3">
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
    );
};

export default TrendingSlide;
