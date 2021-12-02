import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { find, orderBy, sumBy } from 'lodash';
import { WALLET_SCREENS } from 'pages/wallet';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import OverviewWallet from 'components/screens/Wallet/Overview'
import ExchangeWallet from 'components/screens/Wallet/Exchange'
import FuturesWallet from 'components/screens/Wallet/Futures'
import StakingWallet from 'components/screens/Wallet/Staking'
import FarmingWallet from 'components/screens/Wallet/Farming'
import TransactionHistory from 'components/screens/Wallet/Transaction'
import Axios from 'axios'
import Tab from 'components/common/Tab'
import colors from 'styles/colors'
import styled from 'styled-components'
import { API_FARMING_SUMMARY, API_STAKING_SUMMARY, GET_FARMING_CONFIG, GET_STAKING_CONFIG } from 'redux/actions/apis'
import { ApiStatus, WalletType } from 'redux/actions/const'
import { useAsync } from 'react-use'
import { getUsdRate } from 'redux/actions/market'
import useWindowFocus from 'hooks/useWindowFocus'
import { PATHS } from 'constants/paths'
import NeedLogin from 'components/common/NeedLogin'
import { MIN_WALLET } from 'constants/constants'

const INITIAL_STATE = {
    screen: null,
    screenIndex: null,
    allAssets: null,
    allFuturesAsset: null,
    loadingStaking: false,
    stakingConfig: null,
    loadingFarming: false,
    farmingConfig: null,
    loadingUsdRate: false,
    usdRate: null,
    exchangeEstBtc: null,
    futuresEstBtc: null,
    exchangeRefPrice: null,
    futuresRefPrice: null,
    stakingSummary: null,
    farmingSummary: null,
    loadingSummary: false,

    // ... Add new state
};

const AVAILBLE_KEY = 'available';

const Wallet = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const setState = state => set(prevState => ({ ...prevState, ...state }));

    // Rdx
    const auth = useSelector(state => state.auth?.user) || null;
    const allWallet = useSelector(state => state.wallet?.SPOT) || null;
    const allFuturesWallet = useSelector(state => state.wallet?.FUTURES) || null;
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null;

    // Use Hooks
    const r = useRouter();
    const [currentTheme,] = useDarkMode();
    const focused = useWindowFocus();

    // Helper
    const walletMapper = (walletType, allWallet, assetConfig) => {
        if (!allWallet || !assetConfig) return;
        const mapper = [];
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const _wallet = walletType === WalletType.SPOT ? assetConfig.filter(o => o.walletTypes?.[walletType])
                : assetConfig.filter(o => ['VNDC', 'NAMI', 'NAC', 'USDT'].includes(o?.assetCode))
            _wallet && _wallet.forEach(item => {
                const originWallet = allWallet?.[item.id]

                if (originWallet) {
                    const value = originWallet?.value < MIN_WALLET ? 0 : originWallet?.value
                    const lockedValue = originWallet?.value < MIN_WALLET ? 0 : originWallet?.locked_value
                    const available = value - lockedValue

                    mapper.push({
                       ...item,
                       [AVAILBLE_KEY]: (isNaN(available) || available < MIN_WALLET) ? 0 : available,
                       wallet: originWallet
                   })
                }
            })
            // console.log('namidev-DEBUG: ___ ', orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']))
        }
        if (walletType === WalletType.SPOT) {
            setState({ allAssets: orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']) });
        }
        if (walletType === WalletType.FUTURES) {
            setState({ allFuturesAsset: orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']) });
        }
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

    const getStakingConfig = async () => {
        setState({ loadingStaking: true });
        try {
            const { data: { status, data: stakingConfig } } = await Axios.get(GET_STAKING_CONFIG);
            if (status === ApiStatus.SUCCESS && stakingConfig) {
                setState({ stakingConfig });
            }
        } catch (e) {
            console.log(`Can't get staking config `, e);
        } finally {
            setState({ loadingStaking: false });
        }
    };

    const getFarmingkingConfig = async () => {
        setState({ loadingFarming: true });
        try {
            const { data: { status, data: farmingConfig } } = await Axios.get(GET_FARMING_CONFIG);
            if (status === ApiStatus.SUCCESS && farmingConfig) {
                setState({ farmingConfig });
            }
        } catch (e) {
            console.log(`Can't get staking config `, e);
        } finally {
            setState({ loadingFarming: false });
        }
    };

    const reNewUsdRate = async () => {
        const usdRate = await getUsdRate();
        usdRate && setState({ usdRate });
    };

    // Render Handler
    const renderScreenTab = useCallback(() => {
        return (
            <Tab series={SCREEN_TAB_SERIES}
                 currentIndex={state.screenIndex}
                 onChangeTab={(screenIndex) => {
                     const current = SCREEN_TAB_SERIES.find(o => o?.key === screenIndex);
                     // if (current?.code === WALLET_SCREENS.FARMING || current?.code === WALLET_SCREENS.STAKING) {
                     //     r.push(`https://nami.exchange/wallet/account?type=${current?.code}`)
                     // } else {
                     r.push(`${PATHS.WALLET.DEFAULT}/${current?.code}`);
                     // }
                 }}
                 tArr={['common']}
            />
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
        if (r?.query?.id) {
            const _ = SCREEN_TAB_SERIES.find(o => o?.code === r.query.id);
            setState({
                screenIndex: _?.key,
                screen: _?.code
            });
        }
    }, [r]);

    useAsync(async () => {
        setState({ loadingUsdRate: true });
        try {
            const allAssetValue = state.usdRate;
            const exchangeList = [];
            const futuresList = [];

            state.allAssets?.map((asset) => {
                const assetValue = +allAssetValue?.[asset?.id] || 0;
                exchangeList.push({
                    assetCode: asset?.assetCode,
                    usdRate: +assetValue,
                    available: +asset?.[AVAILBLE_KEY],
                    totalUsd: +asset?.[AVAILBLE_KEY] * assetValue,
                    totalValueUsd: +asset?.wallet?.value * assetValue,
                    totalLockedUsd: +asset?.wallet?.locked_value * assetValue,
                });
            });

            state.allFuturesAsset?.map((asset) => {
                const assetValue = +allAssetValue?.[asset?.id] || 0;
                futuresList.push({
                    assetCode: asset?.assetCode,
                    usdRate: +assetValue,
                    available: +asset?.[AVAILBLE_KEY],
                    totalUsd: +asset?.[AVAILBLE_KEY] * assetValue,
                    totalValueUsd: +asset?.wallet?.value * assetValue,
                    totalLockedUsd: +asset?.wallet?.locked_value * assetValue,
                });
            })

            // traditional
            const totalExchange = sumBy(exchangeList, 'totalUsd');
            const totalFutures = sumBy(futuresList, 'totalUsd');

            const totalValueExchange = sumBy(exchangeList, 'totalValueUsd');
            const totalValueFutures = sumBy(futuresList, 'totalValueUsd');

            const lockedExchange = sumBy(exchangeList, 'totalLockedUsd');
            const lockedFutures = sumBy(futuresList, 'totalLockedUsd');

            // earn
            const namiUsdRate = _?.['1'] || 1;
            const totalStaking = state.stakingSummary?.[0]?.summary?.total_interest_earned * namiUsdRate;
            const totalFarming = state.farmingSummary?.[1]?.summary?.total_interest_earned * namiUsdRate;
            // console.log('namidev-DEBUG: => ', state.farmingSummary?.[0]?.summary?.total_interest_earned)

            const btcDigit = find(state.allAssets, o => o?.assetCode === 'BTC')?.assetDigit
            const usdDigit = find(state.allAssets, o => o?.assetCode === 'USDT')?.assetDigit
            const btcUsdRate = _?.['9']
            console.log('BTC/USD Rate => ', btcUsdRate)

            if (totalStaking) {
                setState({
                    stakingEstBtc: {
                        totalValue: totalStaking / btcUsdRate,
                    },
                    stakingRefPrice: {
                        totalValue: totalStaking
                    }
                });
            }

            if (totalFarming) {
                setState({
                    farmingEstBtc: {
                        totalValue: totalFarming / btcUsdRate
                    },
                    farmingRefPrice: {
                        totalValue: totalFarming
                    }
                });
            }

            if (totalExchange && totalValueExchange && lockedExchange) {
                setState({
                    exchangeEstBtc: {
                        totalValue: totalValueExchange / btcUsdRate,
                        value: totalExchange / btcUsdRate,
                        locked: lockedExchange / btcUsdRate,
                        assetDigit: btcDigit,
                    },
                    exchangeRefPrice: {
                        totalValue: totalValueExchange,
                        value: totalExchange,
                        locked: lockedExchange,
                        assetDigit: 2,
                    }
                });
            }

            if (totalFutures && totalValueFutures && lockedFutures) {
                setState({
                    futuresEstBtc: {
                        totalValue: totalValueFutures / btcUsdRate,
                        value: totalFutures / btcUsdRate,
                        locked: lockedFutures / btcUsdRate,
                        assetDigit: btcDigit,
                    },
                    futuresRefPrice: {
                        totalValue: totalValueFutures,
                        value: totalFutures,
                        locked: lockedFutures,
                        assetDigit: 2,
                    }
                });
            }

        } catch (e) {
            console.log(`Can't get usd rate `, e);
        } finally {
            setState({ loadingUsdRate: false });
        }
    }, [state.allAssets, state.allFuturesAsset, state.stakingSummary, state.farmingSummary, state.usdRate]);

    // useEffect(() => {
    //     console.log('namidev-DEBUG: => ', state)
    // }, [state])

    return (
        <>
            <MaldivesLayout>
                <Background isDark={currentTheme === THEME_MODE.DARK}>
                    {auth ?
                        <CustomContainer>
                            {renderScreenTab()}
                            <div className="mt-7">
                                {state.screen === WALLET_SCREENS.OVERVIEW &&
                                <OverviewWallet
                                    allAssets={state.allAssets}
                                    // loadingStaking={state.loadingStaking}
                                    // stakingConfig={state.stakingConfig}
                                    // loadingFarming={state.loadingFarming}
                                    // farmingConfig={state.farmingConfig}
                                    exchangeEstBtc={state.exchangeEstBtc}
                                    futuresEstBtc={state.futuresEstBtc}
                                    exchangeRefPrice={state.exchangeRefPrice}
                                    futuresRefPrice={state.futuresRefPrice}
                                    stakingSummary={state.stakingSummary}
                                    farmingSummary={state.farmingSummary}
                                    stakingEstBtc={state?.stakingEstBtc}
                                    stakingRefPrice={state?.stakingRefPrice}
                                    farmingEstBtc={state?.farmingEstBtc}
                                    farmingRefPrice={state?.farmingRefPrice}
                                />}
                                {state.screen === WALLET_SCREENS.EXCHANGE &&
                                <ExchangeWallet
                                    allAssets={state.allAssets}
                                    estBtc={state.exchangeEstBtc}
                                    estUsd={state.exchangeRefPrice}
                                />}
                                {state.screen === WALLET_SCREENS.FUTURES &&
                                <FuturesWallet
                                    estBtc={state.futuresEstBtc}
                                    estUsd={state.futuresRefPrice}
                                />}
                                {state.screen === WALLET_SCREENS.STAKING &&
                                <StakingWallet summary={state.stakingSummary} loadingSummary={state.loadingSummary}/>}
                                {state.screen === WALLET_SCREENS.FARMING &&
                                <FarmingWallet summary={state.farmingSummary} loadingSummary={state.loadingSummary}/>}
                                {state.screen === WALLET_SCREENS.TRANSACTION_HISTORY && <TransactionHistory/>}
                            </div>
                        </CustomContainer>
                        : <div className="h-[480px] flex items-center justify-center">
                            <NeedLogin addClass="flex items-center justify-center"/>
                        </div>
                    }
                </Background>
            </MaldivesLayout>
        </>
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
        title: 'Exchange',
        localized: null
    },
    {
        key: 2,
        code: WALLET_SCREENS.FUTURES,
        title: 'Futures',
        localized: null
    },
    {
        key: 3,
        code: WALLET_SCREENS.STAKING,
        title: 'Staking',
        localized: null
    },
    {
        key: 4,
        code: WALLET_SCREENS.FARMING,
        title: 'Farming',
        localized: null
    },
    // { key: 5, code: WALLET_SCREENS.TRANSACTION_HISTORY, title: 'Transaction History', localized: 'common:transaction_history' },
];

const SCREEN_IGNORE_REFRESH_USD_RATE = [WALLET_SCREENS.FARMING, WALLET_SCREENS.STAKING];

const Background = styled.div.attrs({ className: 'w-full h-full pt-5' })`
  background-color: ${({ isDark }) => isDark ? colors.darkBlue1 : '#F8F9FA'};
`;

const CustomContainer = styled.div.attrs({ className: 'mal-container px-4' })`
  @media (min-width: 1024px) {
    max-width: 1000px !important;
  }

  @media (min-width: 1280px) {
    max-width: 1260px !important;
  }

  @media (min-width: 1440px) {
    max-width: 1300px !important;
  }

  @media (min-width: 1920px) {
    max-width: 1440px !important;
  }
`;

export default Wallet;
