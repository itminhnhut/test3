import { memo } from 'react';
import { PRODUCT } from 'constants/constants';
import Head from 'next/head';
import { formatNumber } from 'redux/actions/utils';
import { roundTo } from 'round-to';

const FuturesPageTitle = memo(({ pair, price, pricePrecision }) => {
    return (
        <Head>
            <title>
                {price && `${formatNumber(
                    roundTo(price || 0, pricePrecision || 0),
                    pricePrecision
                )}` + ' | ' + pair + ' | '}{' '}
                {PRODUCT.FUTURES}
            </title>
        </Head>
    )
})

export default FuturesPageTitle
