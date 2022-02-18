import {
    memo,
    useCallback,
    useMemo,
    useState,
    useEffect,
    useRef,
    createRef,
} from 'react'
import { formatNumber } from 'redux/actions/utils'
import { ChevronDown } from 'react-feather'
import { roundTo } from 'round-to'

import FuturesPairDetailItem from './PairDetailItem'
import FuturesPairList from '../PairList'
import InfoSlider from 'components/markets/InfoSlider'
import { useRouter } from 'next/router'

const FuturesPairDetail = ({
    pairPrice,
    pairConfig,
    markPrice,
    forceUpdateState,
}) => {
    // ? Xử lí minW để khi giá thay đổi, giao diện này sẽ không bị xê dịch.
    // ? Nguyên nhân: Font sida (;_;)
    const [itemsPriceMinW, setItemsPriceMinW] = useState(0)
    const [lastPriceMinW, setLastPriceMinW] = useState(0)

    const router = useRouter()

    // ? Helper
    const itemsPriceRef = useRef()
    const lastPriceRef = useRef()
    const pricePrecision = useMemo(
        () => pairConfig?.pricePrecision || 0,
        [pairConfig?.pricePrecision]
    )

    // ? Render lastPrice
    const renderLastPrice = useCallback(() => {
        return (
            <div
                ref={lastPriceRef}
                style={{ minWidth: lastPriceMinW }}
                className='ml-6 font-bold text-center text-sm text-dominant dragHandleArea tracking-wide'
            >
                {formatNumber(
                    roundTo(pairPrice?.lastPrice || 0, pricePrecision),
                    pricePrecision,
                    lastPriceMinW !== undefined ? 0 : pricePrecision
                )}
            </div>
        )
    }, [pairPrice?.lastPrice, pricePrecision, lastPriceMinW])

    // ? Render markPrice
    const renderMarkPrice = useCallback(() => {
        return (
            <FuturesPairDetailItem
                containerClassName='pr-4'
                label='Mark'
                value={formatNumber(
                    roundTo(markPrice?.markPrice || 0, pricePrecision),
                    pricePrecision,
                    itemsPriceMinW !== undefined ? 0 : pricePrecision
                )}
            />
        )
    }, [markPrice?.markPrice, pricePrecision, itemsPriceMinW])

    // ? Render indexPrice
    const renderIndexPrice = useCallback(
        () => (
            <FuturesPairDetailItem
                containerClassName='pr-4'
                label='Index'
                value={formatNumber(
                    roundTo(markPrice?.indexPrice || 0, pricePrecision),
                    pricePrecision
                )}
            />
        ),
        [markPrice?.indexPrice, pricePrecision]
    )

    // ? Render 24h High
    const render24hHigh = useCallback(() => {
        return (
            <FuturesPairDetailItem
                containerClassName='pr-4'
                label='24h High'
                value={formatNumber(
                    roundTo(pairPrice?.highPrice || 0, pricePrecision),
                    pricePrecision
                )}
            />
        )
    }, [pairPrice?.highPrice, pricePrecision])

    // ? Render 24h Low
    const render24hLow = useCallback(() => {
        return (
            <FuturesPairDetailItem
                containerClassName='pr-4'
                label='24h Low'
                value={formatNumber(
                    roundTo(pairPrice?.lowPrice || 0, pricePrecision),
                    pricePrecision
                )}
            />
        )
    }, [pairPrice?.lowPrice, pricePrecision])

    // ? Render baseAsset Traded Volume
    const renderTradedBaseAssetVolume = useCallback(() => {
        return (
            <FuturesPairDetailItem
                containerClassName='pr-4'
                label={`24h Volume (${pairPrice?.baseAsset})`}
                value={formatNumber(
                    roundTo(pairPrice?.baseAssetVolume || 0, 3),
                    3
                )}
            />
        )
    }, [pairPrice?.baseAssetVolume, pairPrice?.baseAsset])

    // ? Render quoteAsset Traded Volume
    const renderTradedQuoteAssetVolume = useCallback(() => {
        return (
            <FuturesPairDetailItem
                containerClassName='pr-4'
                label={`24h Volume (${pairPrice?.quoteAsset})`}
                value={formatNumber(
                    roundTo(pairPrice?.quoteAssetVolume || 0, 3),
                    3
                )}
            />
        )
    }, [pairPrice?.quoteAssetVolume, pairPrice?.quoteAsset])

    useEffect(() => {
        setItemsPriceMinW(undefined)
        setLastPriceMinW(undefined)
    }, [pairPrice?.symbol])

    useEffect(() => {
        if (
            router.query?.pair === pairPrice?.symbol &&
            lastPriceMinW === undefined &&
            lastPriceRef.current &&
            pairPrice &&
            pairPrice?.lastPrice
        ) {
            console.log('Re-calculate lastPrice Width')
            setLastPriceMinW(lastPriceRef.current?.clientWidth + 6 || 0)
        }
    }, [
        router.query,
        pairPrice?.symbol,
        pairPrice,
        lastPriceRef,
        lastPriceMinW,
    ])

    useEffect(() => {
        if (
            router.query?.pair === pairPrice?.symbol &&
            itemsPriceMinW === undefined &&
            itemsPriceRef.current &&
            markPrice &&
            markPrice?.markPrice
        ) {
            console.log(
                'Re-calculate itemsPrice Width ',
                itemsPriceRef?.current?.clientWidth,
                markPrice?.markPrice
            )
            setItemsPriceMinW(itemsPriceRef?.current?.clientWidth + 6 || 0)
        }
    }, [
        router.query,
        pairPrice?.symbol,
        markPrice,
        itemsPriceRef,
        itemsPriceMinW,
    ])

    return (
        <div className='h-full pl-5 flex items-center'>
            {/* Pair */}
            <div className='relative group cursor-pointer'>
                <div className='relative z-10 flex items-center font-bold text-[18px]'>
                    {pairPrice?.symbol}
                    <ChevronDown
                        size={16}
                        className='mt-1 ml-2 transition-transform duration-75 group-hover:rotate-180'
                    />
                </div>
                <div className='relative z-10 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    Perpetual
                </div>
                <div className='hidden group-hover:block absolute z-30 left-0 top-full'>
                    <FuturesPairList />
                </div>
            </div>

            {/* Price */}
            {renderLastPrice()}

            {/* Details */}
            <InfoSlider forceUpdateState={forceUpdateState} className='ml-2'>
                <div
                    ref={itemsPriceRef}
                    style={{ minWidth: itemsPriceMinW || 0 }}
                >
                    {renderMarkPrice()}
                </div>
                <div style={{ minWidth: itemsPriceMinW || 0 }}>
                    {renderIndexPrice()}
                </div>

                <div style={{ minWidth: itemsPriceMinW || 0 }}>
                    <FuturesPairDetailItem
                        label='Funding/Countdown'
                        containerClassName='pr-4'
                        value='-0.0062% 02:51:55'
                    />
                </div>

                <div style={{ minWidth: itemsPriceMinW || 0 }}>
                    <FuturesPairDetailItem
                        label='24h Change'
                        containerClassName='pr-4'
                        value='43,141.3'
                    />
                </div>

                <div style={{ minWidth: itemsPriceMinW || 0 }}>
                    {render24hHigh()}
                </div>

                <div style={{ minWidth: itemsPriceMinW || 0 }}>
                    {render24hLow()}
                </div>

                <div style={{ minWidth: itemsPriceMinW || 0 }}>
                    {renderTradedBaseAssetVolume()}
                </div>

                <div style={{ minWidth: itemsPriceMinW || 0 }}>
                    {renderTradedQuoteAssetVolume()}
                </div>
            </InfoSlider>
        </div>
    )
}

export default FuturesPairDetail
