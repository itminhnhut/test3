import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { PublicSocketEvent } from 'redux/actions/const';
import { debounce } from 'lodash';
import { PATHS } from 'constants/paths';

import FuturesMarketWatch from 'models/FuturesMarketWatch';
import classNames from 'classnames';
import Emitter from 'redux/actions/emitter';
import { usePrevious } from 'react-use';
import { formatNumber } from 'redux/actions/utils';
import { roundTo } from 'round-to';
import Star from 'components/svg/Star';
import colors from 'styles/colors';
import { favoriteAction } from 'redux/actions/user';
import { TRADING_MODE } from 'redux/actions/const';
import { getFuturesFavoritePairs } from '../../../../redux/actions/futures';
import PriceChangePercent from 'components/common/PriceChangePercent';

const FuturesPairListItemV2 = ({ pairConfig, isDark, isFavorite, isAuth, onSelectPair = null }) => {
    const dispatch = useDispatch();
    const publicSocket = useSelector((state) => state.futures.publicSocket);
    const router = useRouter();

    const isClickFavorite = useRef(false);

    const handleSetFavorite = async () => {
        isClickFavorite.current = true;
        await favoriteAction(isFavorite ? 'delete' : 'put', TRADING_MODE.FUTURES, pairConfig?.baseAsset + '_' + pairConfig?.quoteAsset);
        dispatch(getFuturesFavoritePairs());
        isClickFavorite.current = false;
    };

    useEffect(() => {
        if (pairConfig?.pair) {
            Emitter.on(PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE + pairConfig.pair, async (data) => {
                if (data) {
                    const _pairTicker = FuturesMarketWatch.create(data, pairConfig?.quoteAsset);
                    // if (_pairTicker?.symbol === pairConfig.pair) {
                    //     setPairTicker(_pairTicker);
                    // }
                }
            });
        }

        return () => Emitter.off(PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE + pairConfig.pair);
    }, [publicSocket, pairConfig?.pair]);

    // useEffect(() => console.log('MinTicker => ', pairTicker), [pairTicker])
    const handleClickItem = () => {
        if (!isClickFavorite.current) {
            if (isFunction(onSelectPair)) {
                // callback function for modal trading rule
                onSelectPair(pairConfig?.pair);
            } else {
                router.push(PATHS.FUTURES_V2.DEFAULT + `/${pairConfig?.pair}`);
            }
        }
        // !isClickFavorite.current && router.push(PATHS.FUTURES_V2.DEFAULT + `/${pairConfig?.pair}`); // old logic handle onClick
    };
    return (
        <div
            className="px-4 py-1.5 flex items-center font-normal text-xs leading-[16px] hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer select-none dark:text-txtPrimary-dark tracking-normal"
            onClick={handleClickItem}
        >
            <div style={{ flex: '1 1 0%' }} className="flex items-center">
                {isAuth && (
                    <Star
                        onClick={handleSetFavorite}
                        size={16}
                        fill={isFavorite ? colors.yellow : isDark ? colors.darkBlue5 : colors.grey2}
                        className="cursor-pointer mr-[10px]"
                    />
                )}
                {pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}
            </div>
            <div
                style={{ flex: '1 1 0%' }}
                className={classNames('justify-end text-right text-dominant', {
                    '!text-red': pairConfig?.priceChangePercent < 0
                })}
            >
                {pairConfig?.lastPrice ? formatNumber(pairConfig?.lastPrice, pairConfig?.pricePrecision) : '--'}
            </div>
            <PriceChangePercent priceChangePercent={pairConfig?.priceChangePercent} style={{ flex: '1 1 0%' }} />
        </div>
    );
};

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export default FuturesPairListItemV2;
