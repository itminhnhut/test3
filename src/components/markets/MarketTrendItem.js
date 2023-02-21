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

    // Init Pairs Price
    const _ = initMarketWatchItem(pair, false)

    return (
        <Link href={`trade/${_.baseAsset}-${_.quoteAsset}`}>
            <a style={{ ...style }}>
                <MCard addClass="md:max-w-[335px] select-none hover:border-green-3 hover:shadow-card_light dark:hover-shadow-none dark:hover:border-teal">
                    <div className="flex items-center justify-between ">
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
