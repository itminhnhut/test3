import { IconLoading } from '../common/Icons';
import SymbolList from './SymbolList';
import InfoSlider from 'components/markets/InfoSlider';
import { BxsInfoCircleV2 } from 'components/svg/SvgIcon';
import useWindowSize from 'hooks/useWindowSize';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useRef, useEffect, useState, useMemo } from 'react';
import { ChevronLeft } from 'react-feather';
import { useSelector } from 'react-redux';
import { SPOT_LAYOUT_MODE } from 'redux/actions/const';
import { formatNumber } from 'redux/actions/utils';
import ChevronDown from 'src/components/svg/ChevronDown';
import { PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { setUserSymbolList } from 'src/redux/actions/market';
import { formatPrice, render24hChange, RefCurrency, getDecimalPrice } from 'src/redux/actions/utils';

const ModalAssetInfo = dynamic(() => import('./Components/Modal/AssetInfo'), { ssr: false });

const SymbolDetail = (props) => {
    const { symbol, favorite, changeSymbolList, watchList, fullScreen, layoutConfig, publicSocket, layoutMode, isPro, decimals } = props;
    const { t } = useTranslation('common');
    const [symbolTicker, setSymbolTicker] = useState(null);
    const [isInfoAsset, setIsInfoAsset] = useState(false);
    const [favoriteId, setFavoriteId] = useState('');
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const [showSymbolList, setShowSymbolList] = useState(false);

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
                <IconLoading color="#0c0e14" />
            </div>
        );
    }

    const handleToggleModal = () => setIsInfoAsset((prev) => !prev);

    const _renderSymbolList = () => {
        if (layoutMode === SPOT_LAYOUT_MODE.SIMPLE) {
            return (
                <>
                    <span className="text-txtPrimary dark:text-txtPrimary-dark font-medium text-xl">
                        {symbolTicker?.b}/{symbolTicker?.q}
                    </span>
                    <div className="cursor-pointer ml-2" onClick={handleToggleModal}>
                        <BxsInfoCircleV2 size={16} color="currentColor" />
                    </div>
                </>
            );
        } else if (layoutMode === SPOT_LAYOUT_MODE.PRO) {
            return (
                <>
                    <div
                        className={`h-full flex items-center ${open ? '' : 'text-opacity-90'} text-white group `}
                        onMouseOver={() => setShowSymbolList(true)}
                        onMouseLeave={() => setShowSymbolList(false)}
                    >
                        <span className="text-txtPrimary dark:text-txtPrimary-dark font-medium text-lg">
                            {symbolTicker?.b}/{symbolTicker?.q}
                        </span>
                        <ChevronDown size={16} className="ml-1" />
                        <div className="cursor-pointer ml-2" onClick={handleToggleModal}>
                            <BxsInfoCircleV2 size={16} color="currentColor" />
                        </div>
                        <div
                            className={`${isPro ? 'w-[400px] max-h-[386px] border dark:border-divider-dark border-divider' : 'w-80 h-72'} ${
                                showSymbolList ? '' : 'hidden'
                            } rounded-lg shadow-md bg-bgPrimary dark:bg-darkBlue-3 absolute left-6 top-full -mt-2`}
                        >
                            <SymbolList isPro={isPro} publicSocket={publicSocket} symbol={symbol} changeSymbolList={changeSymbolList} fullScreen={fullScreen} />
                        </div>
                    </div>
                </>
            );
        }
    };

    return (
        <>
            <div className="h-full w-full flex flex-row items-center justify-start bg-bgSpotContainer dark:bg-bgSpotContainer-dark">
                <div className="flex flex-row items-center px-6 h-full">
                    {/* <AssetLogo assetCode={symbolTicker?.b} size={32} /> */}
                    {_renderSymbolList()}
                </div>
                <div className={fullScreen ? 'hidden' : 'flex h-full w-full border-l border-divider dark:border-divider-dark overflow-hidden'}>
                    <div className="flex ml-4 flex-col h-full min-w-[100px] max-w-[150px] justify-center space-y-1">
                        <div className={`block font-semibold ${symbolTicker?.u ? 'text-teal' : 'text-red'}`}>
                            {formatNumber(symbolTicker?.p, decimals.price)}
                        </div>
                        <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm">
                            <RefCurrency price={symbolTicker?.p} quoteAsset={symbolTicker.q} />
                        </span>
                    </div>
                    <Detail symbolTicker={symbolTicker} exchangeConfig={exchangeConfig} symbol={symbol} t={t} decimals={decimals} />
                </div>
            </div>
            <ModalAssetInfo id={symbolTicker?.['bi']} open={isInfoAsset} onCloseModal={handleToggleModal} />
        </>
    );
};

const Detail = ({ symbolTicker, t, decimals }) => {
    return (
        <InfoSlider gutter={16} containerClassName="gap-6">
            {/* <div className="flex items-center w-full h-full gap-6 relative no-scrollbar"> */}
            <div className="flex flex-col min-w-max space-y-1">
                <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">{t('24h_change')}</div>
                <div className="block text-xs font-semibold">{render24hChange(symbolTicker, true)}</div>
            </div>
            <div className="flex flex-col min-w-max space-y-1">
                <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">{t('high')} 24h</div>
                <div className="block text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold">{formatNumber(symbolTicker?.h, decimals?.price)}</div>
            </div>
            <div className="flex flex-col min-w-max space-y-1">
                <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">{t('low')} 24h</div>
                <div className="block text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold">{formatNumber(symbolTicker?.l, decimals?.price)}</div>
            </div>
            <div className="flex flex-col min-w-max space-y-1">
                <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">
                    {t('volume')} 24h ({symbolTicker?.b})
                </div>
                <div className="block text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold">{formatNumber(symbolTicker?.vb, 2)}</div>
            </div>
            <div className="2xl:flex flex-col min-w-max space-y-1">
                <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">
                    {t('volume')} 24h ({symbolTicker?.q})
                </div>
                <div className="block text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold">{formatNumber(symbolTicker?.vq, 2)}</div>
            </div>
            {/* </div> */}
        </InfoSlider>
    );
};

export default SymbolDetail;
