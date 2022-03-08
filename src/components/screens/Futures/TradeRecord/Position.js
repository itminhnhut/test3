import { useMemo, useEffect } from 'react'
import { formatNumber, getPriceColor } from 'redux/actions/utils'
import { customTableStyles } from './index'
import { ChevronDown, Edit } from 'react-feather'

import FuturesRecordSymbolItem from './SymbolItem'
import DataTable from 'react-data-table-component'
import classNames from 'classnames'
import colors from 'styles/colors'

const FuturesPosition = ({ pairConfig }) => {
    const columns = useMemo(
        () => [
            {
                name: 'Symbol',
                selector: (row) => row?.symbol.pair,
                cell: (row) => (
                    <div className='flex items-center'>
                        <div
                            className={classNames('mr-2 h-[40px] w-[2px]', {
                                'bg-red': row?.side === 'SELL',
                                'bg-dominant': row?.side === 'BUY',
                            })}
                        />
                        <FuturesRecordSymbolItem
                            symbol={row?.symbol?.pair}
                            leverage='10x'
                        />
                    </div>
                ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Size',
                selector: (row) => row?.size,
                cell: (row) => (
                    <span
                        className={classNames({
                            'text-dominant': row?.size > 0,
                            'text-red': row?.size < 0,
                        })}
                    >
                        {formatNumber(
                            row?.size,
                            pairConfig?.quotePrecision || 2,
                            0,
                            true
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Entry Price',
                selector: (row) => row?.entryPrice,
                sortable: true,
            },
            {
                name: 'Mark Price',
                selector: (row) => row?.markPrice,
                sortable: true,
            },
            {
                name: 'Liq Price',
                selector: (row) => row?.liqPrice,
                sortable: true,
            },
            {
                name: 'Margin Ratio',
                selector: (row) => row?.marginRatio,
                cell: (row) => <span>{row?.marginRatio}%</span>,
                sortable: true,
            },
            {
                name: 'Margin',
                selector: (row) => row?.year,
                cell: (row) => (
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
                cell: (row) => (
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
                cell: (row) => (
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
                cell: (row) => (
                    <div className='flex items-center'>
                        <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                            <div>{row?.tpslForPosition?.[0]}/</div>
                            <div>{row?.tpslForPosition?.[1]}</div>
                        </div>
                        <Edit className='ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60' />
                    </div>
                ),
                sortable: true,
            },
        ],
        []
    )

    return (
        <DataTable
            responsive
            fixedHeader
            sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
            data={data}
            columns={columns}
            customStyles={customTableStyles}
        />
    )
}

const data = [
    {
        id: 1,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        side: 'SELL',
        size: -58.26262626262626262626,
        entryPrice: 3082.87,
        markPrice: 3065.87,
        liqPrice: 7996.57,
        marginRatio: 0.31,
        margin: { value: 5.83, mode: 'Cross' },
        pnl: { value: 0.32, roe: 5.57 },
        closeAllPosition: [3066.47, 0.019],
        tpslForPosition: [44000.0, 41900.0],
    },
    {
        id: 2,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        side: 'BUY',
        size: -58.26,
        entryPrice: 3082.87,
        markPrice: 3065.87,
        liqPrice: 7996.57,
        marginRatio: 0.31,
        margin: { value: 5.83, mode: 'Isolated' },
        pnl: { value: -0.32, roe: -5.57 },
        closeAllPosition: [3066.47, 0.019],
        tpslForPosition: [44000.0, 41900.0],
    },
    {
        id: 3,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        side: 'BUY',
        size: -58.26,
        entryPrice: 3082.87,
        markPrice: 3065.87,
        liqPrice: 7996.57,
        marginRatio: 0.5,
        margin: { value: 5.83, mode: 'Isolated' },
        pnl: { value: -0.32, roe: -5.57 },
        closeAllPosition: [3066.47, 0.019],
        tpslForPosition: [44000.0, 41900.0],
    },
    {
        id: 4,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        side: 'BUY',
        size: -58.26,
        entryPrice: 3082.87,
        markPrice: 3065.87,
        liqPrice: 7996.57,
        marginRatio: 0.31,
        margin: { value: 5.83, mode: 'Isolated' },
        pnl: { value: 0.32, roe: 5.57 },
        closeAllPosition: [3066.47, 0.019],
        tpslForPosition: [44000.0, 41900.0],
    },
    {
        id: 5,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        side: 'SELL',
        size: -58.26,
        entryPrice: 3082.87,
        markPrice: 3065.87,
        liqPrice: 7996.57,
        marginRatio: 0.31,
        margin: { value: 5.83, mode: 'Isolated' },
        pnl: { value: 0.32, roe: 5.57 },
        closeAllPosition: [3066.47, 0.019],
        tpslForPosition: [44000.0, 41900.0],
    },
    {
        id: 6,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        side: 'BUY',
        size: -58.26,
        entryPrice: 3082.87,
        markPrice: 3065.87,
        liqPrice: 7996.57,
        marginRatio: 0.31,
        margin: { value: 5.83, mode: 'Isolated' },
        pnl: { value: 0.32, roe: 5.57 },
        closeAllPosition: [3066.47, 0.019],
        tpslForPosition: [44000.0, 41900.0],
    },
    {
        id: 7,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        side: 'SELL',
        size: -58.26,
        entryPrice: 3082.87,
        markPrice: 3065.87,
        liqPrice: 7996.57,
        marginRatio: 0.31,
        margin: { value: 5.83, mode: 'Isolated' },
        pnl: { value: 0.32, roe: 5.57 },
        closeAllPosition: [3066.47, 0.019],
        tpslForPosition: [44000.0, 41900.0],
    },
]

export default FuturesPosition
