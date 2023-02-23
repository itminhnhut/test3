import React, { useEffect, useState } from 'react';
import { render24hChange } from 'redux/actions/utils';
import { initMarketWatchItem } from 'src/utils';
import { shuffle } from 'lodash';
import Link from 'next/link';
import InfiniteLooper from '../../common/InfiniteLooper';

const LOOPER_LIST_SIZE = 2;

const TrendingSlide = ({ trending }) => {
    const [listTrending, setListTrending] = useState([]);
    console.log('listTrending:', listTrending)
    useEffect(() => {
        if (trending) {
            const trendingShuffle = shuffle(Object.values(trending)?.reduce((newArr, pairs) => [...newArr, ...pairs], []));
            setListTrending([...trendingShuffle]);
        }
    }, [trending]);

    return (
        <InfiniteLooper loopSize={LOOPER_LIST_SIZE} loopDuration={30}>
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
        </InfiniteLooper>
    );
};

export default TrendingSlide;
