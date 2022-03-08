import { useMemo } from 'react'
import { customTableStyles } from './index'
import { ChevronDown, X } from 'react-feather'
import { formatNumber, formatTime } from 'redux/actions/utils'

import FuturesRecordSymbolItem from './SymbolItem'
import DataTable from 'react-data-table-component'

const FuturesOpenOrders = ({ pairConfig }) => {
    const columns = useMemo(
        () => [
            {
                name: 'Time',
                selector: (row) => row?.created_at,
                cell: (row) =>
                    formatTime(row?.created_at, 'dd-MM-yyyy HH:mm:ss'),
                minWidth: '150px',
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
                name: 'Price',
                selector: (row) => row?.price,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.price,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Amount',
                selector: (row) => row?.amount,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.amount,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Filled',
                selector: (row) => row?.filled,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.filled,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Reduce Only',
                selector: (row) => row?.reduceOnly,
                cell: () => <span>Yes</span>,
                sortable: true,
            },
            {
                name: 'Post Only',
                selector: (row) => row?.postOnly,
                cell: () => <span>No</span>,
                sortable: true,
            },
            {
                name: 'Trigger Conditions',
                selector: (row) => row?.triggerConditions,
                cell: (row) => (
                    <div>
                        Mark Price
                        <div>{'>= 3,140.00'}</div>
                    </div>
                ),
                minWidth: '180px',
                sortable: true,
            },
            {
                name: 'TP/SL',
                selector: (row) => row?.tpsl,
                cell: () => <span className='text-dominant'>View</span>,
                sortable: true,
            },
            {
                name: 'Cancel All',
                cell: () => (
                    <span>
                        <X
                            strokeWidth={1}
                            size={16}
                            className='text-txtSecondary dark:text-txtSecondary-dark'
                        />
                    </span>
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
        id: 1,
        created_at: 1646607132000,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        amount: 27.8,
        filled: 0,
        reduceOnly: true,
        postOnly: false,
        triggerConditions: {},
        tpsl: 'View',
    },
    {
        id: 2,
        created_at: 1646607132000,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        amount: 27.8,
        filled: 0,
        reduceOnly: true,
        postOnly: false,
        triggerConditions: {},
        tpsl: 'View',
    },
    {
        id: 3,
        created_at: 1646607132000,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        amount: 27.8,
        filled: 0,
        reduceOnly: true,
        postOnly: false,
        triggerConditions: {},
        tpsl: 'View',
    },
]

export default FuturesOpenOrders
