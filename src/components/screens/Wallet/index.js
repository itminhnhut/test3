import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { sortBy } from 'lodash'
import { WALLET_SCREENS } from 'pages/wallet'

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import OverviewWallet from 'components/screens/Wallet/Overview'
import ExchangeWallet from 'components/screens/Wallet/Exchange'
import FuturesWallet from 'components/screens/Wallet/Futures'
import StakingWallet from 'components/screens/Wallet/Staking'
import FarmingWallet from 'components/screens/Wallet/Farming'
import TransactionHistory from 'components/screens/Wallet/Transaction'
import Tab from 'components/common/Tab'
import colors from 'styles/colors'
import styled from 'styled-components'

const INITIAL_STATE = {
    screen: null,
    screenIndex: null,
    // ... Add new state
}

const Wallet = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Rdx
    const allWallet = useSelector(state => state.wallet?.SPOT)

    // Use Hooks
    const r = useRouter()
    const [currentTheme, ] = useDarkMode()

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
        if (r?.query?.id) {
            const _ = SCREEN_TAB_SERIES.find(o => o?.code === r.query.id)
            setState({ screenIndex: _?.key, screen: _?.code })
        }
    }, [r])

    useEffect(() => {

    }, [])

    return (
        <MaldivesLayout>
            <Background isDark={currentTheme === THEME_MODE.DARK}>
                <div className="mal-container px-4">
                    {renderScreenTab()}
                    <div className="mt-7">
                        {state.screen === WALLET_SCREENS.OVERVIEW && <OverviewWallet allWallet={allWallet}/>}
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
