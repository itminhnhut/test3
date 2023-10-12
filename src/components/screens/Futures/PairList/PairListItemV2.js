import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { PublicSocketEvent } from 'redux/actions/const';
import { PATHS } from 'constants/paths';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import Emitter from 'redux/actions/emitter';
import { LastPrice, convertSymbol } from 'redux/actions/utils';
import { BxsStarIcon } from 'components/svg/SvgIcon';
import colors from 'styles/colors';
import { favoriteAction } from 'redux/actions/user';
import { TRADING_MODE } from 'redux/actions/const';
import { getFuturesFavoritePairs } from '../../../../redux/actions/futures';
import PriceChangePercent from 'components/common/PriceChangePercent';

const FuturesPairListItemV2 = ({ pairConfig, isDark, isFavorite, isAuth, onSelectPair = null }) => {
    const dispatch = useDispatch();
    const publicSocket = useSelector((state) => state.futures.publicSocket);
    const router = useRouter();
    const [ticker, setTicker] = useState(null);
    const isClickFavorite = useRef(false);
    const symbol = convertSymbol(pairConfig?.pair);
    const lastPrice = ticker?.lastPrice ?? pairConfig?.lastPrice;
    const priceChangePercent = ticker?.priceChangePercent ?? pairConfig?.priceChangePercent;

    const handleSetFavorite = async () => {
        isClickFavorite.current = true;
        await favoriteAction(isFavorite ? 'delete' : 'put', TRADING_MODE.FUTURES, pairConfig?.baseAsset + '_' + pairConfig?.quoteAsset);
        dispatch(getFuturesFavoritePairs());
        isClickFavorite.current = false;
    };

    useEffect(() => {
        if (symbol) {
            Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol, async (data) => {
                if (data) {
                    const _pairTicker = FuturesMarketWatch.create(data);
                    if (convertSymbol(_pairTicker?.symbol) === symbol) {
                        setTicker(_pairTicker);
                    }
                }
            });
        }

        return () => Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol);
    }, [publicSocket, symbol]);

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
                    <BxsStarIcon
                        className="cursor-pointer mr-[10px]"
                        onClick={handleSetFavorite}
                        fill={isFavorite ? colors.yellow[2] : isDark ? colors.darkBlue5 : colors.gray[2]}
                    />
                )}
                {pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}
            </div>
            <LastPrice price={lastPrice} style={{ flex: '1 1 0%' }} className="justify-end text-right" />
            <PriceChangePercent priceChangePercent={priceChangePercent} style={{ flex: '1 1 0%' }} />
        </div>
    );
};

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export default FuturesPairListItemV2;
