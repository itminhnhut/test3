import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { formatNumber, getLoginUrl, getS3Url } from 'redux/actions/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { API_GET_FUTURE_FEE_CONFIGS, API_GET_VIP, API_SET_ASSET_AS_FEE } from 'redux/actions/apis';
import { BREAK_POINTS, FEE_TABLE, ROOT_TOKEN } from 'constants/constants';
import { ApiStatus, TRADING_MODE } from 'redux/actions/const';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { orderBy, throttle } from 'lodash';
import { PATHS } from 'constants/paths';
import Axios from 'axios';
import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout';
import useWindowSize from 'hooks/useWindowSize';
import Link from 'next/link';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import Skeletor from 'components/common/Skeletor';
import Empty from 'components/common/Empty';
import ExchangeFeeMobileList from 'components/screens/FeeSchedule/ExchangeFeeMobileList';
import FuturesFeeMobileList, { FuturesFeeMobileListV2 } from 'components/screens/FeeSchedule/FuturesFeeMobileList';
import NamiCircle from 'components/svg/NamiCircle';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Crown from 'components/svg/Crown';
import classnames from 'classnames';
import useDarkMode from 'hooks/useDarkMode';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import { MoneyIcon } from 'components/svg/SvgIcon';
import { fees } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import AssetLogo from 'components/wallet/AssetLogo';
import FeeSettingModal from 'components/screens/FeeSchedule/FeeSettingModal';

const NAMI_NAO_TYPE = [
    {
        id: 0,
        name: 'VNDC_SUB_TAB',
        content: {
            vi: 'VNDC',
            en: 'VNDC'
        }
    },
    {
        id: 1,
        name: 'USDT_SUB_TAB',
        content: {
            vi: 'USDT',
            en: 'USDT'
        }
    }
];

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
    loadingAssetFee: false,
    subTabIndex: 0,
    isVisible: false,
    configTabIndex: 0,
    subConfigTabIndex: 0
};

const feesWithoutOnus = fees.filter((rs) => !(rs.assetId === 86));

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

    const renderFeeTabMb = useCallback(() => {
        return (
            <Tabs tab={state.tabIndex}>
                {TRADING_FEE_TAB.map((tab) => (
                    <TabItem
                        key={`trading_fee_Tab__${tab.dataIndex}`}
                        value={tab.index}
                        className="!text-left !px-0 !mr-6 !w-auto"
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
                dataIndex: 'assetCode',
                title: 'Coin/Token',
                align: 'left',
                render: (assetCode) => {
                    return (
                        <div className="flex items-center font-semibold text-sm sm:text-base py-4">
                            {width >= 768 && <AssetLogo assetCode={assetCode} size={width >= 1024 ? 32 : 28} />}
                            <div className={width >= 768 ? 'ml-3 whitespace-nowrap' : 'whitespace-nowrap' + ' truncate'}>
                                <span className="text-txtPrimary dark:text-txtPrimary-dark">{assetCode}</span>
                            </div>
                        </div>
                    );
                }
            },
            {
                key: 'fee',
                dataIndex: 'ratio',
                title: (
                    <span className="ml-1">
                        {' '}
                        {t('common:fee')}
                        <span className="ml-1">
                            ({t('common:open')}/{t('common:close')})
                        </span>
                    </span>
                ),
                align: 'right',
                render: (ratio) => <span>{`${ratio} / ${ratio}`}</span>
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

        const data = dataHandler({
            tabIndex: state.tabIndex,
            data: orderBy(dataFilter || state.futuresFeeConfig, ['name'], ['asc']),
            loading: state.loadingFuturesFeeConfigs
        });

        if (!data?.length) {
            tableStatus = <Empty />;
        }
        const dataForTable = getRenderFutureFeeData(state.tabIndex, state.subTabIndex);
        return (
            <ReTable
                useRowHover
                data={dataForTable}
                columns={columns}
                rowKey={(item) => item?.key}
                tableStatus={tableStatus}
                scroll={{ x: true }}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '2rem' : '0.75rem',
                    tableStyle: { minWidth: '768px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width <= BREAK_POINTS.lg,
                    noDataStyle: {
                        minHeight: '280px'
                    },
                    backgroundColor: '#0c0e14 !important'
                }}
                isNamiV2
            />
        );
    }, [state.tabIndex, state.loadingFuturesFeeConfigs, state.currentFuturesFeePage, width, state.subTabIndex]);

    const renderExchangeTableFee = useCallback(() => {
        const columns = [
            {
                key: 'level',
                dataIndex: 'level',
                title: t('common:fee_level'),
                width: 100,
                fixed: 'left',
                align: 'left'
            },
            {
                key: 'nami_holding',
                dataIndex: 'nami_holding',
                title: 'NAMI',
                width: 150,
                align: 'right'
            },
            {
                key: 'maker_taker',
                dataIndex: 'maker_taker',
                title: 'Maker/Taker',
                width: 150,
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
                width: 160,
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

    useEffect(() => {
        getVip();
    }, []);

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
            <>
                <div className="font-semibold leading-normal pt-2">
                    <span className="text-gray-4">{t('fee-structure:login_view_your_fee')}</span>
                    {typeof window !== 'undefined' && (
                        <Link href={getLoginUrl('sso', 'login')}>
                            <a className="cursor-pointer ml-3 w-[85px] text-txtTextBtn-dark">{t('fee-structure:login')}</a>
                        </Link>
                    )}
                </div>
            </>
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
                    <div className="absolute bottom-0 translate-y-[70%] px-6 h-[92px] w-full  flex flex-col gap-3">
                        {/* <Link href={language === LANGUAGE_TAG.VI ? PATHS.REFERENCE.HOW_TO_UPGRADE_VIP : PATHS.REFERENCE.HOW_TO_UPGRADE_VIP_EN}> */}
                        <ButtonV2 className="!w-auto" onClick={() => setState({ isVisible: true })}>
                            <MoneyIcon size={'16px'} />
                            <span className="!ml-2">{t('fee-structure:fee_setting')}</span>
                        </ButtonV2>
                        {/* </Link> */}
                        <Link href={language === LANGUAGE_TAG.VI ? PATHS.REFERENCE.HOW_TO_UPGRADE_VIP : PATHS.REFERENCE.HOW_TO_UPGRADE_VIP_EN}>
                            <ButtonV2 className="!w-auto !h-[36px] !bg-transparent">
                                <Crown fill={'#47cc85'} />
                                <span className="!ml-2 text-txtTextBtn-dark">{t('fee-structure:vip_upgrade')}</span>
                            </ButtonV2>
                        </Link>
                    </div>
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
                    <div className="flex items-center justify-between gap-3">
                        {/* sửa màu button */}
                        <Link href={language === LANGUAGE_TAG.VI ? PATHS.REFERENCE.HOW_TO_UPGRADE_VIP : PATHS.REFERENCE.HOW_TO_UPGRADE_VIP_EN}>
                            <ButtonV2 className="!px-6 !w-auto !bg-transparent">
                                <Crown fill={'#47cc85'} />
                                <span className="!ml-2 text-txtTextBtn-dark">{t('fee-structure:vip_upgrade')}</span>
                            </ButtonV2>
                        </Link>
                        {/* thêm button fee setting */}
                        <ButtonV2 className="!px-6 !w-auto" onClick={() => setState({ isVisible: true })}>
                            <MoneyIcon size={'16px'} />
                            <span className="!ml-2">{t('fee-structure:fee_setting')}</span>
                        </ButtonV2>
                    </div>
                </div>
            </>
        );

    return (
        <>
            {userVipLevel()}
            <div className="mt-20 mb-6 md:!mb-8 text-xl md:!text-2xl font-semibold">{t('fee-structure:fee_rate')}</div>

            <div id="trading_fee" className="hidden md:block">
                <div className="flex items-center border border-b-0 border-divider dark:border-divider-dark rounded-t-xl px-8 pt-4">{renderFeeTab()}</div>
                {state.tabIndex === 1 || state.tabIndex === 2 ? (
                    <div className="py-8 sm:py-6 flex items-center border border-b-0 border-divider dark:border-divider-dark px-8 sm:border-b-[1px] flex-wrap justify-between">
                        {state.tabIndex === 1 || state.tabIndex === 2 ? (
                            <TokenTypes
                                type={state.subTabIndex}
                                setType={(index) => {
                                    setState({ subTabIndex: index });
                                }}
                                types={[...NAMI_NAO_TYPE]}
                                lang={language}
                            />
                        ) : null}
                    </div>
                ) : null}
                <div className="border border-divider dark:border-divider-dark rounded-b-xl pb-8">
                    {state.tabIndex === 0 && renderExchangeTableFee()}
                    {state.tabIndex !== 0 && renderFuturesTableFee()}
                </div>
            </div>

            <div className="md:hidden">
                <div className="border-b-[1px] border-divider dark:border-divider-dark -mx-4 px-4">{renderFeeTabMb()}</div>
                {state.tabIndex === 1 || state.tabIndex === 2 ? (
                    <div className="pt-6 flex items-center justify-between">
                        {state.tabIndex === 1 || state.tabIndex === 2 ? (
                            <TokenTypes
                                type={state.subTabIndex}
                                setType={(index) => {
                                    setState({ subTabIndex: index });
                                }}
                                types={[...NAMI_NAO_TYPE]}
                                lang={language}
                            />
                        ) : null}
                    </div>
                ) : null}
                {state.tabIndex === 0 && <ExchangeFeeMobileList t={t} />}
                {[1, 2].includes(state.tabIndex) && (
                    <FuturesFeeMobileListV2
                        t={t}
                        currentQuote={
                            {
                                1: 'VNDC',
                                2: 'USDT'
                            }[state.tabIndex]
                        }
                        loading={state.loadingFuturesFeeConfigs}
                        data={getRenderFutureFeeData(state.tabIndex, state.subTabIndex)}
                    />
                )}
            </div>

            <div className="mt-12 md:mt-8 space-y-2 nami-list-disc">
                <div className="flex items-center">
                    {t('fee-structure:maker_taker_description')}
                    <span className="ml-2">{t('fee-structure:maker_taker_description_2')}</span>
                    <HrefButton variants="blank" className="!w-auto ml-3" href={PATHS.REFERENCE.MAKER_TAKER} target="_blank">
                        {t('common:read_more')}
                    </HrefButton>
                </div>
                <div className="flex items-center">
                    {t('fee-structure:referral_description_value', { value: '20%' })}
                    <HrefButton variants="blank" className="!w-auto ml-3" href={PATHS.ACCOUNT.REFERRAL} target="_blank">
                        {t('common:read_more')}
                    </HrefButton>
                </div>
            </div>
            <FeeSettingModal
                configFeeTab={TRADING_FEE_TAB}
                isVisible={state.isVisible}
                onBackdropCb={() => setState({ isVisible: false })}
                vipLevel={state.vipLevel || 0}
            />
        </>
    );
};

const TRADING_FEE_TAB = [
    {
        index: 0,
        dataIndex: 'SPOT',
        title: 'Spot'
    },
    {
        index: 1,
        dataIndex: 'NAMI',
        title: 'NAMI Futures'
    },
    {
        index: 2,
        dataIndex: 'NAO',
        title: 'NAO Futures'
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

const TokenTypes = ({ type, setType, types, lang, className }) => {
    return (
        <div className={classnames('flex items-center space-x-3 h-9 sm:h-12 font-normal text-sm overflow-auto no-scrollbar', className)}>
            {types.map((e) => (
                <div
                    key={e.id}
                    className={classnames(
                        ` ${
                            type !== e.id && 'text-txtTextBtn-tonal_dark'
                        } flex items-center h-full flex-auto justify-center px-4 text-sm sm:text-base rounded-[800px] border-[1px] cursor-pointer whitespace-nowrap`,
                        {
                            'border-teal bg-teal bg-opacity-10 text-teal font-semibold': e.id === type,
                            'border-divider dark:border-divider-dark': e.id !== type
                        }
                    )}
                    onClick={() => setType(e.id)}
                >
                    {e?.content[lang]}
                </div>
            ))}
        </div>
    );
};

const getRenderFutureFeeData = (tabIndex, subTabIndex) => {
    const codeOfAssetOrder = [];
    const dataForTable = [];
    if (feesWithoutOnus && feesWithoutOnus.length > 0) {
        if (tabIndex === 1 && subTabIndex === 0) {
            codeOfAssetOrder = [72, 1];
        } else if (tabIndex === 1 && subTabIndex === 1) {
            codeOfAssetOrder = [22, 1];
        } else if (tabIndex === 2 && subTabIndex === 0) {
            codeOfAssetOrder = [72, 447, 1];
        } else if (tabIndex === 2 && subTabIndex === 1) {
            codeOfAssetOrder = [22, 447, 1];
        }
        codeOfAssetOrder.forEach((assetCode) => {
            const foundFee = feesWithoutOnus.find((fee) => fee.assetId === assetCode);
            if (foundFee) {
                dataForTable.push(foundFee);
            }
        });
    }
    return dataForTable;
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

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'fee-structure']))
    }
});

export default withTabLayout({
    routes: TAB_ROUTES.FEE_STRUCTURE,
    containerClassname: 'px-4 md:pt-20 fee-schedule !pb-0 !-mb-4'
})(TradingFee);
