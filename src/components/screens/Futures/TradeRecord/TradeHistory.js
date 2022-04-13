import { useMemo, useState, useEffect } from 'react'
import { formatNumber, formatTime } from 'redux/actions/utils'
import { FUTURES_RECORD_CODE } from './RecordTableTab'
import { customTableStyles } from './index'
import { ChevronDown } from 'react-feather'

import FuturesRecordSymbolItem from './SymbolItem'
import FuturesTimeFilter from '../TimeFilter'
import DataTable from 'react-data-table-component'
import fetchApi from 'utils/fetch-api'
import { API_GET_TRADE_HISTORY } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'
import Skeletor from 'src/components/common/Skeletor'

const FuturesTradeHistory = ({
    pickedTime,
    onChangeTimePicker,
    pairConfig,
    onForceUpdate,
}) => {
    const columns = useMemo(
        () => [
            {
                name: 'Time',
                selector: (row) => row?.time,
                cell: (row) => formatTime(row?.time, 'dd-MM-yyyy HH:mm:ss'),
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
                name: 'Quantity',
                selector: (row) => row?.quantity,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.quantity,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Fee',
                selector: (row) => row?.fee,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.fee,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Realized Profit',
                selector: (row) => row?.realizedProfit,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.realizedProfit,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
        ],
        []
    )

    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        onFilter()
    }, [])

    const onFilter = async (filter) => {
        setLoading(true)
        try {
            const { status, data } = await fetchApi({
                url: API_GET_TRADE_HISTORY,
                options: { method: 'GET' },
                params: { symbol: pairConfig?.symbol, ...filter },
            })

            if (status === ApiStatus.SUCCESS) {
                setDataSource(data)
            } else {
                setDataSource([])
            }
        } catch (e) {
            console.log(`Can't get swap history `, e)
        } finally {
            setLoading(false)
            onForceUpdate()
        }
    }

    return (
        <>
            <FuturesTimeFilter
                currentTimeRange={pickedTime}
                onChange={(pickedTime) =>
                    onChangeTimePicker(
                        FUTURES_RECORD_CODE.tradingHistory,
                        pickedTime
                    )
                }
                onFilter={onFilter}
            />
            {loading ? (
                <div className='px-[20px] mt-3'>
                    <div className='mb-[10px]'>
                        <Skeletor width={'100%'} />
                    </div>
                    <Skeletor width={'100%'} count={5} height={10} />
                </div>
            ) : (
                <DataTable
                    responsive
                    fixedHeader
                    data={dataSource}
                    columns={columns}
                    className='mt-3'
                    sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                    customStyles={customTableStyles}
                />
            )}
        </>
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
        quantity: 27.8,
        fee: 0.1032,
        realizedProfit: 0.1032,
    },
    {
        id: 2,
        created_at: 1646607132000,
        symbol: { pair: 'SLPUSDT', baseAsset: 'SLP', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        quantity: 27.8,
        fee: 0.1032,
        realizedProfit: 0.1032,
    },
    {
        id: 3,
        created_at: 1646607132000,
        symbol: { pair: 'AXSUSDT', baseAsset: 'AXS', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        quantity: 27.8,
        fee: 0.1032,
        realizedProfit: 0.1032,
    },
]

export default FuturesTradeHistory
