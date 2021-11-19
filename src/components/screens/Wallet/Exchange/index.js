import { useEffect, useState } from 'react'
import { EXCHANGE_ACTION } from 'pages/wallet'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'

import ExchangeDeposit from 'components/screens/Wallet/Exchange/ExchangeDeposit'
import ExchangeWithdraw from 'components/screens/Wallet/Exchange/ExchangeWithdraw'
import ExchangeTransfer from 'components/screens/Wallet/Exchange/ExchangeTransfer'
import ExchangePortfolio from 'components/screens/Wallet/Exchange/ExchangePortfolio'
import colors from 'styles/colors'
import { useTranslation } from 'next-i18next'
import { Eye, EyeOff } from 'react-feather'
import { SECRET_STRING } from 'utils'
import MCard from 'components/common/MCard'
import useWindowSize from 'hooks/useWindowSize'

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
    const { t } = useTranslation()
    const { width } = useWindowSize()

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="t-common whitespace-nowrap">
                    {t('common:overview')}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center w-full mt-3 sm:mt-0 sm:w-auto">
                    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.PORTFOLIO}`}
                       className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[120px] md:w-[120px] lg:w-[150px]  mr-3.5 sm:mr-0 sm:ml-2 border border-dominant bg-dominant rounded-md font-medium text-xs xl:text-sm text-white hover:opacity-80 cursor-pointer whitespace-nowrap">
                        {t('common:portfolio')}
                    </a>
                    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.DEPOSIT}`}
                       className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                        {t('common:deposit')}
                    </a>
                    <div className="w-full h-[8px] sm:hidden"/>
                    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.WITHDRAW}`}
                       className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px]  mr-3.5 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                        {t('common:withdraw')}
                    </a>
                    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.TRANSFER}`}
                       className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                        {t('common:transfer')}
                    </a>
                </div>
            </div>
            <MCard addClass="mt-5 !p-6 xl:!p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center font-medium text-sm">
                            <div className="mr-2">{t('wallet:est_balance')}</div>
                            <div className="flex items-center text-txtSecondary dark:text-txtSecondary-dark cursor-pointer hover:opacity-80 select-none"
                                 onClick={() => setState({ hideAsset: !state.hideAsset })}>
                                {state.hideAsset ? <EyeOff size={16} className="mr-[4px]"/> : <Eye size={16} className="mr-[4px]"/>} {t('wallet:hide_asset')}
                            </div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="rounded-md bg-teal-lightTeal dark:bg-teal-5 min-w-[35px] min-h-[35px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center">
                                <img className="-ml-0.5" src="/images/icon/ic_wallet_2.png" height={width >= 768 ? '25' : '14'} width={width >= 768 ? '25' : '14'} alt=""/>
                            </div>
                            <div className="ml-3 md:ml-6 sm:flex items-center">
                                <div className="font-bold text-[24px] lg:text-[28px] xl:text-[36px] text-dominant flex flex-wrap">
                                    <span className="mr-1.5">{state.hideAsset ? SECRET_STRING : '0,085334734'}</span>
                                    <span>BTC</span>
                                </div>
                                <div className="font-medium text-sm lg:text-[16px] xl:text-[18px] mt-1 sm:mt-0 sm:ml-4">{state.hideAsset ? SECRET_STRING : '($59,983.45867)'}</div>
                            </div>
                        </div>

                    </div>
                    <div className="hidden md:block">
                        <img src="/images/screen/wallet/wallet_overview_grp.png" width="140" height="140" alt=""/>
                    </div>
                </div>
            </MCard>


            {/*<a href="/wallet/exchange?action=deposit" className={state.action === EXCHANGE_ACTION.DEPOSIT.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>*/}
            {/*    {EXCHANGE_ACTION.DEPOSIT}*/}
            {/*</a><br/>*/}
            {/*<a href="/wallet/exchange?action=withdraw" className={state.action === EXCHANGE_ACTION.WITHDRAW.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>*/}
            {/*    {EXCHANGE_ACTION.WITHDRAW}*/}
            {/*</a><br/>*/}
            {/*<a href="/wallet/exchange?action=transfer" className={state.action === EXCHANGE_ACTION.TRANSFER.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>*/}
            {/*    {EXCHANGE_ACTION.TRANSFER}*/}
            {/*</a><br/>*/}
            {/*<a href="/wallet/exchange?action=portfolio" className={state.action === EXCHANGE_ACTION.PORTFOLIO.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>*/}
            {/*    {EXCHANGE_ACTION.PORTFOLIO}*/}
            {/*</a>*/}

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
