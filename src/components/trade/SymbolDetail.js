import AssetLogo from 'components/wallet/AssetLogo';
import AssetName from 'components/wallet/AssetName';
import { useTranslation } from 'next-i18next';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { setUserSymbolList } from 'src/redux/actions/market';
import { formatPrice, render24hChange } from 'src/redux/actions/utils';
import { IconStar, IconStarFilled } from '../common/Icons';

const SymbolDetail = (props) => {
    const { symbol, favorite, changeSymbolList, watchList, parentCallback, isOnSidebar, fullScreen, layoutConfig } = props;
    const { t } = useTranslation('common');
    const [symbolTicker, setSymbolTicker] = useState(null);
    const [favoriteId, setFavoriteId] = useState('');
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const ref = React.useRef(null);
    useEffect(() => {
        Emitter.on(PublicSocketEvent.SPOT_TICKER_UPDATE, async (data) => {
            setSymbolTicker(data);
        });
        return function cleanup() {
            Emitter.off(PublicSocketEvent.SPOT_TICKER_UPDATE);
        };
    }, [symbol]);
    useEffect(() => {
        if (!watchList) return;
        setFavoriteId(watchList.filter(list => list.type === 'FAVORITE')[0]?.id);
    }, [watchList]);
    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref.current, layoutConfig?.h]);

    const handleSetFavorite = async (asset) => {
        let newFavoriteList = [];

        if (favorite && favorite.length) {
            const isFav = favorite.includes(asset);
            if (!isFav) {
                newFavoriteList = await [...favorite, asset];
            } else {
                newFavoriteList = await favorite.filter(item => item !== asset);
            }
        } else {
            newFavoriteList.push(asset);
        }
        changeSymbolList(newFavoriteList);
        return setUserSymbolList(favoriteId, newFavoriteList);
    };
    if (!symbolTicker) return null;

    return (
        <>
            <div
                className="h-full w-full flex flex-row items-center justify-start dragHandleArea bg-white rounded border-b border-black-200"
            >
                <div className="flex flex-row  items-center px-4 dragCancelArea">
                    <AssetLogo assetCode={symbolTicker?.b} size={32} />
                    <div className="flex flex-col pl-4">
                        <span className="font-bold">
                            {symbolTicker?.b}/{symbolTicker?.q}
                        </span>
                        <span className="text-xs">
                            <AssetName assetCode={symbolTicker?.b} />
                        </span>
                    </div>
                </div>
                <div className={fullScreen ? 'hidden' : 'flex items-center w-full'}>
                    <div className="flex  flex-col content-end text-right mr-7.5 min-w-[100px] min-0 dragCancelArea">
                        <div
                            className="block text-black-700 font-semibold "
                        >{formatPrice(symbolTicker?.p, exchangeConfig, symbol?.quote)}
                        </div>
                    </div>
                    <div className="flex  flex-col min-w-max mr-7.5">
                        <div className="block text-black-500 text-xs text-left font-normal">{t('change')} 24h</div>
                        <div
                            className="block text-xs font-semibold "
                        >{render24hChange(symbolTicker)}
                        </div>
                    </div>
                    <div className="flex  flex-col mr-7.5 min-w-max">
                        <div className="block text-black-500 text-xs text-left font-normal">{t('high')} 24h</div>
                        <div
                            className="block text-black-700 text-xs font-semibold "
                        >{formatPrice(symbolTicker?.h, exchangeConfig, symbol?.quote)}
                        </div>
                    </div>
                    <div className="flex  flex-col mr-7.5 min-w-max">
                        <div className="block text-black-500 text-xs text-left font-normal">{t('low')} 24h</div>
                        <div
                            className="block text-black-700 text-xs font-semibold "
                        >{formatPrice(symbolTicker?.l, exchangeConfig, symbol?.quote)}
                        </div>
                    </div>
                    <div className="flex  flex-col min-w-max">
                        <div className="block text-black-500 text-xs text-left font-normal">{t('volume')} 24h ({symbolTicker?.b})</div>
                        <div
                            className="block text-black-700 text-xs font-semibold "
                        >{formatPrice(symbolTicker?.vb, 2)}
                        </div>
                    </div>
                    <div className="2xl:flex ml-7.5 flex-col min-w-max">
                        <div className="block text-black-500 text-xs text-left font-normal">{t('vol')} 24h ({symbolTicker?.q})</div>
                        <div
                            className="block text-black-700 text-xs font-semibold "
                        >{formatPrice(symbolTicker?.vq, 2)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SymbolDetail;
