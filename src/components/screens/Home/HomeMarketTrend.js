import AssetLogo from 'components/wallet/AssetLogo';
import colors from 'styles/colors';

import { useCallback, useRef, useState, memo } from 'react';
import { useWindowSize } from 'utils/customHooks';
import { formatPrice, render24hChange, scrollHorizontal } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { initMarketWatchItem, sparkLineBuilder } from 'src/utils';
import { ArrowRightIcon, CheckCircleIcon } from 'components/svg/SvgIcon';
import { HotIcon } from 'components/screens/MarketV2/MarketTable';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Image from 'next/image';
import Link from 'next/link';

import classNames from 'classnames';
import SvgIcon from 'components/svg';
import { useClickAway } from 'react-use';
import Skeletor from 'components/common/Skeletor';

const types = [
    {
        id: 'MOST_TRADED',
        content: ({ t }) => (
            <div className="flex space-x-2">
                <HotIcon />
                <div>{t('home:markettrend.most_traded')}</div>
            </div>
        )
    },
    {
        id: 'NEW_LISTING',
        content: ({ t }) => t('home:markettrend.new_listing')
    },
    {
        id: 'TOP_GAINER',
        content: ({ t }) => t('home:markettrend.top_gainer')
    },
    {
        id: 'TOP_LOSER',
        content: ({ t }) => t('home:markettrend.top_loser')
    }
];

const TrendTab = ({ width, type, setType, setState, types, t, setCurrency, marketCurrency }) => {
    return (
        <div className="w-full flex justify-between">
            <TokenTypes
                type={type?.id}
                setType={(i) => {
                    setType(i);
                }}
                types={types}
                lang={'vi'}
                setState={setState}
                t={t}
                setCurrency={setCurrency}
                marketCurrency={marketCurrency}
            />
            {width >= 992 && (
                <span className="flex flex-row items-center text-base font-semibold">
                    <Link href="/market" passHref>
                        <ButtonV2 variants="text" className="capitalize">
                            <span className="mr-3">{t('home:markettrend.explore_market')}</span>
                            <div className="!ml-0">
                                <ArrowRightIcon size={16} />
                            </div>
                        </ButtonV2>
                    </Link>
                </span>
            )}
        </div>
    );
};

const SelectAsset = ({ setCurrency, marketCurrency }) => {
    const ref = useRef(null);
    const [toggleOpen, setToggleOpen] = useState(false);
    useClickAway(ref, () => {
        if (toggleOpen) {
            setToggleOpen(false);
        }
    });

    return (
        <div className="border-r border-divider dark:border-divider-dark pr-3 relative z-[11]">
            <div ref={ref} onClick={() => setToggleOpen((prev) => !prev)} className="flex rounded-md py-2 px-4 items-center bg-gray-13 dark:bg-dark-4">
                <div className="flex items-center text-sm space-x-2 text-txtSecondary dark:text-txtSecondary-dark">
                    <div className="">{marketCurrency}</div>
                    <SvgIcon name="chevron_down" size={16} className={classNames({ 'rotate-0': toggleOpen })} color="currentColor" />
                </div>

                <div
                    className={classNames(
                        'shadow-card_light absolute mt-2 w-full bg-white dark:bg-bgTabInactive-dark py-2 border border-divider dark:border-divider-dark top-full left-0 rounded-md',
                        {
                            hidden: !toggleOpen
                        }
                    )}
                >
                    {['VNDC', 'USDT', 'VNST'].map((currency) => (
                        <button
                            key={currency}
                            onClick={() => setCurrency(currency)}
                            className="py-3 w-full justify-between cursor-pointer items-center text-txtPrimary dark:text-txtPrimary-dark px-4 flex dark:hover:bg-hover-dark hover:bg-hover first:mb-3 disabled:cursor-default"
                        >
                            {currency}
                            {currency === marketCurrency && <CheckCircleIcon color="currentColor" size={16} />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TokenTypes = ({ type, setType, types, lang, width, setState, t, setCurrency, marketCurrency }) => {
    const isMobile = width < 992;
    const parentRef = useRef(null);
    return (
        <div className="flex items-center w-full">
            <SelectAsset setCurrency={setCurrency} marketCurrency={marketCurrency} />
            <div ref={parentRef} className=" flex space-x-3 h-9 font-normal text-sm  pl-3 overflow-x-auto w-full no-scrollbar">
                {types.map((e, index) => {
                    const Content = e?.content;
                    return (
                        <div
                            id={e.id}
                            key={e.id}
                            className={classNames(
                                'rounded-md py-2 px-4 text-sm text-gray-1 dark:text-gray-7 hover:text-gray-15 dark:hover:text-gray-4 hover:cursor-pointer dark:bg-dark-4 dark:hover:bg-dark-5 transition-all duration-75 bg-gray-13 hover:bg-gray-6 border border-transparent whitespace-nowrap ',
                                {
                                    '!bg-teal/10 hover:!bg-teal/30 !text-green-3 dark:!text-green-3 hover:!text-green-3 dark:hover:!text-green-3 font-semibold':
                                        e.id === type
                                }
                            )}
                            onClick={() => {
                                setType(e);
                                setState({ marketTabIndex: index });
                                const currentElement = document.getElementById(e.id);
                                scrollHorizontal(currentElement, parentRef.current);
                            }}
                        >
                            <Content t={t} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const HomeMarketTrend = ({ loadingTrendData, trendData, setCurrency, marketCurrency }) => {
    // * Initial State
    const [type, setType] = useState(types[0]);
    const [state, set] = useState({
        marketTabIndex: 0,
        trending: null,
        loadingTrend: false
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // * Use Hooks
    const { width } = useWindowSize();
    const { t } = useTranslation(['home', 'table']);

    // * Render Handler

    const renderMarketHeader = useCallback(() => {
        return (
            <div className="homepage-markettrend__market_table__row">
                <div className="homepage-markettrend__market_table__row__col1 !font-normal">{t('table:pair')}</div>
                <div className="homepage-markettrend__market_table__row__col2 !font-normal">{t('table:last_price')}</div>
                <div className="homepage-markettrend__market_table__row__col3 !font-normal">{t('table:change_24h')}</div>
                {width >= 576 && <div className="homepage-markettrend__market_table__row__col4 !font-normal">{t('table:mini_chart')}</div>}
            </div>
        );
    }, [width]);

    const renderMarketBody = useCallback(() => {
        // Loading State
        if (loadingTrendData) return [...Array(5).keys()].map((element) => <Skeletor key={element} width="100%" height={70} />);

        // Loading finish state
        const tabMap = ['topView', 'newListings', 'topGainers', 'topLosers'];
        const pairs = trendData ? trendData?.[tabMap[state.marketTabIndex]] : null;
        if (!pairs) return null;
        return pairs.map((pair, index) => {
            let sparkLineColor = colors.teal;
            const _24hChange = pair.change_24;

            if (_24hChange) {
                if (_24hChange > 0) sparkLineColor = colors.teal;
                if (_24hChange <= 0) sparkLineColor = colors.red2;
            }
            const sparkLine = sparkLineBuilder(pair?.s, sparkLineColor);
            if (width >= 992) {
                return (
                    <Link key={`markettrend_${pair?.s}__${state.marketTabIndex}`} href={`/futures/${pair?.s}`} passHref>
                        <a className="homepage-markettrend__market_table__row">
                            <div className="homepage-markettrend__market_table__row__col1">
                                <div className="homepage-markettrend__market_table__coin">
                                    <div className="homepage-markettrend__market_table__coin__icon">
                                        <AssetLogo useNextImg={true} size={width >= 350 ? 32 : 30} assetCode={pair?.b} />
                                    </div>
                                    <div className="homepage-markettrend__market_table__coin__pair">
                                        <span>{pair?.b}</span>
                                        <span>/{pair?.q}</span>
                                    </div>
                                    {pair.leverage && (
                                        <div className="ml-2 text-xs font-semibold bg-gray-11 dark:bg-dark-2 p-1 rounded-[3px] ">{pair.leverage?.max}x</div>
                                    )}
                                </div>
                            </div>
                            <div className="homepage-markettrend__market_table__row__col2">
                                <div className="homepage-markettrend__market_table__price">{formatPrice(pair?.p)}</div>
                            </div>
                            <div className="homepage-markettrend__market_table__row__col3">
                                <div className={`homepage-markettrend__market_table__percent ${pair?.u ? 'value-up' : 'value-down'}`}>
                                    {render24hChange(pair, false, '!text-base')}
                                </div>
                            </div>
                            <div className="homepage-markettrend__market_table__row__col4">
                                <div className="homepage-markettrend__market_table__chart">
                                    <Image width={100} height={37} src={sparkLine} alt="Nami Exchange" />
                                </div>
                            </div>
                        </a>
                    </Link>
                );
            } else {
                return (
                    <Link key={`markettrend_${pair?.s}__${state.marketTabIndex}`} href={`/futures/${pair?.s}`} passHref>
                        <a className="homepage-markettrend__market_table__row">
                            <div className="homepage-markettrend__market_table__row__col1">
                                <div className="homepage-markettrend__market_table__coin">
                                    <div className="homepage-markettrend__market_table__coin__icon">
                                        <AssetLogo useNextImg={true} size={width >= 350 ? 32 : 30} assetCode={pair?.b} />
                                    </div>
                                    <div className="homepage-markettrend__market_table__coin__pair">
                                        <span>{pair?.b}</span>
                                        <span>/{pair?.q}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="homepage-markettrend__market_table__row__col2 ">
                                <div className="homepage-markettrend__market_table__chart">
                                    <Image width={100} height={37} src={sparkLine} alt="Nami Exchange" />
                                </div>
                            </div>
                            <div className="homepage-markettrend__market_table__row__col3 flex flex-col items-end">
                                <div className={`homepage-markettrend__market_table__price text-sm`}>{formatPrice(pair?.p)}</div>
                                <div className={`homepage-markettrend__market_table__percent ${pair?.u ? 'value-up' : 'value-down'}`}>
                                    {render24hChange(pair, false, '!text-sm')}
                                </div>
                            </div>
                        </a>
                    </Link>
                );
            }
        });
    }, [width, trendData, state.marketTabIndex, loadingTrendData]);

    return (
        <section className="homepage-markettrend">
            <div className="homepage-markettrend__wrapper max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">
                <div className="homepage-markettrend__tab_and_title">
                    <div className="homepage-markettrend__title">{t('home:markettrend.title')}</div>
                    <div className="homepage-markettrend__tab">
                        <TrendTab
                            setCurrency={setCurrency}
                            marketCurrency={marketCurrency}
                            type={type}
                            width={width}
                            types={types}
                            setType={setType}
                            t={t}
                            setState={setState}
                        />
                    </div>
                </div>

                <div className="homepage-markettrend__market_table">
                    <div className="homepage-markettrend__market_table__wrapper">
                        {width >= 992 && <div className="homepage-markettrend__market_table__header">{renderMarketHeader()}</div>}
                        <div className="homepage-markettrend__market_table__content">{renderMarketBody()}</div>
                    </div>
                    {width < 992 && (
                        <span className="flex flex-row items-center justify-center text-sm font-semibold pt-6">
                            <Link href="/market" passHref>
                                <ButtonV2 variants="text" className="capitalize">
                                    <span className="mr-3">{t('home:markettrend.explore_market')}</span>
                                    <div className="!ml-0">
                                        <ArrowRightIcon size={16} />
                                    </div>
                                </ButtonV2>
                            </Link>
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
};

export default memo(HomeMarketTrend);
