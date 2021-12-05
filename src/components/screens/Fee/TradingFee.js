import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import { formatNumber } from 'redux/actions/utils'
import { TrendingUp } from 'react-feather'
import { FEE_STRUCTURES, FEE_TABLE } from 'constants/constants'
import { API_GET_FUTURE_FEE_CONFIGS } from 'redux/actions/apis'
import { TRADING_MODE } from 'redux/actions/const'
import { ApiStatus } from 'redux/actions/const'
import { orderBy } from 'lodash'
import { PATHS } from 'constants/paths'

import Axios from 'axios'
import EstimateAsset from 'components/common/EstimateAsset'
import withTabLayout, { ROUTES } from 'components/common/layouts/withTabLayout'
import useWindowSize from 'hooks/useWindowSize'
import MCard from 'components/common/MCard'
import Link from 'next/link'
import Switcher from 'components/common/Switcher'
import TabItem, { TabItemComponent } from 'components/common/TabItem'
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable'
import Skeletor from 'components/common/Skeletor'
import SvgCrown from 'components/svg/SvgCrown'
import Empty from 'components/common/Empty'

const INITIAL_STATE = {
    useNami: false,
    tabIndex: 0,
    loading: false,
    vipLevel: 2,
    futuresFeeConfig: null,
    loadingFuturesFeeConfigs: false,
    currentFuturesFeePage: 1,

    // ...
}

const TradingFee = () => {
    // Init state
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    // Rdx
    const namiWallets = useSelector(state => state.wallet?.SPOT)?.['1']
    const allAssetConfigs = useSelector(state => state.utils?.assetConfig) || null

    const assetConfig = useMemo(() => {
        return allAssetConfigs?.find(item => item?.id === 1)
    }, [allAssetConfigs])

    // Use hooks
    const { t } = useTranslation()
    const { width } = useWindowSize()

    // Helper
    const onUseNami = () => setState({ useNami: !state.useNami })

    const getFuturesFeeConfigs = async () => {
        !state.futuresFeeConfig && setState({ loadingFuturesFeeConfigs: true })
        try {
            const { data } = await Axios.get(API_GET_FUTURE_FEE_CONFIGS)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ futuresFeeConfig: data.data })
            }
        } catch (e) {
            console.log(`Can't get futures fee config `, e)
        } finally {
            setState({ loadingFuturesFeeConfigs: false })
        }
    }

    // Render Handler
    const renderNamiAvailable = useCallback(() => {
        if (!namiWallets) return '--'

        const available = namiWallets?.value - namiWallets?.locked_value
        return (
            <span className="font-medium whitespace-nowrap">
                {available ? formatNumber(available, assetConfig?.assetDigit) : '0.0000'} NAMI
            </span>
        )
    }, [namiWallets, assetConfig])

    const renderFeeTab = useCallback(() => {
        return TRADING_FEE_TAB.map(tab => <TabItem key={`trading_fee_Tab__${tab.dataIndex}`}
                                                   title={tab.localized ? t(tab.localized, { action: 'Exchange' }) : tab.title}
                                                   active={tab.index === state.tabIndex}
                                                   onClick={() => setState({ tabIndex: tab.index })}
                                                   component={TabItemComponent.Div} />)
    }, [state.tabIndex, TRADING_FEE_TAB])

    const renderFuturesTableFee = useCallback(() => {
        let tableStatus

        const columns = [
            { key: 'symbol', dataIndex: 'symbol', title: t('common:pair'), width: 80, fixed: 'left', align: 'left' },
            { key: 'max_leverage', dataIndex: 'max_leverage', title: t('common:max_leverage'), width: 100, align: 'left' },
            { key: 'fee', dataIndex: 'fee', title: `${t('common:fee')} (${t('common:open')}/${t('common:close')})`, width: 100, align: 'left' },
            { key: 'fee_promote', dataIndex: 'fee_promote',
                title: <span> {t('common:fee')} NAMI
                    <span className="text-dominant ml-3">
                                ({t('common:open')}/{t('common:close')})
                            </span>
                        </span>,
                width: 100, align: 'left' },
        ]

        const dataFilter = state.futuresFeeConfig?.filter(e => {
            const quote = e?.name.substring(e?.name?.length - 4, e?.name.length)
            if (state.tabIndex === 1) {
                return quote === 'USDT'
            } else {
                return quote === 'VNDC'
            }
        })

        // console.log('namidev-DEBUG: FILTERED => ', dataFilter)

        const data = dataHandler({
            tabIndex: state.tabIndex,
            data: orderBy(dataFilter || state.futuresFeeConfig, ['name'], ['asc']),
            loading: state.loadingFuturesFeeConfigs
        })

        if (!data?.length) {
            tableStatus = <Empty/>
        }

        return (
            <ReTable
                // sort
                // defaultSort={{ key: 'symbol', direction: 'asc' }}
                useRowHover
                data={data}
                columns={columns}
                rowKey={item => item?.key}
                tableStatus={tableStatus}
                scroll={{ x: true }}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '992px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width <= 992,
                    noDataStyle: {
                        minHeight: '280px'
                    }
                }}
                paginationProps={{
                    current: state.currentFuturesFeePage,
                    pageSize: 10,
                    onChange: (currentFuturesFeePage) => setState({ currentFuturesFeePage })
                }}
            />
        )

    }, [
        state.tabIndex,
        state.loadingFuturesFeeConfigs,
        state.currentFuturesFeePage,
        width
    ])

    const renderExchangeTableFee = useCallback(() => {
        const columns = [
            { key: 'level', dataIndex: 'level', title: t('common:fee_level'), width: 80, fixed: 'left', align: 'left' },
            // { key: 'vol_30d', dataIndex: 'vol_30d', title: t('common:vol_trade_in', { duration: '30d' }), width: 100, align: 'left' },
            // { key: 'andor', dataIndex: 'andor', title: t('fee-structure:andor'), width: 100, align: 'left' },
            { key: 'nami_holding', dataIndex: 'nami_holding', title: 'NAMI', width: 100, align: 'left' },
            { key: 'maker_taker', dataIndex: 'maker_taker', title: 'Maker / Taker', width: 100, align: 'left' },
            { key: 'maker_taker_deducted', dataIndex: 'maker_taker_deducted',
                title: <span>
                            Maker / Taker
                            <span className="text-dominant ml-3">{t('fee-structure:use_asset_deduction', { asset: 'NAMI' })}</span>
                        </span>,
                width: 100, align: 'left' },
        ]
        const data = dataHandler({ tabIndex: state.tabIndex, data: FEE_TABLE, loading: false, utils: { currentLevel: state.vipLevel } })

        return (
            <ReTable
                useRowHover
                data={data}
                columns={columns}
                rowKey={item => item?.key}
                scroll={{ x: true }}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '992px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width <= 992,
                    noDataStyle: {
                        minHeight: '280px'
                    }
                }}
            />
        )
    }, [state.tabIndex])

    useEffect(() => {
        console.log('namidev-DEBUG: Fee State => ', state)
    }, [state])

    useEffect(() => {
      state.tabIndex !== 0 && getFuturesFeeConfigs()
    }, [state.tabIndex])

    return (
        <>
            <div className="flex flex-wrap items-center justify-between">
                <div className="t-common">
                    Your fee level <span className="text-dominant">VIP 0</span>
                </div>
                {width <= 475 && <div className="w-full"/>}
                <Link href="/">
                   <a className="flex items-center text-dominant text-sm hover:!underline" target="_blank">
                       <TrendingUp size={16} className="mr-2.5" /> How to upgrade level?
                   </a>
                </Link>
            </div>

            <MCard addClass="relative mt-5 px-4 py-6 lg:px-7 px-4 py-6 lg:py-8 text-sm">
                <div className="relative z-10 w-full flex flex-wrap">
                    <div className="w-full sm:w-1/2 xl:w-1/4">
                        <div className="font-medium mb-5">
                            <div>Exchange <span className="lowercase">{t('fee-structure:trading_fee_t')}</span></div>
                        </div>

                        <div className="flex items-center mb-4">
                            <Switcher active={state.useNami} onChange={onUseNami}/>
                            <span className="ml-3 font-medium text-txtSecondary dark:text-txtSecondary-dark">
                                Using <span className="text-dominant">NAMI</span> deduction ({FEE_STRUCTURES.EXCHANGE.DEDUCTION}% discount)
                            </span>
                        </div>

                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Maker</span>
                                <span>
                                    <span className="text-txtPrimary dark:text-txtPrimary-dark">{FEE_STRUCTURES.EXCHANGE.MAKER_TAKER.MAKER[0]}%</span>
                                    <span className="ml-1">{FEE_STRUCTURES.EXCHANGE.MAKER_TAKER.MAKER[1]}%</span>
                                </span>
                            </div>
                        </div>
                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Taker</span>
                                <span>
                                    <span className="text-txtPrimary dark:text-txtPrimary-dark">{FEE_STRUCTURES.EXCHANGE.MAKER_TAKER.TAKER[0]}%</span>
                                    <span className="ml-1">{FEE_STRUCTURES.EXCHANGE.MAKER_TAKER.TAKER[1]}%</span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 font-medium">
                            <span className="">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">Available: </span>
                                {renderNamiAvailable()}
                            </span>
                            <Link href={PATHS.EXCHANGE.SWAP.getSwapPair({ fromAsset: 'VNDC', toAsset: 'NAMI' })}>
                                <a className="text-dominant ml-5 whitespace-nowrap hover:!underline">{t('common:buy')} NAMI</a>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full mt-8 sm:mt-0 sm:w-1/2 xl:w-1/4">
                        <div className="font-medium mb-5">
                            <div>USDT Futures</div>
                        </div>

                        <div className="flex items-center mb-4">
                            <Switcher active={state.useNami} onChange={onUseNami}/>
                            <span className="ml-3 font-medium text-txtSecondary dark:text-txtSecondary-dark">
                                Using <span className="text-dominant">NAMI</span> deduction ({FEE_STRUCTURES.FUTURES.USDT.DEDUCTION}% discount)
                            </span>
                        </div>

                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Maker</span>
                                <span>
                                    <span className="text-txtPrimary dark:text-txtPrimary-dark">{FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.MAKER[0]}%</span>
                                    <span className="ml-1">{FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.MAKER[1]}%</span>
                                </span>
                            </div>
                        </div>
                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Taker</span>
                                <span>
                                    <span className="text-txtPrimary dark:text-txtPrimary-dark">{FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.TAKER[0]}%</span>
                                    <span className="ml-1">{FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.TAKER[1]}%</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-8 sm:w-1/2 xl:mt-0 xl:w-1/4">
                        <div className="font-medium mb-5">
                            <div>VNDC Futures</div>
                        </div>

                        <div className="flex items-center mb-4">
                            <Switcher active={state.useNami} onChange={onUseNami}/>
                            <span className="ml-3 font-medium text-txtSecondary dark:text-txtSecondary-dark">
                                Using <span className="text-dominant">NAMI</span> deduction ({FEE_STRUCTURES.FUTURES.VNDC.DEDUCTION}% discount)
                            </span>
                        </div>

                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Maker</span>
                                <span>
                                    <span className="text-txtPrimary dark:text-txtPrimary-dark">{FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.MAKER[0]}%</span>
                                    <span className="ml-1">{FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.MAKER[1]}%</span>
                                </span>
                            </div>
                        </div>
                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Taker</span>
                                <span>
                                    <span className="text-txtPrimary dark:text-txtPrimary-dark">{FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.TAKER[0]}%</span>
                                    <span className="ml-1">{FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.TAKER[1]}%</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center justify-center w-full mt-8 sm:mt-0 sm:w-1/2 xl:w-1/4">
                        <img className="-mt-4 max-w-[200px] h-auto"
                             src="/images/screen/fee-structure/pyramid.png"
                             alt="FEE STRUCTURE"/>
                    </div>
                </div>
            </MCard>

            <div className="t-common mt-10 mb-5">
                Fee Rate
            </div>

            <div className="flex items-center">
                {renderFeeTab()}
            </div>
            <MCard addClass="py-0 px-0 overflow-hidden">
                {state.tabIndex === 0 && renderExchangeTableFee()}
                {state.tabIndex !== 0 && renderFuturesTableFee()}
            </MCard>

            <div className="mt-6 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                “Taker” is an order that trades at a market price. “Maker” is an order that trades at a limited price.
                <Link href="/">
                    <a className="ml-3 text-dominant hover:!underline">{t('common:read_more')}</a>
                </Link>
            </div>

            <div className="mt-3 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                Refer friends to earn trading fees 20% kickback
                <Link href="/">
                    <a className="ml-3 text-dominant hover:!underline">{t('common:read_more')}</a>
                </Link>
            </div>
        </>
    )
}

const TRADING_FEE_TAB = [
    { index: 0, dataIndex: 'exchange', title: 'Exchange', localized: 'common:trade_action' },
    { index: 1, dataIndex: 'usdt_futures', title: 'USDT Futures' },
    { index: 2, dataIndex: 'vndc_futures', title: 'VNDC Futures' },
]

const dataHandler = (props) => {
    const { tabIndex, data, loading, utils } = props

    const result = []
    const skeleton = []
    let rowLoading = {}

    if (tabIndex === 0) {
        rowLoading = TRADING_FEE_ROW_LOADING
    } else {
        rowLoading = FUTURES_FEE_ROW_LOADING
    }

    if (loading) {
        for (let i = 0; i < 10; ++i) {
            skeleton.push({...rowLoading, key: `row_skeleton_${i}`})
        }
        console.log('namidev-DEBUG: skeleton loading ', skeleton)
        return skeleton
    }

    if (!Array.isArray(data) || !data || !data.length) return []

    switch (tabIndex) {
        case 0:
            data.forEach(d => {
                result.push({
                    key: `trading_fee__item__${d.level}`,
                    level: <span className="text-sm inline-flex items-center">
                        VIP {d.level} {utils?.currentLevel === d.level && <SvgCrown className="ml-2" size={16}/>}
                    </span>,
                    // vol_30d: <span className="text-sm">{d.vol_30d}</span>,
                    // andor: <span className="text-sm">{d.andor}</span>,
                    nami_holding: <span className="text-sm">{d.nami_holding}</span>,
                    maker_taker: <span className="text-sm">{d.maker_taker}</span>,
                    maker_taker_deducted: <span className="text-sm">{d.maker_taker_deducted}</span>,
                })
            })
            break
        case 1:
        case 2:
            data.forEach(d => {
                result.push({
                    key: `futures_fee__item__${d?.name}`,
                    symbol: <span className="text-sm">
                        <Link href={PATHS.FUTURES.TRADE.getPair(TRADING_MODE.FUTURES, { pair: d?.name })}>
                            <a className="text-dominant hover:!underline">{d?.name}</a>
                        </Link>
                    </span>,
                    max_leverage: <span className="text-sm">x{d?.max_leverage}</span>,
                    fee: <span className="text-sm">{d?.place_order_fee}% / {d?.close_order_fee}%</span>,
                    fee_promote: <span className="text-sm">{d?.place_order_fee_promote}% / {d?.close_order_fee_promote}%</span>,
                    [RETABLE_SORTBY]: {
                        symbol: d?.name,
                        max_leverage: d?.max_leverage,
                        fee: d?.place_order_fee,
                        fee_promote: d?.place_order_fee_promote
                    }
                })
            })
            break
        default:
    }

    return result
}

const FUTURES_FEE_ROW_LOADING = {
    symbol: <Skeletor width={65} />,
    max_leverage: <Skeletor width={65} />,
    fee: <Skeletor width={65} />,
    fee_promote: <Skeletor width={65} />
}

const TRADING_FEE_ROW_LOADING = {
    level: <Skeletor width={65} />,
    vol_30d: <Skeletor width={65} />,
    andor: <Skeletor width={65} />,
    nami_holding: <Skeletor width={65} />,
    maker_taker: <Skeletor width={65} />,
    maker_taker_deducted: <Skeletor width={65} />,
}

export default withTabLayout({ routes: ROUTES.FEE_STRUCTURE })(TradingFee)
