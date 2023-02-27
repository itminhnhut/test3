import ChevronDown from 'src/components/svg/ChevronDown';
import { useTranslation } from 'next-i18next';
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SPOT_LAYOUT_MODE } from 'redux/actions/const';
import { PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { setUserSymbolList } from 'src/redux/actions/market';
import { formatPrice, render24hChange, RefCurrency } from 'src/redux/actions/utils';
import { IconLoading } from '../common/Icons';
import SymbolList from './SymbolList';
import { ChevronLeft } from 'react-feather';
import useWindowSize from 'hooks/useWindowSize';

const SymbolDetail = (props) => {
    const { symbol, favorite, changeSymbolList, watchList, fullScreen, layoutConfig, publicSocket, layoutMode, isPro } = props;
    const { t } = useTranslation('common');
    const [symbolTicker, setSymbolTicker] = useState(null);
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

    const _renderSymbolList = () => {
        if (layoutMode === SPOT_LAYOUT_MODE.SIMPLE) {
            return (
                <span className="text-txtPrimary dark:text-txtPrimary-dark font-medium text-xl">
                    {symbolTicker?.b}/{symbolTicker?.q}
                </span>
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
                        <div
                            className={`${isPro ? 'w-[400px] max-h-[386px] border border-divider-dark' : 'w-80 h-72'} ${
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
                <div className={fullScreen ? 'hidden' : 'flex items-center w-full h-full border-l border-divider dark:border-divider-dark overflow-hidden'}>
                    <div className="flex flex-col min-w-[100px] max-w-[150px] items-center min-0 space-y-1 mx-4">
                        <div>
                            <div className={`block font-semibold ${symbolTicker?.u ? 'text-teal' : 'text-red'}`}>
                                {formatPrice(symbolTicker?.p, exchangeConfig, symbol?.quote)}
                            </div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm">
                                <RefCurrency price={symbolTicker?.p} quoteAsset={symbolTicker.q} />
                            </span>
                        </div>
                    </div>
                    <Detail symbolTicker={symbolTicker} exchangeConfig={exchangeConfig} symbol={symbol} t={t} />
                </div>
            </div>
        </>
    );
};

const Detail = ({ symbolTicker, exchangeConfig, symbol, t, fullScreen }) => {
    const { width } = useWindowSize();
    const mouseDown = useRef(false);
    const startX = useRef(null);
    const scrollLeft = useRef(null);
    const startY = useRef(null);
    const scrollTop = useRef(null);
    const content = useRef(null);

    const handleClick = useRef(true);

    const btnLeft = useRef(null);
    const btnRight = useRef(null);

    const startDragging = (e) => {
        content.current.classList.add('cursor-grabbing');
        mouseDown.current = true;
        startX.current = e.pageX - content.current.offsetLeft;
        scrollLeft.current = content.current.scrollLeft;

        startY.current = e.pageY - content.current.offsetTop;
        scrollTop.current = content.current.scrollTop;
        handleClick.current = true;
    };

    const stopDragging = (event) => {
        content.current.classList.remove('cursor-grabbing');
        mouseDown.current = false;
    };

    const onDrag = (e) => {
        e.preventDefault();
        if (!mouseDown.current || content.current.scrollWidth - content.current.offsetWidth <= 0) return;
        const x = e.pageX - content.current.offsetLeft;
        const scroll = x - startX.current;
        content.current.scrollLeft = scrollLeft.current - scroll;

        const y = e.pageY - content.current.offsetTop;
        const scrollY = y - startY.current;
        content.current.scrollTop = scrollTop.current - scrollY;
        handleClick.current = false;
        content.current.style.scrollBehavior = 'unset';
        if (content.current.scrollLeft <= 10) {
            btnLeft.current.classList.add('invisible');
            btnRight.current.classList.remove('invisible');
        } else {
            btnLeft.current.classList.remove('invisible');
            if (content.current.scrollLeft >= content.current.scrollWidth - content.current.offsetWidth - 24) {
                btnRight.current.classList.add('invisible');
            } else {
                btnRight.current.classList.remove('invisible');
            }
        }
    };

    useEffect(() => {
        if (content.current) {
            const hidden = content.current.scrollLeft >= content.current.scrollWidth - content.current.offsetWidth - 24;
            btnLeft.current.classList[content.current.scrollLeft > 5 ? 'remove' : 'add']('invisible');
            btnRight.current.classList[hidden ? 'add' : 'remove']('invisible');
            content.current.addEventListener('mousemove', onDrag);
            content.current.addEventListener('mousedown', startDragging, false);
            content.current.addEventListener('mouseup', stopDragging, false);
            content.current.addEventListener('mouseleave', stopDragging, false);
        }
        return () => {
            if (content.current) {
                content.current.removeEventListener('mousemove', onDrag);
                content.current.removeEventListener('mousedown', startDragging, false);
                content.current.removeEventListener('mouseup', stopDragging, false);
                content.current.removeEventListener('mouseleave', stopDragging, false);
            }
        };
    }, [content.current, width]);

    const onScroll = (pos) => {
        content.current.style.scrollBehavior = 'smooth';
        if (pos === 'left') {
            content.current.scrollLeft = 0;
            btnLeft.current.classList.add('invisible');
            btnRight.current.classList.remove('invisible');
        } else {
            content.current.scrollLeft = content.current.offsetWidth;
            btnLeft.current.classList.remove('invisible');
            btnRight.current.classList.add('invisible');
        }
    };

    return (
        <div ref={content} className="flex items-center w-full h-full space-x-6 relative overflow-auto no-scrollbar pr-4 ">
            <div
                ref={btnLeft}
                onClick={() => onScroll('left')}
                className="bg-gray-13 dark:bg-darkBlue-3 min-w-[24px] h-full flex items-center justify-center cursor-pointer sticky left-0 z-10 invisible"
            >
                <ChevronLeft size={20} />
            </div>
            <div className="flex flex-col min-w-max space-y-1 !-ml-4">
                <div className="block text-txtSecondary dark:text-txtSecondary-dark text-xs text-left ">{t('24h_change')}</div>
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
                    {t('volume')} 24h ({symbolTicker?.q})
                </div>
                <div className="block text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold">{formatPrice(symbolTicker?.vq, 2)}</div>
            </div>
            <div
                ref={btnRight}
                onClick={() => onScroll('right')}
                className="bg-gray-13 dark:bg-darkBlue-3 w-6 h-full flex items-center justify-center cursor-pointer fixed right-0"
            >
                <ChevronLeft size={20} className="rotate-180" />
            </div>
        </div>
    );
};

export default SymbolDetail;
