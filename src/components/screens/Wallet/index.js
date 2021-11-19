import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { orderBy } from 'lodash'
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
import { ApiStatus } from 'redux/actions/const'

const INITIAL_STATE = {
    screen: null,
    screenIndex: null,
    allAssets: null,
    loadingStaking: false,
    stakingConfig: null,
    loadingFarming: false,
    farmingConfig: null,

    // ... Add new state
}

const AVAILBLE_KEY = 'exchange_available'

const Wallet = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Rdx
    const allWallet = useSelector(state => state.wallet?.SPOT) || null
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null

    // Use Hooks
    const r = useRouter()
    const [currentTheme, ] = useDarkMode()

    // Helper
    const walletMapper = (allWallet, assetConfig) => {
        if (!allWallet || !assetConfig) return
        const mapper = []
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const spot = assetConfig.filter(o => o.walletTypes?.SPOT)
            spot && spot.forEach(item => allWallet?.[item.id] && mapper.push({...item, [AVAILBLE_KEY]: allWallet?.[item?.id]?.value - allWallet?.[item?.id]?.locked_value}))
            // console.log('namidev-DEBUG: ___ ', orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']))
        }
        setState({ allAssets: orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']) })
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

    // Render Handler
    const renderScreenTab = useCallback(() => {
        return (
            <Tab series={SCREEN_TAB_SERIES}
                 currentIndex={state.screenIndex}
                 onChangeTab={(screenIndex) => r.push(`/wallet/${SCREEN_TAB_SERIES.find(o => o?.key === screenIndex)?.code}`)}
                 tArr={['common']}
            />
        )
    }, [state.screenIndex])

    useEffect(() => {
        state.screen === WALLET_SCREENS.OVERVIEW && getStakingConfig()
        state.screen === WALLET_SCREENS.OVERVIEW && getFarmingkingConfig()
    }, [state.screen])

    useEffect(() => {
        walletMapper(allWallet, assetConfig)
    }, [allWallet, assetConfig])

    useEffect(() => {
        if (r?.query?.id) {
            const _ = SCREEN_TAB_SERIES.find(o => o?.code === r.query.id)
            setState({ screenIndex: _?.key, screen: _?.code })
        }
    }, [r])


    return (
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
                        />}
                        {state.screen === WALLET_SCREENS.EXCHANGE && <ExchangeWallet/>}
                        {state.screen === WALLET_SCREENS.FUTURES && <FuturesWallet/>}
                        {state.screen === WALLET_SCREENS.STAKING && <StakingWallet/>}
                        {state.screen === WALLET_SCREENS.FARMING && <FarmingWallet/>}
                        {state.screen === WALLET_SCREENS.TRANSACTION_HISTORY && <TransactionHistory/>}
                    </div>
                </div>
            </Background>
        </MaldivesLayout>
    )
}

const SCREEN_TAB_SERIES = [
    { key: 0, code: WALLET_SCREENS.OVERVIEW, title: 'Overview', localized: 'common:overview' },
    { key: 1, code: WALLET_SCREENS.EXCHANGE, title: 'Exchange', localized: null },
    { key: 2, code: WALLET_SCREENS.FUTURES, title: 'Futures', localized: null },
    { key: 3, code: WALLET_SCREENS.STAKING, title: 'Staking', localized: null },
    { key: 4, code: WALLET_SCREENS.FARMING, title: 'Farming', localized: null },
    { key: 5, code: WALLET_SCREENS.TRANSACTION_HISTORY, title: 'Transaction History', localized: 'common:transaction_history' },
]

const Background = styled.div.attrs({ className: 'w-full h-full pt-5' })`
  background-color: ${({ isDark }) => isDark ? colors.darkBlue1 : '#F8F9FA'};
`

export default Wallet
