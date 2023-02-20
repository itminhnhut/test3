import AssetLogo from 'src/components/wallet/AssetLogo';
import MCard from 'src/components/common/MCard';
import colors from 'styles/colors';
import Link from 'next/link';

import { initMarketWatchItem, sparkLineBuilder } from 'src/utils';
import { memo, useState } from 'react';
import { formatCurrency, formatPrice, render24hChange } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';

import 'react-loading-skeleton/dist/skeleton.css';
import Skeletor from 'components/common/Skeletor';

const MarketTrendItem = memo(({ loading, pair, style = {} }) => {
    // Init State
    const [state, set] = useState({
        ticker: null,
        sparkLineURL: null
    })
    const setState = (state) => set(prevState => ({ ...prevState, ...state }))

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
            <a style={{ ...style }}>
                <MCard addClass="md:max-w-[335px] select-none lg:hover:border-teal">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {(!pair) ?
                                <Skeletor
                                    circle
                                    width={32}
                                    height={32}
                                    containerClassName="avatar-skeleton"
                                />
                                : <AssetLogo assetCode={_?.baseAsset} size={32} />
                            }

                            <div className="ml-2 font-medium text-base">
                                {(!pair) ?
                                    <Skeletor width={100} />
                                    : <>
                                        <span className="text-txtPrimary dark:text-txtPrimary-dark">{_?.baseAsset}</span><span className="text-txtSecondary dark:text-txtSecondary-dark">/{_?.quoteAsset}</span>
                                    </>}
                            </div>
                        </div>
                        <div className="text-xs font-normal">
                            {(!pair) ? <Skeletor width={65} /> : render24hChange(pair, false)}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <div className={'text-base font-semibold ' + (_?.up ? 'text-teal'
                                : 'text-red')}>
                                {(!pair) ? <Skeletor width={65} /> : formatPrice(_.lastPrice)}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-normal text-txtSecondary dark:text-txtSecondary-dark">
                                    {(!pair) ? <Skeletor width={88} />
                                        : <>
                                            {language === LANGUAGE_TAG.VI ? 'KL' : 'Vol'} ${formatCurrency(_.volume24h, 0)}
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="w-[95px] xl:w-[65px]">
                            {(!pair) ?
                                <Skeletor width={60} height={28} />
                                : <img src={sparkLineBuilder(_?.symbol, _?.up ? colors.teal : colors.red2)}
                                    alt="Nami Exchange" />
                            }
                        </div>
                    </div>
                </MCard>
            </a>
        </Link>
    )
})

export default MarketTrendItem
