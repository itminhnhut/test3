import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { formatNumber, getDecimalScale, secondToMinutesAndSeconds, Countdown, getS3Url } from 'redux/actions/utils';
import { usePrevious } from 'react-use';
import { ChevronDown } from 'react-feather';
import { roundTo } from 'round-to';

import FuturesPairDetailItem from './PairDetailItem';
import FuturesPairList from '../PairList';
import InfoSlider from 'components/markets/InfoSlider';
import classNames from 'classnames';
import Modal from 'components/common/ReModal';

const FuturesPairDetail = ({
    pairPrice,
    markPrice,
    pairConfig,
    forceUpdateState,
    isVndcFutures,
    isAuth
}) => {
    // ? Xử lí minW để khi giá thay đổi, giao diện này sẽ không bị xê dịch.
    // ? Nguyên nhân: Font sida (;_;)
    const [itemsPriceMinW, setItemsPriceMinW] = useState(0)
    const [lastPriceMinW, setLastPriceMinW] = useState(0)

    const [activePairList, setActivePairList] = useState(false)
    const [pairListMode, setPairListMode] = useState('')

    const router = useRouter()
    const { t } = useTranslation()

    // ? Helper
    const itemsPriceRef = useRef()
    const lastPriceRef = useRef()
    const pairListRef = useRef()
    const prevLastPrice = usePrevious(pairPrice?.lastPrice)

    // ? Memmoized Var
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
                className={classNames(
                    'ml-6 font-bold text-center text-sm text-dominant dragHandleArea tracking-wide',
                    { '!text-red': pairPrice?.lastPrice < prevLastPrice }
                )}
            >
                {formatNumber(
                    roundTo(pairPrice?.lastPrice || 0, pricePrecision),
                    pricePrecision,
                    lastPriceMinW !== undefined ? 0 : pricePrecision
                )}
            </div>
        )
    }, [pairPrice?.lastPrice, pricePrecision, lastPriceMinW, prevLastPrice])

    // ? Render markPrice
    const renderMarkPrice = useCallback(() => {
        return (
            <FuturesPairDetailItem
                containerClassName=''
                label={t('futures:mark_price')}
                value={formatNumber(
                    roundTo(markPrice?.markPrice || 0, pricePrecision),
                    pricePrecision,
                    itemsPriceMinW !== undefined ? 0 : pricePrecision
                )}
            />
        )
    }, [markPrice?.markPrice, pricePrecision, itemsPriceMinW])

    const renderMarkPriceItems = useCallback(() => {
        return MARK_PRICE_ITEMS.map((mark) => {
            const { key, code, localized: localizedPath } = mark
            let minWidth = itemsPriceMinW || 0
            let value = null
            let localized = t(localizedPath)

            switch (code) {
                case 'indexPrice':
                    value = formatNumber(
                        roundTo(markPrice?.indexPrice || 0, pricePrecision),
                        pricePrecision
                    )
                    break
                case 'fundingCountdown':
                    const rateWidth =
                        markPrice?.fundingRate?.toString()?.length +
                        getDecimalScale(markPrice?.fundingRate) *
                        TEXT_XS_WIDTH_PER_LETTER || 0
                    const timerWidth = TEXT_XS_WIDTH_PER_LETTER * 8

                    value = (
                        <div className='w-[90%] flex items-center justify-between'>
                            <div
                                style={{
                                    minWidth: rateWidth,
                                }}
                                className={classNames({
                                    'text-red': !!markPrice?.fundingRate,
                                })}
                            >
                                {formatNumber(
                                    markPrice?.fundingRate * 100,
                                    4,
                                    4,
                                    true
                                )}
                                %
                            </div>
                            <div className='ml-4'>
                                {markPrice?.nextFundingTime
                                    ? secondToMinutesAndSeconds(
                                        (markPrice?.nextFundingTime -
                                            Date.now()) *
                                        0.001
                                    ).toString()
                                    : '--:--'}
                            </div>
                        </div>
                    )
                    minWidth = rateWidth + timerWidth + 18
                    break
                default:
                    return null
            }

            return (
                <div key={`markPrice_items_${key}`} style={{ minWidth }}>
                    <FuturesPairDetailItem
                        containerClassName=''
                        label={localized}
                        value={value}
                    />
                </div>
            )
        })
    }, [markPrice, pricePrecision, itemsPriceMinW])

    const renderPairPriceItems = useCallback(() => {
        return PAIR_PRICE_DETAIL_ITEMS.map((detail) => {
            const { key, code, localized: localizedPath, icon } = detail

            let minWidth = itemsPriceMinW || 0
            let value = null,
                className = ''
            let localized = t(localizedPath)

            switch (code) {
                case 'fundingCountdown':
                    value = <div><span>{pairPrice?.fundingRate ? formatNumber(pairPrice?.fundingRate * 100, 4, 0, true) : 0}%</span> / <Countdown date={pairPrice?.fundingTime} /></div>
                    break
                case '24hHigh':
                    value = formatNumber(
                        roundTo(pairPrice?.highPrice || 0, pricePrecision),
                        pricePrecision
                    )
                    break
                case '24hLow':
                    value = formatNumber(
                        roundTo(pairPrice?.lowPrice || 0, pricePrecision),
                        pricePrecision
                    )
                    break
                case '24hChange':
                    const changeWidth =
                        pairPrice?.priceChange?.toString()?.length +
                        pricePrecision * TEXT_XS_WIDTH_PER_LETTER || 0;
                    const _priceChangeVndc = pairPrice?.lastPrice - pairPrice?.priceChange;
                    value = (
                        <div className='flex items-center'>
                            <div
                                className={classNames('pl-2 text-dominant', {
                                    '!text-red':
                                        pairPrice?.priceChangePercent < 0,
                                })}
                            >
                                {formatNumber(
                                    roundTo(
                                        pairPrice?.priceChangePercent * 100 || 0,
                                        2
                                    ),
                                    2,
                                    2,
                                    true
                                )}
                                %
                            </div>
                        </div>
                    )
                    minWidth = itemsPriceMinW + 36
                    break
                case 'bestBid':
                    minWidth = itemsPriceMinW + 41
                    value = <div className="text-red">{formatNumber(pairPrice?.bid, pricePrecision, 0, true)}</div>
                    break
                case 'bestAsk':
                    minWidth = itemsPriceMinW + 41
                    value = <div className="text-dominant">{formatNumber(pairPrice?.ask, pricePrecision, 0, true)}</div>
                    break
                // case '24hBaseVolume':
                //     localized += ` (${pairPrice?.baseAsset})`
                //     minWidth = itemsPriceMinW + 41
                //     value = formatNumber(
                //         roundTo(pairPrice?.baseAssetVolume || 0, 3),
                //         3
                //     )
                //     break
                // case '24hQuoteVolume':
                //     localized += ` (${pairPrice?.quoteAsset})`
                //     minWidth = itemsPriceMinW + 50
                //     value = formatNumber(
                //         roundTo(pairPrice?.quoteAssetVolume || 0, 3),
                //         3
                //     )
                //     break
                default:
                    return null
            }

            return (
                <div
                    key={`pairPrice_items_${key}`}
                    style={{ minWidth: minWidth || 0 }}
                >
                    <FuturesPairDetailItem
                        label={localized}
                        containerClassName={`${className} mr-5`}
                        value={value}
                        icon={icon}
                    />
                </div>
            )
        })
    }, [pairPrice, itemsPriceMinW, pricePrecision, isVndcFutures])

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
            setItemsPriceMinW((itemsPriceRef?.current?.clientWidth || 20) + 24)
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
            <div
                className='group relative cursor-pointer'
                onMouseOver={() => setActivePairList(true)}
                onMouseLeave={() => setActivePairList(false)}
            >
                <div className='relative z-10 flex items-center font-bold text-[18px]'>
                    {pairPrice?.baseAsset ? pairPrice?.baseAsset + '/' + pairPrice?.quoteAsset : '-/-'}
                    <ChevronDown
                        size={16}
                        className={classNames(
                            'mt-1 ml-2 transition-transform duration-75',
                            { 'rotate-180': activePairList }
                        )}
                    />
                </div>
                <div className='relative z-10 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('futures:tp_sl:perpetual')}
                </div>
                {/* { && ( */}
                <div
                    className='hidden group-hover:block absolute z-30 left-0 top-full'
                    ref={pairListRef}
                >
                    <FuturesPairList
                        mode={pairListMode}
                        setMode={setPairListMode}
                        isAuth={isAuth}
                        activePairList={activePairList}
                    />
                </div>
                {/* )} */}
            </div>

            {/* Price */}
            {renderLastPrice()}

            {/* Details */}
            <InfoSlider forceUpdateState={forceUpdateState} className='ml-2'>
                {renderPairPriceItems()}
            </InfoSlider>
        </div>
    )
}

const TEXT_XS_WIDTH_PER_LETTER = 6.7

const MARK_PRICE_ITEMS = [
    // { key: 0, code: 'markPrice', localized: 'futures:mark_price' },
    { key: 1, code: 'indexPrice', localized: 'futures:index_price' },
    {
        key: 2,
        code: 'fundingCountdown',
        localized: 'futures:funding_countdown',
    },
]


const PopoverFunding = () => {
    const { t } = useTranslation()
    const [showModal, setShowModal] = useState(false)

    const onClose = () => {
        setShowModal(false)
    }

    const onRedirect = () => {
        window.open('/futures/funding-history')
    }

    return (
        <>
            <div className="cursor-pointer min-w-[10px]" onClick={() => setShowModal(true)}>
                <img src={getS3Url('/images/icon/ic_help.png')} height={10} width={10} />
            </div>
            <Modal isVisible={showModal} onBackdropCb={onClose} containerClassName="max-w-[342px]"
            >
                <div className="font-semibold">{t('futures:funding_countdown')}</div>
                <div className="text-gray4 text-sm pt-4"> {t('futures:funding_rate_des')} <span className="text-teal font-semibold cursor-pointer">{t('common:read_more')}</span></div>
                <div onClick={onRedirect} className="bg-teal pd-[10px] text-center w-full text-sm font-semibold cursor-pointer rounded-md mt-4 h-11 flex items-center justify-center">{t('futures:funding_history')}</div>
            </Modal>
        </>
    )
}

const PAIR_PRICE_DETAIL_ITEMS = [
    { key: 2, code: 'fundingCountdown', localized: 'futures:funding_countdown', icon: <PopoverFunding /> },
    { key: 3, code: '24hChange', localized: 'futures:24h_change' },
    { key: 4, code: 'bestBid', localized: 'futures:best_bid' },
    { key: 5, code: 'bestAsk', localized: 'futures:best_ask' },
    { key: 6, code: '24hHigh', localized: 'futures:24h_high' },
    { key: 7, code: '24hLow', localized: 'futures:24h_low' },
    { key: 8, code: '24hBaseVolume', localized: 'futures:24h_volume' },
    { key: 9, code: '24hQuoteVolume', localized: 'futures:24h_volume' },
]


export default FuturesPairDetail
