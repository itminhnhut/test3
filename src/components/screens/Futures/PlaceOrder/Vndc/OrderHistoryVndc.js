import React, { useMemo, useState, useEffect } from 'react'
import { customTableStyles } from '../../TradeRecord/index'
import {ChevronDown, Share2} from 'react-feather'

import DataTable from 'react-data-table-component'
import fetchApi from 'utils/fetch-api'
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'
import Skeletor from 'src/components/common/Skeletor'
import FuturesTimeFilter from '../../TimeFilter'
import { FUTURES_RECORD_CODE } from '../../TradeRecord/RecordTableTab'
import { formatTime, formatNumber, getPriceColor } from 'redux/actions/utils'
import { VndcFutureOrderType } from './VndcFutureOrderType';
import { useTranslation } from 'next-i18next'
import ShareFuturesOrder from "components/screens/Futures/ShareFuturesOrder";

const FuturesOrderHistoryVndc = ({ pairConfig, onForceUpdate, onChangeTimePicker, pickedTime, isAuth, onLogin }) => {
    const { t } = useTranslation()

    const columns = useMemo(() => [
        {
            name: 'ID',
            cell: (row) => loading ? <Skeletor width={65} /> : row?.displaying_id,
            sortable: true,
            selector: (row) => row?.displaying_id,
        },
        {
            name: 'Symbol',
            cell: (row) => loading ? <Skeletor width={65} /> : row?.symbol,
            sortable: true,
            selector: (row) => row?.symbol,
        },
        {
            name: 'Open at',
            selector: (row) => row?.opened_at,
            cell: (row) => loading ? <Skeletor width={65} /> : (
                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                    {formatTime(row?.opened_at)}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Close at',
            selector: (row) => row?.closed_at,
            cell: (row) => loading ? <Skeletor width={65} /> : (
                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                    {formatTime(row?.closed_at)}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Type',
            cell: (row) => loading ? <Skeletor width={65} /> : row?.type,
            selector: (row) => row?.type,
            sortable: true,
        },
        {
            name: 'Side',
            selector: (row) => row?.sdie,
            cell: (row) => loading ? <Skeletor width={65} /> : <span className={row?.side === VndcFutureOrderType.Side.BUY ? 'text-dominant' : 'text-red'}>{row?.side}</span>,
            sortable: true,
        },
        {
            name: 'Amount',
            cell: (row) => loading ? <Skeletor width={65} /> : row?.quantity ? formatNumber(row?.quantity, 8, 0, true) : '-',
            sortable: true,
        },
        {
            name: 'Open Price',
            cell: (row) => loading ? <Skeletor width={100} /> : row?.open_price ? formatNumber(row?.open_price, 0, 0, true) : '-',
            sortable: true,
        },
        {
            name: 'Close Price',
            cell: (row) => loading ? <Skeletor width={100} /> : row?.close_price ? formatNumber(row?.close_price, 0, 0, true) : '-',
            sortable: true,
        },
        {
            name: 'TP/SL',
            cell: (row) => loading ? <Skeletor width={100} /> : (
                <div className='flex items-center'>
                    <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                        <div>{formatNumber(row?.tp, 0, 0, true)}/</div>
                        <div>{formatNumber(row?.sl, 0, 0, true)}</div>
                    </div>
                </div>
            ),
            minWidth: '150px',
            sortable: true,
        },
        {
            name: 'Revenue',
            cell: (row) => loading ? <Skeletor width={100} /> : cellRenderRevenue(row),
            minWidth: '150px',
            sortable: true,
        },
        {
            name: 'Adjustment Details',
            cell: () => loading ? <Skeletor width={65} /> : (
                <div className='px-[12px] py-1 bg-bgPrimary dark:bg-bgPrimary-dark text-xs text-dominant border border-dominant rounded-[4px]'>
                    View details
                </div>
            ),
            sortable: true,
        },
    ], [loading]
    )
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [shareOrder, setShareOrder] = useState(null)

    useEffect(() => {
        getOrders();
    }, [])

    const getOrders = async (filter) => {
        setLoading(true)
        try {
            const { status, data } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method: 'GET' },
                params: {
                    status: 1,
                    pageSize: 20,
                    page: 0,
                    ...filter
                },
            })

            if (status === ApiStatus.SUCCESS) {
                setDataSource(data.orders)
            } else {
                setDataSource([])
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
            onForceUpdate()
        }
    }

    const cellRenderRevenue = (row) => {
        const profit = formatNumber(String(row?.profit).replace(',', ''), 0, 0, true)
        const percent = formatNumber((row?.profit / row?.margin), 2, 0, true);
        if (!row?.profit) return '-'
        return<div className='flex flex-row'>
            <div className={getPriceColor(Number(row?.profit))}>
                <div>
                    {profit} {pairConfig.quoteAsset}
                </div>
                <div>
                    ({percent > 0 ? '+' : ''}
                    {percent + '%'})
                </div>
            </div>
            <Share2 size={16} onClick={() => setShareOrder(row)} className='ml-1 cursor-pointer hover:opacity-60'/>
        </div>
    }

    if (!isAuth) return <div className="cursor-pointer flex items-center justify-center h-full">
        <div
            className='w-[200px] bg-dominant text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
            onClick={onLogin}
        >
            {t('futures:order_table:login_to_continue')}
        </div>
    </div>

    return (
        <>
            <ShareFuturesOrder isClosePrice isVisible={!!shareOrder} order={shareOrder} pairPrice={pairPrice} onClose={() => setShareOrder(null)}/>
            <FuturesTimeFilter
                currentTimeRange={pickedTime}
                onChange={(pickedTime) =>
                    onChangeTimePicker(
                        FUTURES_RECORD_CODE.orderHistoryVndc,
                        pickedTime
                    )}
                onFilter={getOrders}
            />
            <DataTable
                responsive
                fixedHeader
                sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                data={loading ? data : dataSource}
                columns={columns}
                customStyles={customTableStyles}
            />
        </>
    )
}

const data = [
    {
        id: 1,
    },
    {
        id: 2,
    },
    {
        id: 3,
    },
    {
        id: 4,
    },
    {
        id: 5,
    },
    {
        id: 6,
    },
]

export default FuturesOrderHistoryVndc
