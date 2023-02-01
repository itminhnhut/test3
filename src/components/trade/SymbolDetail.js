import { Popover, Transition } from '@headlessui/react';
import ChevronDown from 'src/components/svg/ChevronDown';
import AssetLogo from 'src/components/wallet/AssetLogo';
import useDarkMode from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import * as React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SPOT_LAYOUT_MODE } from 'redux/actions/const';
import { PublicSocketEvent, rateCurrency } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { setUserSymbolList } from 'src/redux/actions/market';
import { formatPrice, render24hChange, RefCurrency } from 'src/redux/actions/utils';
import { IconLoading } from '../common/Icons';
import SymbolList from './SymbolList';

const SymbolDetail = (props) => {
    const { symbol, favorite, changeSymbolList, watchList, fullScreen, layoutConfig, publicSocket, layoutMode } = props;
    const { t } = useTranslation('common');
    const [symbolTicker, setSymbolTicker] = useState(null);
    const [favoriteId, setFavoriteId] = useState('');
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);

    const [currentTheme] = useDarkMode();

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
        setFavoriteId(watchList.filter((list) => list.type === 'FAVORITE')[0]?.id);
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
                newFavoriteList = await favorite.filter((item) => item !== asset);
            }
        } else {
            newFavoriteList.push(asset);
        }
        changeSymbolList(newFavoriteList);
        return setUserSymbolList(favoriteId, newFavoriteList);
    };
    if (!symbolTicker) {
        return (
            <div className="absolute w-full h-full z-10 flex justify-center items-center bg-bgSpotContainer dark:bg-bgSpotContainer-dark">
                <IconLoading color="#00C8BC" />
            </div>
        );
    }

    const _renderSymbolList = () => {
        if (layoutMode === SPOT_LAYOUT_MODE.SIMPLE) {
            return (
                <span className="text-txtPrimary dark:text-txtPrimary-dark font-medium text-xl">
                    {symbolTicker?.b}/{symbolTicker?.q}
                </span>
            );
        } else if (layoutMode === SPOT_LAYOUT_MODE.PRO) {
            return (
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button className={`h-full flex items-center ml-2 ${open ? '' : 'text-opacity-90'} text-white group px-2`}>
                                <span className="text-txtPrimary dark:text-txtPrimary-dark font-medium text-lg">
                                    {symbolTicker?.b}/{symbolTicker?.q}
                                </span>

                                <ChevronDown size={16} className="ml-1" />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute left-0 z-50">
                                    <div className="w-80 h-72 rounded-lg shadow-md bg-bgPrimary dark:bg-darkBlue-2 divide-solid divide-divider dark:divide-divider-dark overflow-y-scroll">
                                        <SymbolList publicSocket={publicSocket} symbol={symbol} changeSymbolList={changeSymbolList} />
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            );
        }
    };

    return (
        <>
            <div className="h-full w-full flex flex-row items-center justify-start bg-bgSpotContainer dark:bg-bgSpotContainer-dark">
                <div className="flex flex-row  items-center px-6">
                    {/* <AssetLogo assetCode={symbolTicker?.b} size={32} /> */}
                    {_renderSymbolList()}
                </div>
                <div className={fullScreen ? 'hidden' : 'flex items-center w-full border-l border-divider dark:border-divider-dark space-x-6'}>
                    <div className="flex flex-col min-w-[100px] items-center min-0 space-y-1 pl-4">
                        <div>
                            <div className={`block font-semibold ${symbolTicker?.u ? 'text-teal' : 'text-red'}`}>
                                {formatPrice(symbolTicker?.p, exchangeConfig, symbol?.quote)}
                            </div>
                            <span className="text-txtSecondary-dark text-sm">
                                <RefCurrency price={symbolTicker?.p} quoteAsset={symbolTicker.q} />
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col min-w-max space-y-1 ">
                        <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">{t('change')} 24h</div>
                        <div className="block text-xs font-semibold">{render24hChange(symbolTicker, true)}</div>
                    </div>
                    <div className="flex flex-col min-w-max space-y-1">
                        <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">{t('high')} 24h</div>
                        <div className="block text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold">
                            {formatPrice(symbolTicker?.h, exchangeConfig, symbol?.quote)}
                        </div>
                    </div>
                    <div className="flex flex-col min-w-max space-y-1">
                        <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">{t('low')} 24h</div>
                        <div className="block text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold">
                            {formatPrice(symbolTicker?.l, exchangeConfig, symbol?.quote)}
                        </div>
                    </div>
                    <div className="flex flex-col min-w-max space-y-1">
                        <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">
                            {t('volume')} 24h ({symbolTicker?.b})
                        </div>
                        <div className="block text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold">{formatPrice(symbolTicker?.vb, 2)}</div>
                    </div>
                    <div className="2xl:flex flex-col min-w-max space-y-1">
                        <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">
                            {t('vol')} 24h ({symbolTicker?.q})
                        </div>
                        <div className="block text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold">{formatPrice(symbolTicker?.vq, 2)}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SymbolDetail;
