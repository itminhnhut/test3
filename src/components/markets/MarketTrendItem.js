import AssetLogo from 'components/wallet/AssetLogo'
import MCard from 'components/common/MCard'
import colors from 'styles/colors'
import Link from 'next/link'

import { initMarketWatchItem, sparkLineBuilder } from 'utils'
import { memo, useState } from 'react'
import { formatPrice, render24hChange } from 'redux/actions/utils'
import { useTranslation } from 'next-i18next'
import { LANGUAGE_TAG } from 'hooks/useLanguage'

const MarketTrendItem = memo(({ pair, style = {} }) => {
    // Init State
    const [state, set] = useState({
        ticker: null,
        sparkLineURL: null
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    const { i18n: { language } } = useTranslation()

    // Socket
    // const publicSocket = useSelector(state => state.socket.publicSocket)

    // Init Pairs Price
    const _ = initMarketWatchItem(pair, false)

    // Helper
    // const listenerHandler = debounce(ticker => setState({ ticker }), 1000)

    // useEffect(() => {
    //     const event = `spot:mini_ticker:update:${_?.symbol}`
    //
    //     if (publicSocket && _ && _.symbol) {
    //         subscribeExchangeSocket(publicSocket, [{ socketString: 'mini_ticker', payload: _.symbol }])
    //         publicSocket.removeListener(event, listenerHandler);
    //         publicSocket.on(event, listenerHandler);
    //     }
    //     return () => {
    //         _?.symbol && unsubscribeExchangeSocket(publicSocket, _.symbol)
    //         publicSocket && publicSocket.removeListener(event, listenerHandler);
    //     }
    // }, [_, publicSocket])

    // useEffect(() => {
    //     log.d('Market Screen | Watch change ticker ', state.ticker)
    // }, [state.ticker])

    return (
        <Link href={`trade/${_.baseAsset}-${_.quoteAsset}`}>
            <a>
                <MCard addClass="md:max-w-[335px] select-none border border-transparent lg:hover:border-dominant">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <AssetLogo assetCode={_?.baseAsset} size={36}/>
                            <div className="ml-2"><span className="font-bold">{_?.baseAsset}</span>/{_?.quoteAsset}</div>
                        </div>
                        <div className="w-[95px] xl:w-[65px]">
                            <img src={sparkLineBuilder(_?.symbol, _?.up ? colors.teal : colors.red2)} alt="Nami Exchange"/>
                        </div>
                    </div>
                    <div className="mt-[12px] flex items-center justify-between">
                        <div className={_?.up ? 'text-[20px] 2xl:text-[24px] font-medium text-dominant'
                            : 'text-[20px] 2xl:text-[24px] font-medium text-red'}>
                            {formatPrice(_.lastPrice)}
                        </div>
                        <div className="text-[16px] font-medium">
                            {render24hChange(pair)}
                        </div>
                    </div>
                    <div className="mt-[12px] flex items-center justify-between">
                        {/*Reference Price*/}
                        {/*<div className="text-[14px]">*/}
                        {/*    $ --*/}
                        {/*</div>*/}
                        <div className="text-[14px]">
                            {language === LANGUAGE_TAG.VI ? 'KL' : 'Vol'} {formatPrice(_.volume24h)} {_?.quoteAsset}
                        </div>
                    </div>

                </MCard>
            </a>
        </Link>
    )
})

export default MarketTrendItem
