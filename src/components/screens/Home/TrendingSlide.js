import React, { useEffect, useState } from 'react';
import { render24hChange } from 'redux/actions/utils';
import { initMarketWatchItem } from 'src/utils';
import Link from 'next/link';
import InfiniteLooper from 'components/common/InfiniteLooper';
import shuffle from 'lodash/shuffle';

const LOOPER_LIST_SIZE = 2;

const TrendingSlide = ({ trending, marketCurrency }) => {
    const [listTrending, setListTrending] = useState([]);
    useEffect(() => {
        if (trending) {
            const trendingShuffle = shuffle(Object.values(trending)?.reduce((newArr, pairs) => [...newArr, ...pairs], []));
            setListTrending([...trendingShuffle]);
        }
    }, [trending]);

    return (
        <InfiniteLooper loopSize={LOOPER_LIST_SIZE} loopDuration={30}>
            {listTrending.map((pair, index) => {
                const _ = initMarketWatchItem(pair);
                const quote = marketCurrency;
                const symbol = `${pair.b}${quote}`;

                return (
                    <Link key={index} href={`/futures/${symbol}`}>
                        <a className="!text-txtPrimary-dark md:hover:opacity-80 text-xs font-semibold flex py-3">
                            <div>
                                <span>{_?.baseAsset}</span>
                                <span>/{quote}</span>
                            </div>
                            {render24hChange(pair)}
                        </a>
                    </Link>
                );
            })}
        </InfiniteLooper>
    );
};

export default React.memo(TrendingSlide);
