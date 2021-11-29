import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { find, orderBy, sumBy } from 'lodash'
import { WALLET_SCREENS } from 'pages/wallet'

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
import { GET_FARMING_CONFIG, GET_STAKING_CONFIG } from 'redux/actions/apis'
import { ApiStatus, WalletType } from 'redux/actions/const'
import { useAsync } from 'react-use'
import { getUsdRate } from 'redux/actions/market'
import { formatWallet } from 'redux/actions/utils'
import useWindowFocus from 'hooks/useWindowFocus'
import TransferModal from 'components/wallet/TransferModal'

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

    // ... Add new state
}

const AVAILBLE_KEY = 'available'

const Wallet = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Rdx
    const allWallet = useSelector(state => state.wallet?.SPOT) || null
    const allFuturesWallet = useSelector(state => state.wallet?.FUTURES) || null
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null

    // Use Hooks
    const r = useRouter()
    const [currentTheme, ] = useDarkMode()
    const focused = useWindowFocus()

    // Helper
    const walletMapper = (walletType, allWallet, assetConfig) => {
        if (!allWallet || !assetConfig) return
        const mapper = []
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const _wallet = walletType === WalletType.SPOT ? assetConfig.filter(o => o.walletTypes?.[walletType])
                : assetConfig.filter(o => ['VNDC', 'NAMI', 'NAC', 'USDT'].includes(o?.assetCode))
            _wallet && _wallet.forEach(item => allWallet?.[item.id] && mapper.push({...item, [AVAILBLE_KEY]: allWallet?.[item?.id]?.value - allWallet?.[item?.id]?.locked_value, wallet: allWallet?.[item?.id]}))
            // console.log('namidev-DEBUG: ___ ', orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']))
        }
        if (walletType === WalletType.SPOT) {
            setState({ allAssets: orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']) })
        }
        if (walletType === WalletType.FUTURES) {
            setState({ allFuturesAsset: orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']) })
        }
    }

    const getStakingConfig = async () => {
        setState({ loadingStaking: true })
        try {
            const { data: { status, data: stakingConfig } } = await Axios.get(GET_STAKING_CONFIG)
            if (status === ApiStatus.SUCCESS && stakingConfig) {
                setState({ stakingConfig })
            }
        } catch (e) {
            console.log(`Can't get staking config `, e)
        } finally {
            setState({ loadingStaking: false })
        }
    }

    const getFarmingkingConfig = async () => {
        setState({ loadingFarming: true })
        try {
            const { data: { status, data: farmingConfig } } = await Axios.get(GET_FARMING_CONFIG)
            if (status === ApiStatus.SUCCESS && farmingConfig) {
                setState({ farmingConfig })
            }
        } catch (e) {
            console.log(`Can't get staking config `, e)
        } finally {
            setState({ loadingFarming: false })
        }
    }

    const reNewUsdRate = async () => {
        const usdRate = await getUsdRate()
        usdRate && setState({ usdRate })
    }

    // Render Handler
    const renderScreenTab = useCallback(() => {
        return (
            <Tab series={SCREEN_TAB_SERIES}
                 currentIndex={state.screenIndex}
                 onChangeTab={(screenIndex) => {
                     const current = SCREEN_TAB_SERIES.find(o => o?.key === screenIndex)
                     // if (current?.code === WALLET_SCREENS.FARMING || current?.code === WALLET_SCREENS.STAKING) {
                     //     r.push(`https://nami.exchange/wallet/account?type=${current?.code}`)
                     // } else {
                         r.push(`/wallet/${current?.code}`)
                     // }
                 }}
                 tArr={['common']}
            />
        )
    }, [state.screenIndex])

    useEffect(() => {
        reNewUsdRate()
    }, [])

    useEffect(() => {
        let interval
        if (focused) {
            interval = setInterval(() => reNewUsdRate(), 5000)
        }
        return () => interval && clearInterval(interval)
    }, [focused])

    useEffect(() => {
        state.screen === WALLET_SCREENS.OVERVIEW && getStakingConfig()
        state.screen === WALLET_SCREENS.OVERVIEW && getFarmingkingConfig()
    }, [state.screen])

    useEffect(() => {
        walletMapper(WalletType.SPOT, allWallet, assetConfig)
    }, [allWallet, assetConfig])

    useEffect(() => {
        walletMapper(WalletType.FUTURES, allFuturesWallet, assetConfig)
    }, [allFuturesWallet, assetConfig])

    useEffect(() => {
        if (r?.query?.id) {
            const _ = SCREEN_TAB_SERIES.find(o => o?.code === r.query.id)
            setState({ screenIndex: _?.key, screen: _?.code })
        }
    }, [r])

    useAsync(async () => {
        setState({ loadingUsdRate: true })
        try {
            const _ = state.usdRate

            const exchangeList = []
            const futuresList = []

            state.allAssets?.forEach((asset) => _?.[asset?.id] && exchangeList.push({
                assetCode: asset?.assetCode,
                usdRate: _?.[asset?.id],
                available: asset?.[AVAILBLE_KEY],
                totalUsd: asset?.[AVAILBLE_KEY] * _?.[asset?.id],
                totalValueUsd: asset?.wallet?.value * _?.[asset?.id],
                totalLockedUsd: asset?.wallet?.locked_value * _?.[asset?.id],
            }))

            state.allFuturesAsset?.forEach((asset) => _?.[asset?.id] && futuresList.push({
                assetCode: asset?.assetCode,
                usdRate: _?.[asset?.id],
                available: asset?.[AVAILBLE_KEY],
                totalUsd: asset?.[AVAILBLE_KEY] * _?.[asset?.id],
                totalValueUsd: asset?.wallet?.value * _?.[asset?.id],
                totalLockedUsd: asset?.wallet?.locked_value * _?.[asset?.id],
            }))

            const totalExchange = sumBy(exchangeList, 'totalUsd')
            const totalFutures = sumBy(futuresList, 'totalUsd')

            const totalValueExchange = sumBy(exchangeList, 'totalValueUsd')
            const totalValueFutures = sumBy(futuresList, 'totalValueUsd')

            const lockedExchange = sumBy(exchangeList, 'totalLockedUsd')
            const lockedFutures = sumBy(futuresList, 'totalLockedUsd')

            const btcDigit = find(state.allAssets, o => o?.assetCode === 'BTC')?.assetDigit
            const usdDigit = find(state.allAssets, o => o?.assetCode === 'USDT')?.assetDigit
            const btcUsdRate = _?.['9']

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
                        assetDigit: usdDigit,
                    }
                })
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
                        assetDigit: usdDigit,
                    }
                })
            }

        } catch (e) {
            console.log(`Can't get usd rate `, e)
        } finally {
            setState({ loadingUsdRate: false })
        }
    }, [state.allAssets, state.allFuturesAsset, state.usdRate])

    return (
        <>
            <MaldivesLayout>
                <Background isDark={currentTheme === THEME_MODE.DARK}>
                    <div className="mal-container px-4">
                        {renderScreenTab()}
                        <div className="mt-7">
                            {state.screen === WALLET_SCREENS.OVERVIEW &&
                            <OverviewWallet
                                allAssets={state.allAssets}
                                loadingStaking={state.loadingStaking}
                                stakingConfig={state.stakingConfig}
                                loadingFarming={state.loadingFarming}
                                farmingConfig={state.farmingConfig}
                                exchangeEstBtc={state.exchangeEstBtc}
                                futuresEstBtc={state.futuresEstBtc}
                                exchangeRefPrice={state.exchangeRefPrice}
                                futuresRefPrice={state.futuresRefPrice}
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
                            {state.screen === WALLET_SCREENS.STAKING && <StakingWallet/>}
                            {state.screen === WALLET_SCREENS.FARMING && <FarmingWallet/>}
                            {state.screen === WALLET_SCREENS.TRANSACTION_HISTORY && <TransactionHistory/>}
                        </div>
                    </div>
                </Background>
            </MaldivesLayout>
        </>
)}

const SCREEN_TAB_SERIES = [
    { key: 0, code: WALLET_SCREENS.OVERVIEW, title: 'Overview', localized: 'common:overview' },
    { key: 1, code: WALLET_SCREENS.EXCHANGE, title: 'Exchange', localized: null },
    { key: 2, code: WALLET_SCREENS.FUTURES, title: 'Futures', localized: null },
    { key: 3, code: WALLET_SCREENS.STAKING, title: 'Staking', localized: null },
    { key: 4, code: WALLET_SCREENS.FARMING, title: 'Farming', localized: null },
    // { key: 5, code: WALLET_SCREENS.TRANSACTION_HISTORY, title: 'Transaction History', localized: 'common:transaction_history' },
]

const Background = styled.div.attrs({ className: 'w-full h-full pt-5' })`
  background-color: ${({ isDark }) => isDark ? colors.darkBlue1 : '#F8F9FA'};
`

export default Wallet
