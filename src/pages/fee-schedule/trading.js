import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { API_GET_FUTURE_FEE_CONFIGS, API_GET_VIP, API_SET_ASSET_AS_FEE } from 'redux/actions/apis';
import { BREAK_POINTS, FEE_STRUCTURES, FEE_TABLE, ROOT_TOKEN } from 'constants/constants';
import { ApiStatus, TRADING_MODE } from 'redux/actions/const';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { orderBy, range, throttle } from 'lodash';
import { PATHS } from 'constants/paths';

import Axios from 'axios';
import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout';
import useWindowSize from 'hooks/useWindowSize';
import Link from 'next/link';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import Skeletor from 'components/common/Skeletor';
import Empty from 'components/common/Empty';
import ExchangeFeeMobileList from 'components/screens/FeeSchedule/ExchangeFeeMobileList';
import FuturesFeeMobileList from 'components/screens/FeeSchedule/FuturesFeeMobileList';

import NamiCircle from 'components/svg/NamiCircle';
import SwitchV2 from 'components/common/V2/SwitchV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Crown from 'components/svg/Crown';
import classnames from 'classnames';
import useDarkMode from 'hooks/useDarkMode';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

const INITIAL_STATE = {
    tabIndex: 0,
    loading: false,
    vipLevel: null,
    futuresFeeConfig: null,
    loadingFuturesFeeConfigs: false,
    currentFuturesFeePage: 1,
    loadingVipLevel: false,
    assetFee: null,
    promoteFee: null,
    loadingAssetFee: false

    // ...
};

const TradingFee = () => {
    // Init state
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Rdx
    const namiWallets = useSelector((state) => state.wallet?.SPOT)?.['1'];
    const allAssetConfigs = useSelector((state) => state.utils?.assetConfig) || null;
    const { user: auth } = useSelector((state) => state.auth) || null;

    const assetConfig = useMemo(() => {
        return allAssetConfigs?.find((item) => item?.id === 1);
    }, [allAssetConfigs]);

    // Use hooks
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();

    const [currentTheme] = useDarkMode();

    const handleHideScrollBar = () => {
        const malLayout = document.querySelector('.mal-layouts');
        if (window.innerWidth < 650) {
            document.body.classList.add('overflow-hidden');
            malLayout.classList.add('!h-screen');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
            malLayout.classList.remove('!h-screen');
        };
    };
    useEffect(handleHideScrollBar, []);
    // Helper
    const getFuturesFeeConfigs = async () => {
        !state.futuresFeeConfig && setState({ loadingFuturesFeeConfigs: true });
        try {
            const { data } = await Axios.get(API_GET_FUTURE_FEE_CONFIGS);
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ futuresFeeConfig: data.data });
            }
        } catch (e) {
            console.log(`Can't get futures fee config `, e);
        } finally {
            setState({ loadingFuturesFeeConfigs: false });
        }
    };

    const getVip = async () => {
        setState({ loadingVipLevel: true });
        try {
            const { data } = await Axios.get(API_GET_VIP);
            if (data?.status === 'ok' && data?.data) {
                setState({ vipLevel: data?.data?.level });
            }
        } catch (error) {
            console.log(`Cant get user vip level: ${error}`);
        } finally {
            setState({ loadingVipLevel: false });
        }
    };

    const onUseAssetAsFee = throttle(async (action = 'get', currency = undefined, assetCode = 'NAMI') => {
        setState({ loadingAssetFee: true });

        try {
            if (action === 'get') {
                const { data } = await Axios.get(API_SET_ASSET_AS_FEE);
                if (data?.status === ApiStatus.SUCCESS && data?.data) {
                    setState({
                        assetFee: data.data,
                        promoteFee: {
                            exchange: data?.data?.promoteSpot,
                            futures: data?.data?.promoteFutures
                        }
                    });
                }
            }
            if (action === 'set' && currency !== undefined) {
                const { data } = await Axios.post(API_SET_ASSET_AS_FEE, { currency });
                if (data?.status === ApiStatus.SUCCESS && data?.data) {
                    setState({ assetFee: data.data });
                }
            }
        } catch (e) {
            console.log(`Can't ${action} ${assetCode} as asset fee `, e);
        } finally {
            setState({ loadingAssetFee: false });
        }
    }, 800);

    // Render Handler
    const renderNamiAvailable = useCallback(() => {
        if (!namiWallets)
            return (
                <span className="ml-1.5">
                    <Skeletor width={105} />
                </span>
            );

        const available = namiWallets?.value - namiWallets?.locked_value;
        return <span className="whitespace-nowrap ml-1.5">{available ? formatNumber(available, assetConfig?.assetDigit) : '0.0000'} NAMI</span>;
    }, [namiWallets, assetConfig]);

    const renderUseAssetAsFeeBtn = useCallback(() => {
        const nextAssetFee = state.assetFee?.feeCurrency === 1 ? 0 : 1;
        return (
            <SwitchV2
                disabled={state.loadingAssetFee}
                checked={!!state.assetFee?.feeCurrency}
                onChange={() => !state.loadingAssetFee && onUseAssetAsFee('set', nextAssetFee)}
            />
        );
    }, [state.assetFee, state.loadingAssetFee]);

    const renderFeeTab = useCallback(() => {
        return (
            <Tabs tab={state.tabIndex} className="space-x-6">
                {TRADING_FEE_TAB.map((tab) => (
                    <TabItem
                        key={`trading_fee_Tab__${tab.dataIndex}`}
                        value={tab.index}
                        className="!text-left !px-0"
                        onClick={() => setState({ tabIndex: tab.index })}
                    >
                        {tab.localized ? t(tab.localized, { action: 'Exchange' }) : tab.title}
                    </TabItem>
                ))}
            </Tabs>
        );
    }, [state.tabIndex, TRADING_FEE_TAB]);

    const renderFuturesTableFee = useCallback(() => {
        let tableStatus;

        const columns = [
            {
                key: 'symbol',
                dataIndex: 'symbol',
                title: t('common:pair'),
                width: 200,
                fixed: 'left',
                align: 'left'
            },
            {
                key: 'max_leverage',
                dataIndex: 'max_leverage',
                title: t('common:max_leverage'),
                width: 100,
                align: 'right'
            },
            {
                key: 'fee',
                dataIndex: 'fee',
                title: (
                    <span>
                        {' '}
                        {t('common:fee')}
                        <span className="ml-1">
                            ({t('common:open')}/{t('common:close')})
                        </span>
                    </span>
                ),
                width: 100,
                align: 'right'
            },
            {
                key: 'fee_promote',
                dataIndex: 'fee_promote',
                title: (
                    <span>
                        {' '}
                        {t('common:fee')} NAMI
                        <span className="ml-1">
                            ({t('common:open')}/{t('common:close')})
                        </span>
                    </span>
                ),
                width: 100,
                align: 'right'
            }
        ];

        const dataFilter = state.futuresFeeConfig?.filter((e) => {
            const quote = e?.name.substring(e?.name?.length - 4);
            if (state.tabIndex === 1) {
                return quote === 'USDT';
            } else {
                return quote === 'VNDC';
            }
        });

        // console.log('namidev-DEBUG: FILTERED => ', dataFilter)

        const data = dataHandler({
            tabIndex: state.tabIndex,
            data: orderBy(dataFilter || state.futuresFeeConfig, ['name'], ['asc']),
            loading: state.loadingFuturesFeeConfigs
        });

        if (!data?.length) {
            tableStatus = <Empty />;
        }

        return (
            <ReTable
                // sort
                // defaultSort={{ key: 'symbol', direction: 'asc' }}
                useRowHover
                data={data}
                columns={columns}
                rowKey={(item) => item?.key}
                tableStatus={tableStatus}
                scroll={{ x: true }}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '2rem' : '0.75rem',
                    tableStyle: { minWidth: '992px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width <= 992,
                    noDataStyle: {
                        minHeight: '280px'
                    },
                    backgroundColor: '#0c0e14 !important'
                }}
                paginationProps={{
                    current: state.currentFuturesFeePage,
                    pageSize: 10,
                    onChange: (currentFuturesFeePage) => {
                        window.document.getElementById('trading_fee').scrollIntoView({
                            behavior: 'smooth'
                        });
                        setState({ currentFuturesFeePage });
                    }
                }}
                isNamiV2
            />
        );
    }, [state.tabIndex, state.loadingFuturesFeeConfigs, state.currentFuturesFeePage, width]);

    const renderExchangeTableFee = useCallback(() => {
        const columns = [
            {
                key: 'level',
                dataIndex: 'level',
                title: t('common:fee_level'),
                width: 180,
                fixed: 'left',
                align: 'left'
            },
            // { key: 'vol_30d', dataIndex: 'vol_30d', title: t('common:vol_trade_in', { duration: '30d' }), width: 100, align: 'left' },
            // { key: 'andor', dataIndex: 'andor', title: t('fee-structure:andor'), width: 100, align: 'left' },
            {
                key: 'nami_holding',
                dataIndex: 'nami_holding',
                title: 'NAMI',
                width: 100,
                align: 'right'
            },
            {
                key: 'maker_taker',
                dataIndex: 'maker_taker',
                title: 'Maker/Taker',
                width: 100,
                align: 'right'
            },
            {
                key: 'maker_taker_deducted',
                dataIndex: 'maker_taker_deducted',
                title: (
                    <span>
                        Maker/Taker
                        <span className="ml-1 text-dominant">
                            (
                            {t('fee-structure:use_asset_deduction', {
                                value: '25%',
                                asset: 'NAMI'
                            })}
                            )
                        </span>
                    </span>
                ),
                width: 100,
                align: 'right'
            }
        ];
        const data = dataHandler({
            tabIndex: state.tabIndex,
            data: FEE_TABLE,
            loading: false,
            utils: { currentLevel: state.vipLevel || 0 }
        });

        return (
            <ReTable
                useRowHover
                data={data}
                columns={columns}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '2rem' : '0.75rem',
                    tableStyle: { minWidth: '768px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width < BREAK_POINTS.lg,
                    noDataStyle: {
                        minHeight: '280px'
                    },
                    backgroundColor: '#0c0e14 !important'
                }}
                isNamiV2
            />
        );
    }, [state.tabIndex, state.vipLevel, width]);

    const renderExchangeDeduction = useCallback(() => {
        if (!state.assetFee && state.loadingAssetFee) {
            return (
                <>
                    <Skeletor width={150} height={16} />
                </>
            );
        }

        const promote = state.promoteFee?.exchange;

        if (typeof promote !== 'number') {
            return null;
        }

        return (
            <div className="flex flex-wrap items-center">
                {language === LANGUAGE_TAG.VI ? (
                    <>
                        Dùng NAMI để được giảm phí <span className="ml-1 whitespace-nowrap text-teal">(chiết khấu {promote * 100}%)</span>
                    </>
                ) : (
                    <>
                        Using NAMI deduction <span className="ml-1 whitespace-nowrap text-teal">({promote * 100}% discount)</span>
                    </>
                )}
            </div>
        );
    }, [state.promoteFee?.exchange, state.loadingAssetFee, state.assetFee, language]);

    const renderFuturesDeduction = useCallback(() => {
        if (!state.assetFee && state.loadingAssetFee) {
            return (
                <>
                    <Skeletor width={150} height={16} />
                </>
            );
        }

        const promote = state.promoteFee?.futures;

        if (typeof promote !== 'number') {
            return null;
        }

        return (
            <div className="flex flex-wrap items-center">
                {language === LANGUAGE_TAG.VI ? (
                    <>
                        Dùng NAMI để được giảm phí <span className="ml-1 text-teal whitespace-nowrap">(chiết khấu {promote * 100}%)</span>
                    </>
                ) : (
                    <>
                        Using NAMI deduction <span className="ml-1 text-teal whitespace-nowrap">({promote * 100}% discount)</span>
                    </>
                )}
            </div>
        );
    }, [state.promoteFee?.futures, state.loadingAssetFee, state.assetFee, language]);

    const renderUsedNamiMsg = useCallback(() => {
        // if (state.assetFee?.feeCurrency !== 1) return null;
        return <div className="mt-6 text-teal">(*) {t('fee-structure:used_fee_deduction', { token: `${ROOT_TOKEN} tokens` })}</div>;
    }, [state.assetFee?.feeCurrency]);

    const renderUserFeeConfig = useCallback(
        (maker, taker) => {
            return state.assetFee?.feeCurrency === 1 ? (
                <>
                    <span className="mr-2 font-semibold text-txtPrimary dark:text-txtPrimary-dark">{maker}%</span>
                    <span>{taker}%</span>
                </>
            ) : (
                <>
                    <span>{maker}%</span>
                    <span className="ml-2 font-semibold text-txtPrimary dark:text-txtPrimary-dark">{taker}%</span>
                </>
            );
        },
        [state.assetFee?.feeCurrency]
    );

    useEffect(() => {
        getVip();
        onUseAssetAsFee('get');
    }, []);

    useEffect(() => {
        state.tabIndex !== 0 && getFuturesFeeConfigs();
    }, [state.tabIndex]);

    // useEffect(() => console.log('namidev-DEBUG: FEE STATE ', state), [state])

    const buyNami = namiWallets && (
        <Link
            href={PATHS.EXCHANGE.SWAP.getSwapPair({
                fromAsset: 'VNDC',
                toAsset: 'NAMI'
            })}
        >
            <a className="text-teal font-semibold whitespace-nowrap hover:!underline ml-4 mt-0">{t('common:buy')} NAMI</a>
        </Link>
    );

    const userVipLevel = () =>
        !auth ? (
            <></>
        ) : (
            <>
                <div
                    className="md:hidden relative pt-[1.75rem] pb-[3.75rem] rounded-xl text-center text-sm"
                    style={{
                        backgroundImage: `url(${getS3Url(`/images/screen/account/bg_transfer_onchain_${currentTheme}.png`)})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                >
                    <span className="text-xl font-semibold">
                        {t('fee-structure:your_fee_level')} <span className="text-teal">VIP {state.vipLevel || 0}</span>
                    </span>

                    <div className="whitespace-nowrap mt-3">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:available_balance')}: </span>
                        <span className="font-semibold">{renderNamiAvailable()}</span>
                        {buyNami}
                    </div>

                    <Link href={language === LANGUAGE_TAG.VI ? PATHS.REFERENCE.HOW_TO_UPGRADE_VIP : PATHS.REFERENCE.HOW_TO_UPGRADE_VIP_EN}>
                        <ButtonV2 className="absolute bottom-0 inset-x-6 translate-y-[40%] !px-6 !w-auto">
                            <span className="mr-2">{t('fee-structure:vip_upgrade')}</span>
                            <Crown />
                        </ButtonV2>
                    </Link>
                </div>
                <div className="hidden md:flex flex-wrap items-center justify-between mt-20">
                    <div>
                        <div className="text-[2rem] leading-8 font-semibold">
                            <span>{t('fee-structure:your_fee_level')}</span>
                            <span className="ml-2 text-teal">VIP {state.vipLevel || 0}</span>
                        </div>

                        <div className="flex flex-wrap items-center mt-3">
                            <span className="flex items-center">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap">{t('common:available_balance')}: </span>
                                <span className="font-semibold">{renderNamiAvailable()}</span>
                            </span>
                            {buyNami}
                        </div>
                    </div>
                    <Link href={language === LANGUAGE_TAG.VI ? PATHS.REFERENCE.HOW_TO_UPGRADE_VIP : PATHS.REFERENCE.HOW_TO_UPGRADE_VIP_EN}>
                        <ButtonV2 className="!px-6 !w-auto">
                            <span className="mr-2">{t('fee-structure:vip_upgrade')}</span>
                            <Crown />
                        </ButtonV2>
                    </Link>
                </div>

                <div className="relative mt-12 p-6 nami-light-shadow bg-white dark:bg-darkBlue-3 rounded-xl">
                    <div
                        className={classnames(
                            'relative z-10 w-full grid md:grid-cols-3 md:grid-rows-1 grid-rows-3 gap-10',
                            'divide-y md:divide-y-0 md:divide-x divide-divider dark:divide-divider-dark'
                        )}
                    >
                        <div className="space-y-4">
                            <div className="font-semibold">
                                <div>{t('fee-structure:exchange_trading_fee')}</div>
                            </div>

                            <div className="flex">
                                <div className="flex-none">{renderUseAssetAsFeeBtn()}</div>
                                <span className="ml-3 text-txtSecondary dark:text-txtSecondary-dark">{renderExchangeDeduction()}</span>
                            </div>

                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                <div className="flex justify-between sm:block">
                                    <span className="inline-block min-w-[35px] mr-9">Maker</span>
                                    <span className="float-right">
                                        {state.vipLevel
                                            ? renderUserFeeConfig(
                                                  FEE_TABLE[state.vipLevel].maker_taker_deducted.split(' ')[0].replace('%', ''),
                                                  FEE_TABLE[state.vipLevel].maker_taker.split(' ')[0].replace('%', '')
                                              )
                                            : renderUserFeeConfig(
                                                  FEE_TABLE[0].maker_taker_deducted.split(' ')[0].replace('%', ''),
                                                  FEE_TABLE[0].maker_taker.split(' ')[0].replace('%', '')
                                              )}
                                    </span>
                                </div>
                            </div>
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                <div className="flex justify-between sm:block">
                                    <span className="inline-block min-w-[35px] mr-9">Taker</span>
                                    <span className="float-right">
                                        {state.vipLevel
                                            ? renderUserFeeConfig(
                                                  FEE_TABLE[state.vipLevel].maker_taker_deducted.split(' ')[2].replace('%', ''),
                                                  FEE_TABLE[state.vipLevel].maker_taker.split(' ')[2].replace('%', '')
                                              )
                                            : renderUserFeeConfig(
                                                  FEE_TABLE[0].maker_taker_deducted.split(' ')[2].replace('%', ''),
                                                  FEE_TABLE[0].maker_taker.split(' ')[2].replace('%', '')
                                              )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-10 md:pt-0 md:pl-10">
                            <div className="font-semibold">
                                <div>{language === LANGUAGE_TAG.VI && 'Phí '}USDT Futures</div>
                            </div>

                            <div className="flex">
                                <div className="flex-none">{renderUseAssetAsFeeBtn()}</div>
                                <span className="ml-3 text-txtSecondary dark:text-txtSecondary-dark">{renderFuturesDeduction()}</span>
                            </div>

                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                <div className="flex justify-between sm:block">
                                    <span className="inline-block min-w-[35px] mr-9">Maker</span>
                                    <span className="float-right">
                                        {renderUserFeeConfig(
                                            FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.MAKER[0],
                                            FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.MAKER[1]
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                <div className="flex justify-between sm:block">
                                    <span className="inline-block min-w-[35px] mr-9">Taker</span>
                                    <span className="float-right">
                                        {renderUserFeeConfig(
                                            FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.TAKER[0],
                                            FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.TAKER[1]
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-10 md:pt-0 md:pl-10">
                            <div className="font-semibold">
                                <div>{language === LANGUAGE_TAG.VI && 'Phí '}VNDC Futures</div>
                            </div>

                            <div className="flex">
                                <div className="flex-none">{renderUseAssetAsFeeBtn()}</div>
                                <span className="ml-3 text-txtSecondary dark:text-txtSecondary-dark">{renderFuturesDeduction()}</span>
                            </div>

                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                <div className="flex justify-between sm:block">
                                    <span className="inline-block min-w-[35px] mr-9">Maker</span>
                                    <span className="float-right">
                                        {renderUserFeeConfig(
                                            FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.MAKER[0],
                                            FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.MAKER[1]
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                <div className="flex justify-between sm:block">
                                    <span className="inline-block min-w-[35px] mr-9">Taker</span>
                                    <span className="float-right">
                                        {renderUserFeeConfig(
                                            FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.TAKER[0],
                                            FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.TAKER[1]
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {renderUsedNamiMsg()}
                </div>
            </>
        );

    return (
        <>
            {userVipLevel()}
            <div className="mt-20 mb-8 text-2xl font-semibold">{t('fee-structure:fee_rate')}</div>

            <div id="trading_fee" className="hidden md:block">
                <div className="flex items-center border border-b-0 border-divider dark:border-divider-dark rounded-t-xl px-8 pt-8">{renderFeeTab()}</div>
                <div className="border border-divider dark:border-divider-dark rounded-b-xl pb-8">
                    {state.tabIndex === 0 && renderExchangeTableFee()}
                    {state.tabIndex !== 0 && renderFuturesTableFee()}
                </div>
            </div>

            <div className="md:hidden">
                <div className="flex gap-x-2 py-2 overflow-x-auto sticky top-0 bg-white dark:bg-dark-dark no-scrollbar">
                    {TRADING_FEE_TAB.map((tab) => {
                        return (
                            <div
                                key={tab.index}
                                onClick={() => setState({ tabIndex: tab.index })}
                                className={classnames(
                                    'px-4 py-2 text-sm border rounded-full font-semibold whitespace-nowrap cursor-pointer',
                                    'transition duration-100',
                                    {
                                        'border-teal bg-teal/[.1] text-teal': state.tabIndex === tab.index,
                                        'border-divider dark:border-divider-dark text-txtSecondary dark:text-txtSecondary-dark': state.tabIndex !== tab.index
                                    }
                                )}
                            >
                                {tab.title}
                            </div>
                        );
                    })}
                </div>
                {state.tabIndex === 0 && <ExchangeFeeMobileList t={t} />}
                {[1, 2].includes(state.tabIndex) && (
                    <FuturesFeeMobileList
                        t={t}
                        currentQuote={
                            {
                                1: 'VNDC',
                                2: 'USDT'
                            }[state.tabIndex]
                        }
                        loading={state.loadingFuturesFeeConfigs}
                        data={state.futuresFeeConfig}
                    />
                )}
            </div>

            <div className="mt-12 md:mt-8 space-y-2 nami-list-disc">
                <div>
                    {t('fee-structure:maker_taker_description')}
                    <span className="ml-2">{t('fee-structure:maker_taker_description_2')}</span>
                    <Link href={PATHS.REFERENCE.MAKER_TAKER}>
                        <a className="ml-3 text-teal font-semibold hover:!underline" target="_blank">
                            {t('common:read_more')}
                        </a>
                    </Link>
                </div>
                <div>
                    {t('fee-structure:referral_description_value', { value: '20%' })}
                    <Link href={PATHS.ACCOUNT.REFERRAL}>
                        <a className="ml-3 text-teal font-semibold hover:!underline">{t('common:read_more')}</a>
                    </Link>
                </div>
                <div>{t('fee-structure:swap_fee_description')}</div>
            </div>
        </>
    );
};

const TRADING_FEE_TAB = [
    {
        index: 0,
        dataIndex: 'exchange',
        title: 'Exchange',
        localized: 'fee-structure:exchange_trading'
    },
    {
        index: 1,
        dataIndex: 'usdt_futures',
        title: 'USDT Futures'
    },
    {
        index: 2,
        dataIndex: 'vndc_futures',
        title: 'VNDC Futures'
    }
];

const dataHandler = (props) => {
    const { tabIndex, data, loading, utils } = props;

    const result = [];
    const skeleton = [];
    let rowLoading;

    if (tabIndex === 0) {
        rowLoading = TRADING_FEE_ROW_LOADING;
    } else {
        rowLoading = FUTURES_FEE_ROW_LOADING;
    }

    if (loading) {
        for (let i = 0; i < 10; ++i) {
            skeleton.push({
                ...rowLoading,
                key: `row_skeleton_${i}`
            });
        }
        return skeleton;
    }

    if (!Array.isArray(data) || !data || !data.length) return [];

    switch (tabIndex) {
        case 0:
            data.forEach((d) => {
                result.push({
                    key: `trading_fee__item__${d.level}`,
                    level: (
                        <span className="inline-flex items-center font-bold">
                            VIP {d.level} {utils?.currentLevel === d.level && <NamiCircle className="ml-2" />}
                        </span>
                    ),
                    // vol_30d: <span className="text-sm">{d.vol_30d}</span>,
                    // andor: <span className="text-sm">{d.andor}</span>,
                    nami_holding: <span>≥ {formatNumber(d.nami_holding, 0)}</span>,
                    maker_taker: <span>{d.maker_taker}</span>,
                    maker_taker_deducted: <span>{d.maker_taker_deducted}</span>
                });
            });
            break;
        case 1:
        case 2:
            data.forEach((d) => {
                result.push({
                    key: `futures_fee__item__${d?.name}`,
                    symbol: (
                        <span>
                            <Link href={PATHS.FUTURES.TRADE.getPair(TRADING_MODE.FUTURES, { pair: d?.name })}>
                                <a className="font-bold hover:!underline">{d?.name}</a>
                            </Link>
                        </span>
                    ),
                    max_leverage: <span>x{d?.max_leverage}</span>,
                    fee: (
                        <span>
                            {d?.place_order_fee * 100}% / {d?.close_order_fee * 100}%
                        </span>
                    ),
                    fee_promote: (
                        <span>
                            {d?.place_order_fee_promote * 100}% / {d?.close_order_fee_promote * 100}%
                        </span>
                    ),
                    [RETABLE_SORTBY]: {
                        symbol: d?.name,
                        max_leverage: d?.max_leverage,
                        fee: d?.place_order_fee,
                        fee_promote: d?.place_order_fee_promote
                    }
                });
            });
            break;
        default:
    }

    return result;
};

const FUTURES_FEE_ROW_LOADING = {
    symbol: <Skeletor width={65} />,
    max_leverage: <Skeletor width={65} />,
    fee: <Skeletor width={65} />,
    fee_promote: <Skeletor width={65} />
};

const TRADING_FEE_ROW_LOADING = {
    level: <Skeletor width={65} />,
    vol_30d: <Skeletor width={65} />,
    andor: <Skeletor width={65} />,
    nami_holding: <Skeletor width={65} />,
    maker_taker: <Skeletor width={65} />,
    maker_taker_deducted: <Skeletor width={65} />
};

const GRAPHICS_WIDTH = '200px';

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'fee-structure']))
    }
});

export default withTabLayout({
    routes: TAB_ROUTES.FEE_STRUCTURE,
    containerClassname: 'px-4 md:pt-20  fee-schedule '
})(TradingFee);
