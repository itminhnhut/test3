import AssetLogo from 'src/components/wallet/AssetLogo';
import colors from 'styles/colors';

import { useCallback, useState } from 'react';
import { useWindowSize } from 'utils/customHooks';
import { useSelector } from 'react-redux';
import { formatPrice, getExchange24hPercentageChange, render24hChange } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { initMarketWatchItem, sparkLineBuilder } from 'src/utils';
import { ArrowRightIcon } from 'components/svg/SvgIcon';
import { HotIcon } from 'components/screens/MarketV2/MarketTable';

import classNames from 'classnames';

const types = [
    {
        id: 'MOST_TRADED',
        content: {
            vi: (
                <div className="flex space-x-2">
                    <HotIcon />
                    <div>Giao dịch nhiều</div>
                </div>
            ),
            en: (
                <div className="flex space-x-2">
                    <HotIcon />
                    <div>Most traded</div>
                </div>
            )
        }
    },
    {
        id: 'NEW_LISTING',
        content: {
            vi: 'Mới niêm yết',
            en: 'New Listing'
        }
    },
    {
        id: 'TOP_GAINER',
        content: {
            vi: 'Tăng giá',
            en: 'Top gainer'
        }
    },
    {
        id: 'TOP_LOSER',
        content: {
            vi: 'Giảm giá',
            en: 'Top loser'
        }
    }
];

const TrendTab = ({ width, type, setType, setState, types, t }) => {
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
            />
            {width >= 992 && (
                <span className="flex flex-row items-center text-base font-semibold">
                    <a href="/market" className="!text-teal mr-3">
                        {t('home:markettrend.explore_market')}
                    </a>
                    <ArrowRightIcon size={16} />
                </span>
            )}
        </div>
    );
};

const TokenTypes = ({ type, setType, types, lang, width, setState }) => {
    const isMobile = width < 992;
    return (
        <div
            className={
                isMobile
                    ? 'flex space-x-3 h-9 font-normal text-sm overflow-auto no-scrollbar haha'
                    : 'flex space-x-3 h-12 font-normal text-sm overflow-auto no-scrollbar haha'
            }
        >
            {types.map((e, index) => (
                <div
                    key={e.id}
                    className={
                        isMobile
                            ? classNames(
                                  'flex flex-col justify-center h-full px-4 text-sm rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                  {
                                      '!border-teal bg-teal bg-opacity-10 !text-teal font-semibold': e.id === type
                                  }
                              )
                            : classNames(
                                  'h-full px-4 py-3 text-base rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                  {
                                      '!border-teal bg-teal bg-opacity-10 !text-teal font-semibold': e.id === type
                                  }
                              )
                    }
                    onClick={() => {
                        setType(e);
                        setState({ marketTabIndex: index });
                    }}
                >
                    {e?.content[lang]}
                </div>
            ))}
        </div>
    );
};

const HomeMarketTrend = ({ trendData }) => {
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

    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);

    // * Render Handler
    const renderTrendTab = useCallback(() => {
        return (
            <div className="w-full flex justify-between">
                <TokenTypes
                    type={type?.id}
                    setType={(i) => {
                        setType(i);
                    }}
                    types={types}
                    lang={'vi'}
                />
                {width >= 992 && (
                    <span className="flex flex-row items-center text-base font-semibold">
                        <a href="/market" className="!text-teal mr-3">
                            {t('home:markettrend.explore_market')}
                        </a>
                        <ArrowRightIcon size={16} />
                    </span>
                )}
            </div>
        );
    }, [width, state, type]);

    const renderMarketHeader = useCallback(() => {
        return (
            <div className="homepage-markettrend__market_table__row">
                <div className="homepage-markettrend__market_table__row__col1">{t('table:pair')}</div>
                <div className="homepage-markettrend__market_table__row__col2">{t('table:last_price')}</div>
                <div className="homepage-markettrend__market_table__row__col3">{t('table:change_24h')}</div>
                {width >= 576 && <div className="homepage-markettrend__market_table__row__col4">{t('table:mini_chart')}</div>}
            </div>
        );
    }, [width]);

    const renderMarketBody = useCallback(() => {
        const tabMap = ['topView', 'newListings', 'topGainers', 'topLosers'];
        const pairs = trendData ? trendData?.[tabMap[state.marketTabIndex]] : null;
        if (!pairs) return null;
        return pairs.map((pair) => {
            let sparkLineColor = colors.teal;
            const _ = initMarketWatchItem(pair);
            const _24hChange = getExchange24hPercentageChange(pair);

            if (_24hChange) {
                if (_24hChange > 0) sparkLineColor = colors.teal;
                if (_24hChange <= 0) sparkLineColor = colors.red2;
            }
            const sparkLine = sparkLineBuilder(_?.symbol, sparkLineColor);

            if (width >= 992) {
                return (
                    <a
                        href={`/trade/${_?.baseAsset}-${_?.quoteAsset}`}
                        className="homepage-markettrend__market_table__row"
                        key={`markettrend_${_?.symbol}__${state.marketTabIndex}`}
                    >
                        <div className="homepage-markettrend__market_table__row__col1">
                            <div className="homepage-markettrend__market_table__coin">
                                <div className="homepage-markettrend__market_table__coin__icon">
                                    <AssetLogo size={width >= 350 ? 32 : 30} assetCode={_?.baseAsset} />
                                </div>
                                <div className="homepage-markettrend__market_table__coin__pair">
                                    <span>{_?.baseAsset}</span>
                                    <span>/{_?.quoteAsset}</span>
                                </div>
                            </div>
                        </div>
                        <div className="homepage-markettrend__market_table__row__col2">
                            <div className="homepage-markettrend__market_table__price">{formatPrice(_?.lastPrice)}</div>
                        </div>
                        <div className="homepage-markettrend__market_table__row__col3 flex flex-col items-end">
                            <div className={`homepage-markettrend__market_table__percent ${_?.up ? 'value-up' : 'value-down'}`}>
                                {render24hChange(pair, false, '!text-base')}
                            </div>
                        </div>
                        <div className="homepage-markettrend__market_table__row__col4">
                            <div className="homepage-markettrend__market_table__chart">
                                <img src={sparkLine} alt="Nami Exchange" />
                            </div>
                        </div>
                    </a>
                );
            } else {
                return (
                    <a
                        href={`/trade/${_?.baseAsset}-${_?.quoteAsset}`}
                        className="homepage-markettrend__market_table__row"
                        key={`markettrend_${_?.symbol}__${state.marketTabIndex}`}
                    >
                        <div className="homepage-markettrend__market_table__row__col1">
                            <div className="homepage-markettrend__market_table__coin">
                                <div className="homepage-markettrend__market_table__coin__icon">
                                    <AssetLogo size={width >= 350 ? 32 : 30} assetCode={_?.baseAsset} />
                                </div>
                                <div className="homepage-markettrend__market_table__coin__pair">
                                    <span>{_?.baseAsset}</span>
                                    <span>/{_?.quoteAsset}</span>
                                </div>
                            </div>
                        </div>
                        <div className="homepage-markettrend__market_table__row__col2 ">
                            <div className="homepage-markettrend__market_table__chart">
                                <img src={sparkLine} alt="Nami Exchange" />
                            </div>
                        </div>
                        <div className="homepage-markettrend__market_table__row__col3 flex flex-col items-end">
                            <div className={`homepage-markettrend__market_table__price text-sm`}>{formatPrice(_?.lastPrice)}</div>
                            <div className={`homepage-markettrend__market_table__percent ${_?.up ? 'value-up' : 'value-down'}`}>
                                {render24hChange(pair, false, '!text-sm')}
                            </div>
                        </div>
                    </a>
                );
            }
        });
    }, [width, trendData, state.marketTabIndex, exchangeConfig]);

    return (
        <section className="homepage-markettrend">
            <div className="homepage-markettrend__wrapper mal-container">
                <div className="homepage-markettrend__tab_and_title">
                    <div className="homepage-markettrend__title">{t('home:markettrend.title')}</div>
                    <div className="homepage-markettrend__tab">
                        <TrendTab type={type} width={width} types={types} setType={setType} t={t} setState={setState} />
                    </div>
                </div>

                <div className="homepage-markettrend__market_table">
                    <div className="homepage-markettrend__market_table__wrapper">
                        {width >= 992 && <div className="homepage-markettrend__market_table__header">{renderMarketHeader()}</div>}
                        <div className="homepage-markettrend__market_table__content">{renderMarketBody()}</div>
                    </div>
                    {width < 992 && (
                        <span className="flex flex-row items-center justify-center text-sm font-semibold pt-6">
                            <a href="/market" className="!text-teal mr-3">
                                {t('home:markettrend.explore_market')}
                            </a>
                            <ArrowRightIcon size={14} />
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HomeMarketTrend;
