import { useMemo } from 'react'
import { formatNumber, formatTime, getPriceColor } from 'redux/actions/utils'
import { customTableStyles } from './index'
import { ChevronDown, Edit, Share2 } from 'react-feather'

import FuturesRecordSymbolItem from './SymbolItem'
import DataTable from 'react-data-table-component'

const FuturesOpenOrdersVndc = ({ pairConfig }) => {
    const columns = useMemo(
        () => [
            {
                name: 'Time',
                selector: (row) => row?.created_at,
                cell: (row) => (
                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                        {formatTime(row?.created_at)}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Symbol',
                selector: (row) => row?.symbol?.pair,
                cell: (row) => (
                    <FuturesRecordSymbolItem symbol={row?.symbol?.pair} />
                ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Type',
                selector: (row) => row?.type,
                cell: () => <span>Limit</span>,
                sortable: true,
            },
            {
                name: 'Side',
                selector: (row) => row?.side,
                cell: () => <span className='text-dominant'>BUY</span>,
                sortable: true,
            },
            {
                name: 'Entry Price',
                selector: (row) => row?.entryPrice,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.entryPrice,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Last Price',
                selector: (row) => row?.lastPrice,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.lastPrice,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
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
                        <Share2 size={16} className='ml-1' />
                    </div>
                ),
                sortable: true,
            },
            {
                name: 'TP/SL',
                cell: (row) => (
                    <div className='flex items-center'>
                        <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                            <div>{row?.tpsl?.[0]}/</div>
                            <div>{row?.tpsl?.[1]}</div>
                        </div>
                        <Edit className='ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60' />
                    </div>
                ),
                sortable: true,
            },
            {
                name: 'Close All Orders',
                cell: () => (
                    <div className='px-[28px] py-1 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                        Close
                    </div>
                ),
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
        key: 1,
        created_at: 1646607132000,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        type: 'Limit',
        side: 'Buy',
        entryPrice: 100000,
        lastPrice: 121000,
        pnl: { value: 0.32, roe: 5.57 },
        tpsl: [44000.0, 41900.0],
    },
    {
        key: 2,
        created_at: 1646607132000,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        type: 'Limit',
        side: 'Buy',
        entryPrice: 100000,
        lastPrice: 121000,
        pnl: { value: 0.32, roe: 5.57 },
        tpsl: [44000.0, 41900.0],
    },
    {
        key: 3,
        created_at: 1646607132000,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        type: 'Limit',
        side: 'Buy',
        entryPrice: 100000,
        lastPrice: 121000,
        pnl: { value: 0.32, roe: 5.57 },
        tpsl: [44000.0, 41900.0],
    },
]

export default FuturesOpenOrdersVndc
