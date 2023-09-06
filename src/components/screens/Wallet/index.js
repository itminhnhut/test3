import Axios from 'axios';
import NeedLoginV2 from 'components/common/NeedLoginV2';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';

import { MIN_WALLET } from 'constants/constants';
import { PATHS } from 'constants/paths';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import useWindowFocus from 'hooks/useWindowFocus';
import useWindowSize from 'hooks/useWindowSize';
import { find, orderBy, sumBy } from 'lodash';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { WALLET_SCREENS } from 'pages/wallet';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAsync, useLocalStorage } from 'react-use';
import { API_FARMING_SUMMARY, API_STAKING_SUMMARY } from 'redux/actions/apis';
import { ApiStatus, LOCAL_STORAGE_KEY, WalletType } from 'redux/actions/const';
import { getFuturesMarketWatch, getMarketWatch, getUsdRate } from 'redux/actions/market';
import styled from 'styled-components';
import colors from 'styles/colors';

// ** Dynamic
const NFTWallet = dynamic(() => import('./NFT'), { ssr: false });
const NAOFuturesWallet = dynamic(() => import('./NaoFutures'), { ssr: false });
const PartnersWallet = dynamic(() => import('./Partners'), { ssr: false });
const InsuranceWallet = dynamic(() => import('./Insurance'), { ssr: false });
const ExchangeWallet = dynamic(() => import('./Exchange'), { ssr: false });
const FuturesWallet = dynamic(() => import('./Futures'), { ssr: false });
const OverviewWallet = dynamic(() => import('./Overview'), { ssr: false });
const StakingWallet = dynamic(() => import('./Staking'), { ssr: false });

export const WIDTH_MD = 768;

const INITIAL_STATE = {
    screen: null,
    screenIndex: null,
    allAssets: null,
    loadingStaking: false,
    stakingConfig: null,
    loadingFarming: false,
    farmingConfig: null,
    loadingUsdRate: false,
    usdRate: null,

    loadingSummary: false,
    stakingEstBtc: null,
    stakingSummary: null,
    stakingRefPrice: null,
    farmingSummary: null,
    farmingEstBtc: null,
    farmingRefPrice: null,

    exchangeEstBtc: null,
    exchangeRefPrice: null,
    exchangeMarketWatch: null,

    allFuturesAsset: null,
    futuresEstBtc: null,
    futuresRefPrice: null,
    futuresMarketWatch: null,

    allNAOFuturesAsset: null,
    naoFuturesEstBtc: null,
    naoFuturesRefPrice: null,
    naoFuturesMarketWatch: null,

    allInsuranceAsset: null,
    insuranceEstBtc: null,
    insuranceRefPrice: null,
    insuranceMarketWatch: null,

    allPartnersAsset: null,
    partnersEstBtc: null,
    partnersRefPrice: null,
    partnersMarketWatch: null
    // ... Add new state
};

const AVAILBLE_KEY = 'available';

const Wallet = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    // const [isHideAsset, _setIsHideAsset] = useState(false);

    const [isHideAsset, setIsHideAsset] = useLocalStorage(LOCAL_STORAGE_KEY.HIDE_BALANCE, false);

    // Rdx
    const auth = useSelector((state) => state.auth?.user) || null;
    const allWallet = useSelector((state) => state.wallet?.SPOT) || null;
    const allInsuranceWallet = useSelector((state) => state.wallet?.INSURANCE) || null;
    const allFuturesWallet = useSelector((state) => state.wallet?.FUTURES) || null;
    const allNAOFuturesWallet = useSelector((state) => state.wallet?.NAO_FUTURES) || null;
    const allPartnersWallet = useSelector((state) => state.wallet?.PARTNERS) || null;
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null;

    // Use Hooks
    const r = useRouter();
    const [currentTheme] = useDarkMode();
    const focused = useWindowFocus();
    const {
        t,
        i18n: { language }
    } = useTranslation(['common']);

    // Helper
    const walletMapper = (walletType, allWallet, assetConfig) => {
        if (!allWallet || !assetConfig) return;
        const mapper = [];
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const _wallet =
                walletType === WalletType.SPOT
                    ? assetConfig.filter((o) => o.walletTypes?.[walletType])
                    : assetConfig.filter((o) => ['VNDC', 'NAMI', 'NAC', 'USDT'].includes(o?.assetCode));
            _wallet &&
                _wallet.forEach((item) => {
                    const originWallet = allWallet?.[item.id];

                    if (originWallet) {
                        const value = originWallet?.value < MIN_WALLET ? 0 : originWallet?.value;
                        const lockedValue = originWallet?.value < MIN_WALLET ? 0 : originWallet?.locked_value;
                        const available = value - lockedValue;

                        mapper.push({
                            ...item,
                            [AVAILBLE_KEY]: isNaN(available) || available < MIN_WALLET ? 0 : available,
                            wallet: originWallet
                        });
                    }
                });
        }

        const stateKey = {
            [WalletType.SPOT]: 'allAssets',
            [WalletType.FUTURES]: 'allFuturesAsset',
            [WalletType.NAO_FUTURES]: 'allNAOFuturesAsset',
            [WalletType.INSURANCE]: 'allInsuranceAsset',
            [WalletType.PARTNERS]: 'allPartnersAsset',
            [WalletType.INSURANCE]: 'allInsuranceAsset'
        }?.[walletType];
        if (!stateKey) return;
        setState({ [stateKey]: orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']) });
    };

    const getStakingSummary = async () => {
        setState({ loadingSummary: true });

        try {
            const { data } = await Axios.get(API_STAKING_SUMMARY);
            if (data?.status === ApiStatus.SUCCESS) {
                setState({ stakingSummary: data?.data });
            }
        } catch (e) {
            console.log(`Can't get stake info => `, e);
        } finally {
            setState({ loadingSummary: false });
        }
    };

    const getFarmingSummary = async () => {
        setState({ loadingSummary: true });

        try {
            const { data } = await Axios.get(API_FARMING_SUMMARY);
            if (data?.status === ApiStatus.SUCCESS) {
                setState({ farmingSummary: data?.data });
            }
        } catch (e) {
            console.log(`Can't get stake info => `, e);
        } finally {
            setState({ loadingSummary: false });
        }
    };

    const reNewUsdRate = async () => {
        const usdRate = await getUsdRate();
        console.log('usdRate:', usdRate)
        usdRate && setState({ usdRate });
    };

    const { width } = useWindowSize();

    const isSmallScreen = width < WIDTH_MD;

    // Render Handler
    const renderScreenTab = useCallback(() => {
        return (
            <div className="relative flex tracking-normal">
                <Tabs isMobile tab={state.screenIndex} className="gap-6 border-b border-divider dark:border-divider-dark">
                    {SCREEN_TAB_SERIES.map((e, index) => {
                        return (
                            <TabItem
                                isActive={e?.key === state.screenIndex}
                                key={e?.key}
                                className={`text-left !px-0 !text-base !w-auto first:ml-4 md:first:ml-0`}
                                value={e.key}
                                onClick={() => {
                                    const current = SCREEN_TAB_SERIES.find((o) => o?.key === e.key);
                                    r.push(`${PATHS.WALLET.DEFAULT}/${current?.code}`);
                                }}
                            >
                                {index > 0 && language === LANGUAGE_TAG.VI ? 'Ví' : ''}{' '}
                                {e.title === 'Partners' && language === LANGUAGE_TAG.VI ? 'hoa hồng' : t(`${e.localized ? e.localized : e.title}`)}
                            </TabItem>
                        );
                    })}
                </Tabs>
                <div className="absolute right-0 hidden md:block">
                    {/* <div /> */}
                    <HrefButton variants="blank" className="w-auto !text-base" href={`/${WALLET_SCREENS.TRANSACTION_HISTORY}`}>
                        {t('common:transaction_history')}
                    </HrefButton>
                </div>
            </div>
        );
    }, [state.screenIndex]);

    useEffect(() => {
        getStakingSummary();
        getFarmingSummary();
    }, []);

    useEffect(() => {
        auth && reNewUsdRate();
    }, [auth]);

    useEffect(() => {
        auth && reNewUsdRate();
    }, [auth]);

    useEffect(() => {
        let interval;
        if (focused && !SCREEN_IGNORE_REFRESH_USD_RATE.includes(state.screen)) {
            interval = setInterval(() => reNewUsdRate(), 5000);
        }
        return () => interval && clearInterval(interval);
    }, [focused, state.screen]);

    // useEffect(() => {
    //     // state.screen === WALLET_SCREENS.OVERVIEW && getStakingConfig()
    //     // state.screen === WALLET_SCREENS.OVERVIEW && getFarmingkingConfig()
    // }, [state.screen])

    useEffect(() => {
        walletMapper(WalletType.SPOT, allWallet, assetConfig);
    }, [allWallet, assetConfig]);

    useEffect(() => {
        walletMapper(WalletType.FUTURES, allFuturesWallet, assetConfig);
    }, [allFuturesWallet, assetConfig]);

    useEffect(() => {
        walletMapper(WalletType.NAO_FUTURES, allNAOFuturesWallet, assetConfig);
    }, [allNAOFuturesWallet, assetConfig]);

    useEffect(() => {
        walletMapper(WalletType.INSURANCE, allInsuranceWallet, assetConfig);
    }, [allInsuranceWallet, assetConfig]);

    useEffect(() => {
        walletMapper(WalletType.PARTNERS, allPartnersWallet, assetConfig);
    }, [allPartnersWallet, assetConfig]);

    useEffect(() => {
        if (r?.query?.id) {
            const _ = SCREEN_TAB_SERIES.find((o) => o?.code === r.query.id);
            setState({
                screenIndex: _?.key,
                screen: _?.code
            });
        }
    }, [r]);

    useEffect(() => {
        const allAssetValue = state.usdRate;
        const walletTypes = ['exchange', 'futures', 'naoFutures', 'insurance', 'partners'];
        const walletAssetsMapper = {
            exchange: 'allAssets',
            futures: 'allFuturesAsset',
            naoFutures: 'allNAOFuturesAsset',
            insurance: 'allInsuranceAsset',
            partners: 'allPartnersAsset'
        };
        const walletList = walletTypes.reduce((accu, walletType) => ({ ...accu, [walletType]: [] }), {});

        walletTypes.forEach((walletType) => {
            state?.[walletAssetsMapper[walletType]]?.forEach((asset) => {
                const assetValue = +allAssetValue?.[asset?.id] || 0;
                walletList[walletType]?.push({
                    assetCode: asset?.assetCode,
                    usdRate: +assetValue,
                    available: +asset?.[AVAILBLE_KEY],
                    totalUsd: +asset?.[AVAILBLE_KEY] * assetValue,
                    totalValueUsd: +asset?.wallet?.value * assetValue,
                    totalLockedUsd: +asset?.wallet?.locked_value * assetValue
                });
            });
        });

        const walletValueMapper = walletTypes.reduce(
            (accu, walletType) => ({
                ...accu,
                [walletType]: {
                    total: sumBy(walletList[walletType], 'totalUsd'),
                    totalValue: sumBy(walletList[walletType], 'totalValueUsd'),
                    locked: sumBy(walletList[walletType], 'totalLockedUsd')
                }
            }),
            {}
        );

        // earn
        const namiUsdRate = allAssetValue?.['1'] || 1;
        const totalStaking = state.stakingSummary?.[0]?.summary?.total_balance * namiUsdRate;
        const totalFarming = state.farmingSummary?.[0]?.summary?.total_balance * namiUsdRate;

        const btcDigit = find(state.allAssets, (o) => o?.assetCode === 'BTC')?.assetDigit;
        // const usdDigit = find(state.allAssets, o => o?.assetCode === 'USDT')?.assetDigit;
        const btcUsdRate = allAssetValue?.['9'];

        if (totalStaking) {
            setState({
                stakingEstBtc: {
                    totalValue: totalStaking / btcUsdRate,
                    assetDigit: 8
                },
                stakingRefPrice: {
                    totalValue: totalStaking,
                    assetDigit: 2
                }
            });
        }

        if (totalFarming) {
            setState({
                farmingEstBtc: {
                    totalValue: totalFarming / btcUsdRate,
                    assetDigit: 8
                },
                farmingRefPrice: {
                    totalValue: totalFarming,
                    assetDigit: 2
                }
            });
        }

        if (btcUsdRate > 0) {
            const newWalletState = walletTypes.reduce((obj, walletType) => {
                return {
                    ...obj,
                    [`${walletType}EstBtc`]: {
                        totalValue: walletValueMapper?.[walletType]?.totalValue / btcUsdRate,
                        value: walletValueMapper?.[walletType]?.total / btcUsdRate,
                        locked: walletValueMapper?.[walletType]?.locked / btcUsdRate,
                        assetDigit: btcDigit
                    },
                    [`${walletType}RefPrice`]: {
                        totalValue: walletValueMapper?.[walletType]?.totalValue,
                        value: walletValueMapper?.[walletType]?.total,
                        locked: walletValueMapper?.[walletType]?.locked,
                        assetDigit: 2
                    }
                };
            }, {});

            setState(newWalletState);
        }
    }, [state.allAssets, state.allFuturesAsset, state.allPartnersAsset, state.stakingSummary, state.farmingSummary, state.usdRate]);

    useAsync(async () => {
        if (state.screen === WALLET_SCREENS.EXCHANGE) {
            const exchangeMarketWatch = await getMarketWatch();
            exchangeMarketWatch && setState({ exchangeMarketWatch });
        }

        if (state.screen === WALLET_SCREENS.FUTURES) {
            const futuresMarketWatch = await getFuturesMarketWatch();
            futuresMarketWatch && setState({ futuresMarketWatch });
        }

        if (state.screen === WALLET_SCREENS.PARTNERS) {
            const futuresMarketWatch = await getFuturesMarketWatch();
            futuresMarketWatch && setState({ futuresMarketWatch });
        }
    }, [state.screen]);

    return (
        <Background isDark={currentTheme === THEME_MODE.DARK}>
            {auth ? (
                <CustomContainer>
                    <div className="text-[32px] font-bold leading-[38px] text-txtPrimary dark:text-txtPrimary-dark mb-8 text-left hidden md:block">
                        {t('common:my_wallet')}
                    </div>
                    {renderScreenTab()}
                    <div className="mt-8 px-4 md:px-0 text-txtPrimary dark:text-txtPrimary-dark">
                        {state.screen === WALLET_SCREENS.OVERVIEW && (
                            <OverviewWallet
                                allAssets={state.allAssets}
                                exchangeEstBtc={state.exchangeEstBtc}
                                exchangeRefPrice={state.exchangeRefPrice}
                                futuresEstBtc={state.futuresEstBtc}
                                futuresRefPrice={state.futuresRefPrice}
                                naoFuturesEstBtc={state.naoFuturesEstBtc}
                                naoFuturesRefPrice={state.naoFuturesRefPrice}
                                insuranceEstBtc={state.insuranceEstBtc}
                                insuranceRefPrice={state.insuranceRefPrice}
                                partnersEstBtc={state.partnersEstBtc}
                                partnersRefPrice={state.partnersRefPrice}
                                stakingSummary={state.stakingSummary}
                                farmingSummary={state.farmingSummary}
                                stakingEstBtc={state.stakingEstBtc}
                                stakingRefPrice={state.stakingRefPrice}
                                farmingEstBtc={state.farmingEstBtc}
                                farmingRefPrice={state.farmingRefPrice}
                                isSmallScreen={isSmallScreen}
                                isHideAsset={isHideAsset}
                                setIsHideAsset={setIsHideAsset}
                            />
                        )}
                        {state.screen === WALLET_SCREENS.EXCHANGE && (
                            <ExchangeWallet
                                allAssets={state.allAssets}
                                estBtc={state.exchangeEstBtc}
                                estUsd={state.exchangeRefPrice}
                                usdRate={state.usdRate}
                                marketWatch={state.exchangeMarketWatch}
                                isSmallScreen={isSmallScreen}
                                isHideAsset={isHideAsset}
                                setIsHideAsset={setIsHideAsset}
                            />
                        )}
                        {state.screen === WALLET_SCREENS.FUTURES && (
                            <FuturesWallet
                                estBtc={state.futuresEstBtc}
                                estUsd={state.futuresRefPrice}
                                usdRate={state.usdRate}
                                marketWatch={state.futuresMarketWatch}
                                isSmallScreen={isSmallScreen}
                                isHideAsset={isHideAsset}
                                setIsHideAsset={setIsHideAsset}
                            />
                        )}

                        {state.screen === WALLET_SCREENS.INSURANCE && (
                            <InsuranceWallet
                                estBtc={state.insuranceEstBtc}
                                estUsd={state.insuranceRefPrice}
                                usdRate={state.usdRate}
                                marketWatch={state.futuresMarketWatch}
                                isSmallScreen={isSmallScreen}
                                isHideAsset={isHideAsset}
                                setIsHideAsset={setIsHideAsset}
                            />
                        )}

                        {state.screen === WALLET_SCREENS.NAO_FUTURES && (
                            <NAOFuturesWallet
                                estBtc={state.naoFuturesEstBtc}
                                estUsd={state.naoFuturesRefPrice}
                                usdRate={state.usdRate}
                                marketWatch={state.futuresMarketWatch}
                                isSmallScreen={isSmallScreen}
                                isHideAsset={isHideAsset}
                                setIsHideAsset={setIsHideAsset}
                            />
                        )}
                        {state.screen === WALLET_SCREENS.PARTNERS && (
                            <PartnersWallet
                                estBtc={state.partnersEstBtc}
                                estUsd={state.partnersRefPrice}
                                usdRate={state.usdRate}
                                marketWatch={state.futuresMarketWatch}
                                isSmallScreen={isSmallScreen}
                                isHideAsset={isHideAsset}
                                setIsHideAsset={setIsHideAsset}
                            />
                        )}
                        {state.screen === WALLET_SCREENS.STAKING && <StakingWallet summary={state.stakingSummary} loadingSummary={state.loadingSummary} />}
                        {/* {state.screen === WALLET_SCREENS.FARMING && <FarmingWallet summary={state.farmingSummary} loadingSummary={state.loadingSummary} />}
                        {state.screen === WALLET_SCREENS.TRANSACTION_HISTORY && <TransactionHistory />} */}

                        {state.screen === WALLET_SCREENS.NFT && <NFTWallet />}
                    </div>
                </CustomContainer>
            ) : (
                <div className="h-[480px] flex items-center justify-center">
                    <NeedLoginV2 addClass="flex items-center justify-center" />
                </div>
            )}
        </Background>
    );
};

const SCREEN_TAB_SERIES = [
    {
        key: 0,
        code: WALLET_SCREENS.OVERVIEW,
        title: 'Overview',
        localized: 'common:overview'
    },
    {
        key: 1,
        code: WALLET_SCREENS.EXCHANGE,
        title: 'Spot',
        localized: 'wallet:spot_short'
    },
    {
        key: 2,
        code: WALLET_SCREENS.FUTURES,
        title: 'Nami Futures',
        localized: 'wallet:nami_futures_short'
    },
    {
        key: 3,
        code: WALLET_SCREENS.NAO_FUTURES,
        title: 'NAO Futures',
        localized: null
    },
    {
        key: 5,
        code: WALLET_SCREENS.INSURANCE,
        title: 'Insurance',
        localized: null
    },
    {
        key: 4,
        code: WALLET_SCREENS.PARTNERS,
        title: 'Partners',
        localized: 'wallet:commission'
    },
    {
        key: WALLET_SCREENS.NFT,
        code: WALLET_SCREENS.NFT,
        title: 'NFT',
        localized: 'wallet:nft'
    }
    // {
    //     key: 3,
    //     code: WALLET_SCREENS.STAKING,
    //     title: 'Staking',
    //     localized: null
    // }
    // {
    //     key: 4,
    //     code: WALLET_SCREENS.FARMING,
    //     title: 'Farming',
    //     localized: null
    // },
    // { key: 5, code: WALLET_SCREENS.TRANSACTION_HISTORY, title: 'Transaction History', localized: 'common:transaction_history' }
];

const SCREEN_IGNORE_REFRESH_USD_RATE = [WALLET_SCREENS.FARMING, WALLET_SCREENS.STAKING];

const Background = styled.div.attrs({ className: 'w-full h-full' })`
    background-color: ${({ isDark }) => (isDark ? colors.dark.dark : '#fff')};
`;

const CustomContainer = styled.div.attrs({ className: 'max-w-screen-v3 2xl:max-w-screen-xxl m-auto md:px-4 md:py-20' })``;

export default Wallet;
