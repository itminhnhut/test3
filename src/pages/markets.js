import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsync, useInterval } from 'react-use';
import Slider from 'react-slick';
import compact from 'lodash/compact';
import orderBy from 'lodash/orderBy';
import { useSelector } from 'react-redux';
import LayoutWithHeader from 'src/components/common/layouts/layoutWithHeader';
import SliderItem from 'src/components/markets/SliderItem';
import { getMarketWatch, getUserSymbolList, setUserSymbolList } from 'actions/market';
import { defaultSlider } from 'src/config/sliders';
import SpotMarket from 'src/components/markets/tabs/SpotMarket';
import Category from 'src/components/markets/tabs/Category';
import WatchList from 'src/components/markets/tabs/WatchList';
import { getExchange24hPercentageChange } from 'src/redux/actions/utils';
import { Dialog, Transition } from '@headlessui/react';
import { DOWNLOAD_APP_LINK } from 'src/redux/actions/const';
import { BrowserView, MobileView } from 'react-device-detect';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { formatBalance, formatPercentage, formatWalletWithoutDecimal } from 'redux/actions/utils';
import FetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import { IconSearch } from 'components/common/Icons';

const Markets = () => {
    const [activeTab, setActiveTab] = useState('spot_markets');
    // const tabs = ['spot_markets', 'futures_markets', 'watch_markets'];

    const user = useSelector(state => state.auth.user) || null;
    const tabs = [
        'spot_markets',
        'category',
        'watch_list',
    ];
    const { t } = useTranslation(['markets', 'common']);
    const [symbolList, setSymbolList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString] = useState('');
    const [quoteAsset, setQuoteAsset] = useState('VNDC');
    const [favorite, setFavorite] = useState([]);
    const [favoriteId, setFavoriteId] = useState('');
    const [watchList, setWatchList] = useState([]);
    const cancelButtonRegisterRef = useRef();
    const [portfolio, setPortfolio] = useState(null);
    const [assetValue, setAssetValue] = useState(null);

    const currentQuoteAsset = useSelector(state => state.user.quoteAsset) || 'VNDC';
    const [multiValue, setMultiValue] = useState(quoteAsset === 'VNDC' ? 24000 : 1);

    useEffect(() => {
        if (assetValue) {
            if (assetValue?.[617] > 0) setMultiValue(quoteAsset === 'VNDC' ? (1 / assetValue?.[617]) : (assetValue?.[20]));
        }
    }, [assetValue, quoteAsset]);

    const getAssetValue = async () => {
        const { data, status } = await FetchApi({
            url: '/api/v1/asset/value',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setAssetValue(data);
        }
    };

    // const getPortfolio = async () => {
    //     const { data, status } = await FetchApi({
    //         url: '/api/v1/asset/portfolio',
    //         options: {
    //             method: 'GET',
    //         },
    //     });
    //     if (status === ApiStatus.SUCCESS) {
    //         setPortfolio(data);
    //     }
    // };

    useEffect(() => {
        if (currentQuoteAsset) {
            setQuoteAsset(currentQuoteAsset);
        }
    }, [currentQuoteAsset]);

    useAsync(async () => {
        await getAssetValue();
    }, []);

    const handleSetFavorite = async (symbol) => {
        let newFavoriteList = [];

        if (favorite && favorite.length > 0) {
            const isFavorite = favorite.includes(symbol);
            if (!isFavorite) {
                newFavoriteList = [...favorite, symbol];
            } else {
                newFavoriteList = favorite.filter(item => item !== symbol);
            }
        } else {
            newFavoriteList.push(symbol);
        }

        setFavorite(newFavoriteList);
        return setUserSymbolList(favoriteId, newFavoriteList);
    };
    const getData = async () => {
        setSymbolList(await getMarketWatch());
    };

    useAsync(async () => {
        setLoading(false);
        if (user) {
            const result = await getUserSymbolList();
            if (result && result.length > 0) {
                return setWatchList(result);
            }
        }
        return setActiveTab('spot_markets');
    }, [user]);

    useAsync(async () => {
        if (!watchList) return;
        setFavorite(watchList.filter(list => list.type === 'FAVORITE')[0]?.assets);
        setFavoriteId(watchList.filter(list => list.type === 'FAVORITE')[0]?.id);
    }, [watchList]);

    useAsync(async () => {
        // Get symbol list
        await getData();
    }, []);

    useInterval(async () => {
        await setSymbolList(await getMarketWatch());
        getAssetValue();
    }, 10000);

    let filterSymbols = [];
    let sliderList = [];
    if (symbolList && symbolList.length > 0) {
        symbolList.forEach(symbol => {
            const {
                'q': qa,
                'b': ba,
            } = symbol;
            if (!(qa && ba)) return null;
            if (typeof searchString === 'string' && searchString.length) {
                // if (qa.indexOf(searchString.toUpperCase()) >= 0 || ba.indexOf(searchString.toUpperCase()) >= 0) {
                if (ba.indexOf(searchString.toUpperCase()) >= 0 && quoteAsset === qa) {
                    filterSymbols.push(symbol);
                }
            } else {
                if (quoteAsset === qa) {
                    filterSymbols.push(symbol);
                }
            }
            return null;
        });
        sliderList = orderBy(symbolList.filter(e => e.q === currentQuoteAsset), [e => Math.abs(getExchange24hPercentageChange(e))], ['desc']);
    }
    filterSymbols = compact(filterSymbols);

    const renderPriceData = (price) => {
        if (price) {
            if (quoteAsset === 'VNDC' && (+price) > 10) {
                return formatWalletWithoutDecimal(price);
            }
            return (
                <span className="text-right">
                    {formatBalance(price, 20)}
                </span>
            );
        }
        return '-';
    };

    const renderPercentageChange = (price, priceToCompare) => {
        let change;
        let text;
        let className = '';
        if (price && priceToCompare) {
            change = ((price - priceToCompare) / priceToCompare) * 100;
        } else {
            change = null;
        }
        if (change != null) {
            let sign;
            if (change > 0) {
                sign = '+';
                className += ' text-green';
            } else if (change < 0) {
                sign = '';
                className += ' text-red';
            } else sign = '';

            text = `${sign}${formatPercentage(change, 2, true)}%`;
        } else {
            text = '-';
        }
        return <span className={`${className}`}>{text}</span>;
    };

    const renderTabs = () => {
        switch (activeTab) { //  ['spot_markets', 'futures_markets', 'watch_list', 'category'];
            case 'spot_markets': {
                return <SpotMarket
                    loading={loading}
                    setLoading={setLoading}
                    setQuoteAsset={setQuoteAsset}
                    handleSetFavorite={handleSetFavorite}
                    favorite={favorite}
                    quoteAsset={quoteAsset}
                    filterSymbols={filterSymbols}
                    renderPriceData={renderPriceData}
                    renderPercentageChange={renderPercentageChange}
                    multiValue={multiValue}
                />;
            }
            case 'futures_markets': {
                return null;
            }
            case 'watch_list': {
                return <WatchList
                    favoriteList={favorite}
                    symbolList={symbolList}
                    handleSetFavorite={handleSetFavorite}
                    quoteAsset={quoteAsset}
                    renderPriceData={renderPriceData}
                    renderPercentageChange={renderPercentageChange}
                    multiValue={multiValue}
                    searchString={searchString}
                />;
            }
            case 'category': {
                return <Category
                    symbolList={symbolList}
                    quoteAsset={quoteAsset}
                    renderPriceData={renderPriceData}
                    renderPercentageChange={renderPercentageChange}
                    multiValue={multiValue}
                />;
            }
            default:
                return <SpotMarket
                    loading={loading}
                    setLoading={setLoading}
                    handleSetFavorite={handleSetFavorite}
                    favorite={favorite}
                    quoteAsset={quoteAsset}
                    filterSymbols={filterSymbols}
                    renderPriceData={renderPriceData}
                    multiValue={multiValue}
                />;
        }
    };

    const _renderInputSearch = () => {
        return (
            <div className="form-group max-w-[240px] !mb-0">
                <div className="input-group">
                    <input
                        className="form-control form-control-sm !px-3"
                        type="text"
                        onChange={(e) => setSearchString(e.target.value)}
                    />

                    <div
                        className="input-group-append !pl-0 !pr-3 flex-shrink-0 w-[40px] flex justify-end items-center"
                    >
                        <span className="input-group-text text-black-500">
                            <IconSearch />
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <LayoutWithHeader>
            <MobileView>
                <Transition show as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={cancelButtonRegisterRef}
                        static
                        open
                        onClose={() => {}}
                    >
                        <div className="md:min-h-screen min-h-[calc(100%-10rem)] px-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black-800 bg-opacity-70" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div
                                    className="inline-block w-full max-w-400 mb-8 overflow-hidden text-left align-middle transition-all transform  shadow-xl "
                                >
                                    <Dialog.Title className="">
                                        <div className="flex justify-between items-center">
                                            <div
                                                className="text-xl font-medium leading-8 text-black-800"
                                            />
                                        </div>
                                    </Dialog.Title>
                                    <div className="text-sm rounded-2xl bg-white">
                                        <div className="bg-black-5 rounded-t-2xl py-4">
                                            <img src="/images/bg/dialog-register-header.svg" alt="" className="mx-auto" />
                                        </div>
                                        <div className="px-6 py-8 text-center !font-bold">
                                            <div className="text-xl">{t('landing:download_app_hint')}</div>
                                            <div className="text-xl text-violet mb-[30px]">Nami Exchange</div>
                                            <div className="">
                                                <a
                                                    href={DOWNLOAD_APP_LINK.IOS}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button
                                                        className="btn btn-black w-full mb-2"
                                                        type="button"
                                                        rel="noreferrer"
                                                    >
                                                        {t('landing:download_app_hint_appstore')}
                                                    </button>
                                                </a>
                                                <a
                                                    href={DOWNLOAD_APP_LINK.ANDROID}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button
                                                        className="btn btn-primary w-full"
                                                        type="button"
                                                    >
                                                        {t('landing:download_app_hint_googleplay')}
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </MobileView>
            <BrowserView>
                <div className="my-0 w-full px-10 lg:px-0">
                    <Slider {...defaultSlider}>
                        {sliderList.slice(0, 20).map((item, index) => (<SliderItem data={item} key={index} />))}
                    </Slider>
                </div>
                <div className="flex flex-1 justify-center mx-10">
                    <div className="card px-0 bg-white w-full rounded-3xl mb-12">
                        <div className="card-header market-body-padding-x !pb-0 h-[6rem]">
                            <ul className="tabs !border-b-0 h-full !flex-nowrap">
                                {tabs.map((tab, index) => (
                                    <li className="tab-item" key={index}>
                                        <a
                                            className={`!mr-10 !py-3 h-full tab-link font-semibold ${activeTab === tab ? 'active text-black-700' : 'text-black-400'}`}
                                            onClick={() => setActiveTab(tab)}
                                        > {t(tab)}
                                        </a>
                                    </li>
                                ))}
                                <div className="flex-grow" />
                            </ul>
                            <div className="flex items-center justify-between">
                                {activeTab !== tabs[1] && _renderInputSearch()}
                                <div className="btn-group h-[38px] ml-2" role="group" aria-label=" button group">
                                    <button
                                        type="button"
                                        className={`h-full m-[1px] rounded ${quoteAsset === 'VNDC' ? 'bg-black text-black-5' : 'text-black-500'} !px-6 !text-xs`}
                                        onClick={() => setQuoteAsset('VNDC')}
                                    >VNDC
                                    </button>
                                    <button
                                        type="button"
                                        className={`h-full m-[1px] rounded ${quoteAsset === 'USDT' ? 'bg-black text-white' : 'text-black-500'} !px-6 !text-xs `}
                                        onClick={() => setQuoteAsset('USDT')}
                                    >USDT
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body market-body-padding-x">
                            <div className="tab-content">
                                {renderTabs()}
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserView>
        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['navbar', 'wallet', 'markets', 'common', 'landing']),
    },
});

export default Markets;
