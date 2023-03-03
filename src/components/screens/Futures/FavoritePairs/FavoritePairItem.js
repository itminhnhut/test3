import { memo } from 'react';
import { formatNumber } from 'redux/actions/utils';
import { useRouter } from 'next/router';
import { roundTo } from 'round-to';
import { PATHS } from 'constants/paths';
import classNames from 'classnames';
import ChevronDown from 'src/components/svg/ChevronDown';
import colors from 'styles/colors';

const FuturesFavoritePairItem = memo(({ pair }) => {
    const router = useRouter();
    const active = router.query?.pair === pair?.symbol;
    const negative = pair?.priceChangePercent < 0;
    return (
        <div
            className="flex flex-col items-start justify-center font-semibold pl-[22px] pr-[22px] h-full hover:bg-hover dark:hover:bg-hover-dark cursor-pointer select-none"
            onClick={() => !active && router.push(PATHS.FUTURES_V2.DEFAULT + `/${pair?.symbol}`)}
        >
            <div className="text-sm mb-[2px]">
                {pair?.baseAsset}/{pair?.quoteAsset}
            </div>
            <div
                className={classNames('tracking-wide text-xs flex', {
                    'text-red': negative,
                    'text-dominant': !negative
                })}
            >
                <ChevronDown color={negative ? colors.red2 : colors.teal} className={negative ? '' : '!rotate-0'} />
                {formatNumber(roundTo(Math.abs(pair?.priceChangePercent) * 100, 2), 2, 2, true)}%
            </div>
        </div>
    );
});

export default FuturesFavoritePairItem;
