import { useMemo, useState, useEffect } from 'react'
import { formatNumber, formatTime } from 'redux/actions/utils'
import { FUTURES_RECORD_CODE } from './RecordTableTab'
import { customTableStyles } from './index'
import { ChevronDown } from 'react-feather'

import DataTable from 'react-data-table-component'
import FuturesTimeFilter from '../TimeFilter'
import fetchApi from 'utils/fetch-api'
import { API_GET_TRANSACTION_HISTORY } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'
import Skeletor from 'src/components/common/Skeletor'

const FuturesTxHistory = ({
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
                name: 'Type',
                selector: (row) => row?.type,
                cell: () => <span>Limit</span>,
                sortable: true,
            },
            {
                name: 'Amount',
                selector: (row) => row?.amount,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.amount,
                            pairConfig?.quotePrecision || 2,
                            0,
                            true
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Asset',
                selector: (row) => row?.asset,
                sortable: true,
            },
            {
                name: 'Symbol',
                selector: (row) => row?.symbol,
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
                url: API_GET_TRANSACTION_HISTORY,
                options: { method: 'GET' },
                params: { symbol: pairConfig?.symbol, ...filter },
            })

            if (status === ApiStatus.SUCCESS) {
                setDataSource(data)
            } else {
                setDataSource([])
            }
        } catch (e) {
        } finally {
            setTimeout(() => {
                setLoading(false)
                onForceUpdate()
            }, 2000)
        }
    }

    const category = [
        { id: 'ALL', name: 'All' },
        { id: 'TRANSFER', name: 'Chuyển tiền' },
        { id: 'WELCOME_BONUS', name: 'Bonus' },
        { id: 'REALIZED_PNL', name: 'Lợi nhuận' },
        { id: 'FUNDING_FEE', name: 'Funding Fee' },
        { id: 'COMMISSION', name: 'Hoa hồng' },
        { id: 'INSURANCE_CLEAR', name: 'Thanh lý' },
    ]

    return (
        <>
            <FuturesTimeFilter
                currentTimeRange={pickedTime}
                onChange={(pickedTime) =>
                    onChangeTimePicker(
                        FUTURES_RECORD_CODE.txHistory,
                        pickedTime
                    )
                }
                onFilter={onFilter}
                arrCate={category}
                onReset={() => { }}
            />
            {loading ? (
                <div className='px-[20px] mt-3'>
                    <Skeletor width={'100%'} height={30} />
                    <Skeletor width={'100%'} count={20} height={40} />
                </div>
            ) : (
                <DataTable
                    responsive
                    fixedHeader
                    data={dataSource.concat(dataSource)}
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
        amount: 27.8,
    },
    {
        id: 2,
        created_at: 1646607132000,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        type: 1,
        amount: 27.8,
    },
    {
        id: 3,
        created_at: 1646607132000,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        type: 1,
        amount: 27.8,
    },
]

export default FuturesTxHistory
