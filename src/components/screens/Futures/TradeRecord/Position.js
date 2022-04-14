import { useMemo, useState } from 'react'
import { API_GET_FUTURES_POSITION_ORDERS } from 'redux/actions/apis'
import {
    formatNumber,
    getPriceColor,
    getSymbolObject,
} from 'redux/actions/utils'
import { customTableStyles } from './index'
import { ChevronDown, Edit } from 'react-feather'
import { useAsync } from 'react-use'
import { capitalize } from 'lodash'

import FuturesRecordSymbolItem from './SymbolItem'
import FuturesEditSLTP from './EditSLTP'
import classNames from 'classnames'
import DataTable from 'react-data-table-component'
import Skeletor from 'components/common/Skeletor'
import colors from 'styles/colors'
import axios from 'axios'

const FuturesPosition = ({ pairConfig, isHideOthers, onForceUpdate }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [positionOrder, setPositionOrder] = useState([])
    const [currentOrder, setCurrentOrder] = useState(null)
    const [loading, setLoading] = useState(false)

    const onEditSltp = (order) => {
        setIsEdit(true)
        setCurrentOrder(order)
    }

    const onCloseEditSltp = () => {
        setIsEdit(false)
        setCurrentOrder(null)
    }

    const columns = useMemo(
        () => [
            {
                name: 'Symbol',
                selector: (row) => row?.symbol.pair,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={100} />
                    ) : (
                        <div className='flex items-center'>
                            <div
                                className={classNames('mr-2 h-[40px] w-[2px]', {
                                    'bg-red': row?.side === 'SHORT',
                                    'bg-dominant': row?.side === 'LONG',
                                })}
                            />
                            <FuturesRecordSymbolItem
                                symbol={row?.symbol?.pair}
                                leverage={`${row?.leverage}x`}
                            />
                        </div>
                    ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Size',
                selector: (row) => row?.size,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={100} />
                    ) : (
                        <span
                            className={classNames({
                                'text-dominant': row?.size > 0,
                                'text-red': row?.size < 0,
                            })}
                        >
                            {formatNumber(
                                row?.size,
                                pairConfig?.quantityPrecision || 2,
                                0,
                                true
                            )}{' '}
                            {row?.symbol?.baseAsset}
                        </span>
                    ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Entry Price',
                selector: (row) =>
                    loading ? <Skeletor width={65} /> : row?.entryPrice,
                sortable: true,
            },
            {
                name: 'Mark Price',
                selector: (row) =>
                    loading ? <Skeletor width={65} /> : row?.markPrice,
                sortable: true,
            },
            {
                name: 'Liq Price',
                selector: (row) =>
                    loading ? <Skeletor width={65} /> : row?.liqPrice,
                sortable: true,
            },
            {
                name: 'Margin Ratio',
                selector: (row) => row?.marginRatio,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={65} />
                    ) : (
                        <span>{row?.marginRatio}%</span>
                    ),
                sortable: true,
            },
            {
                name: 'Margin',
                selector: (row) => row?.year,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={65} />
                    ) : (
                        <div>
                            <div>
                                {row?.margin?.value} {row?.symbol?.quoteAsset}
                            </div>
                            <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                                ({row?.margin?.mode})
                            </div>
                        </div>
                    ),
                sortable: true,
            },
            {
                name: 'PNL (ROE%)',
                selector: (row) => row?.pnl?.value,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={65} />
                    ) : (
                        <div className='flex items-center'>
                            <div className={getPriceColor(row?.pnl?.value)}>
                                <div>
                                    {row?.pnl?.value > 0 ? '+' : ''}
                                    {row?.pnl?.value} {row?.symbol?.quoteAsset}
                                </div>
                                <div>
                                    ({row?.pnl?.roe > 0 ? '+' : ''}
                                    {row?.pnl?.roe})
                                </div>
                            </div>
                        </div>
                    ),
                sortable: true,
            },
            {
                name: 'Close All Position',
                cell: (row) =>
                    loading ? (
                        <Skeletor width={200} />
                    ) : (
                        <div className='flex items-center whitespace-nowrap'>
                            <div className='mr-3'>Market</div>
                            <div className='mr-3'>Limit</div>
                            <input
                                defaultValue={row?.closeAllPosition?.[0]}
                                className='mr-2 w-[60px] h-[24px] px-1 rounded-md bg-gray-5 dark:bg-darkBlue-4 font-medium'
                            />
                            <input
                                defaultValue={row?.closeAllPosition?.[1]}
                                className='w-[60px] h-[24px] px-1 rounded-md bg-gray-5 dark:bg-darkBlue-4 font-medium'
                            />
                        </div>
                    ),
                minWidth: '250px',
            },
            {
                name: 'TP/SL for Position',
                cell: (row) =>
                    loading ? (
                        <Skeletor width={65} />
                    ) : (
                        <div className='flex items-center'>
                            <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                                <div>{row?.tpslForPosition?.[0]}/</div>
                                <div>{row?.tpslForPosition?.[1]}</div>
                            </div>
                            <Edit
                                className='ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60'
                                onClick={() => onEditSltp(row)}
                            />
                        </div>
                    ),
                sortable: true,
            },
        ],
        [loading]
    )

    useAsync(async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(API_GET_FUTURES_POSITION_ORDERS, {
                params: {
                    symbol: isHideOthers ? pairConfig?.symbol : undefined,
                },
            })

            if (data?.status === 'ok') {
                const filtered = []

                data?.data &&
                    data.data.forEach((o) => {
                        if (+o?.positionAmt > 0) {
                            const symbolObj = getSymbolObject(o?.symbol)

                            filtered.push({
                                symbol: {
                                    pair: symbolObj?.symbol,
                                    baseAsset: symbolObj?.baseAsset,
                                    quoteAsset: symbolObj?.quoteAsset,
                                },
                                leverage: o?.leverage,
                                side: o?.positionSide,
                                size: formatNumber(
                                    +o?.positionAmt,
                                    pairConfig?.quantityPrecision,
                                    2,
                                    true
                                ),
                                entryPrice: formatNumber(
                                    +o?.entryPrice,
                                    pairConfig?.pricePrecision,
                                    2
                                ),
                                markPrice: formatNumber(
                                    +o?.markPrice,
                                    pairConfig?.pricePrecision,
                                    2
                                ),
                                liqPrice: formatNumber(
                                    +o?.liquidationPrice,
                                    pairConfig?.pricePrecision,
                                    2
                                ),
                                marginRatio: '--',
                                margin: {
                                    value: formatNumber(
                                        +o?.isolatedMargin,
                                        pairConfig?.pricePrecision
                                    ),
                                    mode: capitalize(o?.marginType),
                                },
                                pnl: {
                                    value: formatNumber(
                                        +o?.unRealizedProfit,
                                        pairConfig?.pricePrecision
                                    ),
                                    roe: '--',
                                },
                                closeAllPosition: [3066.47, 0.019],
                                tpslForPosition: [44000.0, 41900.0],
                            })
                        }
                    })

                setPositionOrder(filtered)
            } else {
                setPositionOrder([])
            }
        } catch (e) {
            console.log(`Can't get position orders: `, e)
        } finally {
            setLoading(false)
            onForceUpdate()
        }
    }, [isHideOthers, pairConfig?.symbol])

    return (
        <>
            <DataTable
                responsive
                fixedHeader
                sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                data={loading ? data : positionOrder}
                columns={columns}
                customStyles={customTableStyles}
                noDataComponent={
                    <div className='min-h-[200px] flex items-center justify-center'>
                        {/* Place graphics here if needed */}
                        <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                            No dataaaaaaaaa lorem ipsum
                        </div>
                    </div>
                }
            />
            <FuturesEditSLTP
                isVisible={isEdit}
                order={currentOrder}
                onClose={onCloseEditSltp}
            />
        </>
    )
}

const data = [
    {
        id: 1,
        symbol: { pair: '---', baseAsset: '---', quoteAsset: '---' },
        side: 'SELL',
        size: 0,
        entryPrice: 0,
        markPrice: 0,
        liqPrice: 0,
        marginRatio: 0,
        margin: { value: 0, mode: '---' },
        pnl: { value: 0, roe: 0 },
        closeAllPosition: [0, 0],
        tpslForPosition: [0, 0],
    },
    {
        id: 2,
        symbol: { pair: '---', baseAsset: '---', quoteAsset: '---' },
        side: 'SELL',
        size: 0,
        entryPrice: 0,
        markPrice: 0,
        liqPrice: 0,
        marginRatio: 0,
        margin: { value: 0, mode: '---' },
        pnl: { value: 0, roe: 0 },
        closeAllPosition: [0, 0],
        tpslForPosition: [0, 0],
    },
    {
        id: 3,
        symbol: { pair: '---', baseAsset: '---', quoteAsset: '---' },
        side: 'SELL',
        size: 0,
        entryPrice: 0,
        markPrice: 0,
        liqPrice: 0,
        marginRatio: 0,
        margin: { value: 0, mode: '---' },
        pnl: { value: 0, roe: 0 },
        closeAllPosition: [0, 0],
        tpslForPosition: [0, 0],
    },
    {
        id: 4,
        symbol: { pair: '---', baseAsset: '---', quoteAsset: '---' },
        side: 'SELL',
        size: 0,
        entryPrice: 0,
        markPrice: 0,
        liqPrice: 0,
        marginRatio: 0,
        margin: { value: 0, mode: '---' },
        pnl: { value: 0, roe: 0 },
        closeAllPosition: [0, 0],
        tpslForPosition: [0, 0],
    },
    {
        id: 5,
        symbol: { pair: '---', baseAsset: '---', quoteAsset: '---' },
        side: 'SELL',
        size: 0,
        entryPrice: 0,
        markPrice: 0,
        liqPrice: 0,
        marginRatio: 0,
        margin: { value: 0, mode: '---' },
        pnl: { value: 0, roe: 0 },
        closeAllPosition: [0, 0],
        tpslForPosition: [0, 0],
    },
    {
        id: 6,
        symbol: { pair: '---', baseAsset: '---', quoteAsset: '---' },
        side: 'SELL',
        size: 0,
        entryPrice: 0,
        markPrice: 0,
        liqPrice: 0,
        marginRatio: 0,
        margin: { value: 0, mode: '---' },
        pnl: { value: 0, roe: 0 },
        closeAllPosition: [0, 0],
        tpslForPosition: [0, 0],
    },
    {
        id: 7,
        symbol: { pair: '---', baseAsset: '---', quoteAsset: '---' },
        side: 'SELL',
        size: 0,
        entryPrice: 0,
        markPrice: 0,
        liqPrice: 0,
        marginRatio: 0,
        margin: { value: 0, mode: '---' },
        pnl: { value: 0, roe: 0 },
        closeAllPosition: [0, 0],
        tpslForPosition: [0, 0],
    },
]

export default FuturesPosition
