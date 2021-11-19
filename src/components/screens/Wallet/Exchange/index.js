import { useEffect, useState } from 'react'
import { EXCHANGE_ACTION } from 'pages/wallet'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'

import ExchangeDeposit from 'components/screens/Wallet/Exchange/ExchangeDeposit'
import ExchangeWithdraw from 'components/screens/Wallet/Exchange/ExchangeWithdraw'
import ExchangeTransfer from 'components/screens/Wallet/Exchange/ExchangeTransfer'
import ExchangePortfolio from 'components/screens/Wallet/Exchange/ExchangePortfolio'
import colors from 'styles/colors'

const INITIAL_STATE = {
    hideAsset: false,
    reInitializing: false,
    action: null, // action = null is wallet overview
}

const ExchangeWallet = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Use Hooks
    const r = useRouter()

    useEffect(() => {
        if (r?.query?.action) {
           setState({ action: r.query.action })
        } else {
            setState({ action: null })
        }
    }, [r])

    useEffect(() => {
        if (state.action && Object.keys(EXCHANGE_ACTION).includes(state.action.toUpperCase())) {
            r.replace(`?action=${state.action}`)
        }
    }, [state.action])

    useEffect(() => {
        console.log('namidev-DEBUG: Watching State => ', state)
    }, [state])


    return (
        <div>
            <a className="block cursor-pointer my-4" href="/wallet/exchange">
                {"<<< BACK "}
            </a>
            <a href="/wallet/exchange?action=deposit" className={state.action === EXCHANGE_ACTION.DEPOSIT.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>
                {EXCHANGE_ACTION.DEPOSIT}
            </a><br/>
            <a href="/wallet/exchange?action=withdraw" className={state.action === EXCHANGE_ACTION.WITHDRAW.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>
                {EXCHANGE_ACTION.WITHDRAW}
            </a><br/>
            <a href="/wallet/exchange?action=transfer" className={state.action === EXCHANGE_ACTION.TRANSFER.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>
                {EXCHANGE_ACTION.TRANSFER}
            </a><br/>
            <a href="/wallet/exchange?action=portfolio" className={state.action === EXCHANGE_ACTION.PORTFOLIO.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>
                {EXCHANGE_ACTION.PORTFOLIO}
            </a>

            <div className="mt-12">
                {state.reInitializing && state.action ?
                    <div className="w-full h-full flex items-center justify-center">
                        <PulseLoader color={colors.teal}/>
                    </div>
                    : <>
                        {state.action === EXCHANGE_ACTION.DEPOSIT.toLowerCase() && <ExchangeDeposit/>}
                        {state.action === EXCHANGE_ACTION.WITHDRAW.toLowerCase() && <ExchangeWithdraw/>}
                        {state.action === EXCHANGE_ACTION.TRANSFER.toLowerCase() && <ExchangeTransfer/>}
                        {state.action === EXCHANGE_ACTION.PORTFOLIO.toLowerCase() && <ExchangePortfolio/>}
                      </>
                }
            </div>
        </div>
    )
}

export default ExchangeWallet
