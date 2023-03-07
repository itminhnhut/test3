import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFuturesFavoritePairs, mergeFuturesFavoritePairs } from 'redux/actions/futures';
import { API_GET_FUTURES_MARKET_WATCH } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';

import FuturesFavoritePairItem from 'components/screens/Futures/FavoritePairs/FavoritePairItem';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import InfoSlider from 'components/markets/InfoSlider';
import colors from 'styles/colors';
import axios from 'axios';
import { BxsStarIcon } from 'components/svg/SvgIcon';

import 'react-loading-skeleton/dist/skeleton.css';
import Skeletor from 'components/common/Skeletor';
import { FireIcon } from 'components/svg/SvgIcon';

const FuturesFavoritePairs = memo(({ favoritePairLayout, pairConfig }) => {
    const quoteAsset = pairConfig?.quoteAsset;
    const [loading, setLoading] = useState(false);
    const [refreshMarketWatch, setRefreshMarketWatch] = useState(null);
    const dispatch = useDispatch();
    const favoritePairs = useSelector((state) => state.futures.favoritePairs);
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);

    const fetchMarketWatch = async (isRefresh = false) => {
        !isRefresh && setLoading(true);
        try {
            const { data } = await axios.get(API_GET_FUTURES_MARKET_WATCH);
            if (data?.status === ApiStatus.SUCCESS) {
                setRefreshMarketWatch(data?.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Init
        fetchMarketWatch();
        dispatch(getFuturesFavoritePairs());
    }, []);

    if (!favoritePairs) return null;

    const dataFilter = useMemo(() => {
        const suggestedSymbols = ['BNB', 'BCH', 'BTC', 'LTC', 'ETH', 'EOS', 'ETC'];
        const marketWatch = refreshMarketWatch?.map((o) => {
            const quoteAsset = allPairConfigs.find((i) => i.pair === o.s)?.quoteAsset;
            return FuturesMarketWatch.create(o, quoteAsset);
        });

        const favorites = mergeFuturesFavoritePairs(favoritePairs, marketWatch);
        return {
            isFavorite: Array.isArray(favorites) && favorites.length > 0,
            list:
                (Array.isArray(favorites) && favorites.length > 0
                    ? favorites
                    : marketWatch?.filter((o) => suggestedSymbols.find((s) => s + quoteAsset === o?.symbol))) || []
        };
    }, [favoritePairs, refreshMarketWatch]);

    return (
        <div className="h-full w-full flex items-center pr-3">
            <div className="flex items-center pl-6 h-full">{dataFilter.isFavorite ? <BxsStarIcon size={16} fill={colors.yellow[2]} /> : <FireIcon />}</div>
            <InfoSlider gutter={18} forceUpdateState={favoritePairLayout?.h} containerClassName="h-full">
                {loading ? (
                    <div className="flex gap-11">
                        <Skeletor width={120} />
                        <Skeletor width={120} />
                        <Skeletor width={120} />
                        <Skeletor width={120} />
                        <Skeletor width={120} />
                        <Skeletor width={120} />
                        <Skeletor width={120} />
                        <Skeletor width={120} />
                    </div>
                ) : (
                    dataFilter.list.map((pair) => <FuturesFavoritePairItem key={pair?.symbol} pair={pair} />)
                )}
            </InfoSlider>
        </div>
    );
});

export default FuturesFavoritePairs;
