import { useMemo, useState, useEffect, useRef } from 'react'
import { formatNumber, formatTime, getPriceColor } from 'redux/actions/utils'
import { customTableStyles } from '../../TradeRecord/index'
import { ChevronDown, Edit, Share2 } from 'react-feather'

import FuturesRecordSymbolItem from '../../TradeRecord/SymbolItem'
import DataTable from 'react-data-table-component'
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus, UserSocketEvent } from 'redux/actions/const'
import Skeletor from 'src/components/common/Skeletor'
import fetchApi from 'utils/fetch-api'
import { useTranslation } from 'next-i18next'
import Modal from 'components/common/ReModal'
import Button from 'components/common/Button'
import showNotification from 'utils/notificationService'
import { useSelector } from 'react-redux'
import { VndcFutureOrderType } from './VndcFutureOrderType'
import OrderProfit from '../../TradeRecord/OrderProfit';
import Big from "big.js";
import FuturesEditSLTPVndc from './EditSLTPVndc'


const FuturesOpenOrdersVndc = ({ pairConfig, onForceUpdate, hideOther, pairPrice }) => {
    const { t } = useTranslation()
    const columns = useMemo(
        () => [
            {
                name: t('futures:order_table:created_time'),
                selector: (row) => row?.created_at,
                cell: (row) => (
                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                        {formatTime(row?.created_at)}
                    </span>
                ),
                sortable: true,
            },
            {
                name: t('futures:order_table:symbol'),
                selector: (row) => row?.symbol,
                cell: (row) => (
                    <FuturesRecordSymbolItem symbol={row?.symbol} />
                ),
                sortable: true,
            },
            {
                name: t('futures:order_table:type'),
                selector: (row) => row?.type,
                sortable: true,
            },
            {
                name: t('futures:order_table:side'),
                selector: (row) => row?.type,
                cell: (row) => <span className={row?.side === VndcFutureOrderType.Side.BUY ? 'text-dominant' : 'text-red'}>{row?.side}</span>,
                sortable: true,
            },
            {
                name: t('futures:order_table:open_price'),
                selector: (row) => row?.open_price,
                cell: (row) => renderOpenPrice(row),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: t('futures:order_table:last_price'),
                selector: (row) => <span>{formatNumber(pairPrice?.lastPrice, 0, 0, true) + ' ' + pairPrice?.quoteAsset}</span>,
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'PNL (ROE%)',
                selector: (row) => row?.pnl?.value,
                cell: (row) => <OrderProfit order={row} pairPrice={pairPrice} />,
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'TP/SL',
                cell: (row) => (
                    <div className='flex items-center'>
                        <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                            <div>{formatNumber(row?.tp, 0, 0, true)}/</div>
                            <div>{formatNumber(row?.sl, 0, 0, true)}</div>
                        </div>
                        {row.status !== VndcFutureOrderType.Status.CLOSED &&
                            <Edit onClick={() => onOpenModify(row)} className='ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60' />
                        }
                    </div>
                ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: '',
                cell: (row) => (
                    <div onClick={() => onDelete(row)} className='cursor-pointer hover:opacity-80 px-[28px] py-1 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                        Close
                    </div>
                ),
            },
        ],
        [pairPrice]
    )
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const rowData = useRef(null);
    const userSocket = useSelector((state) => state.socket.userSocket);
    const [showModalEdit, setShowModalEdit] = useState(false)

    useEffect(() => {
        getDataSource();
    }, [])

    const getDataSource = () => {
        const params = {
            status: 0,
        }
        getOrders('GET', params, (data) => {
            setDataSource(data);
        });
    }

    useEffect(() => {
        if (userSocket) {
            userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER, getDataSource);
            userSocket.on(UserSocketEvent.FUTURES_OPEN_ORDER, getDataSource);
        }
        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER, getDataSource);
            }
        };
    }, [userSocket]);

    const getOrders = async (method = 'GET', params, cb) => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method },
                params: params,
            })
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data?.orders);
            } else {
                showNotification(
                    {
                        message: message,
                        title: 'Error',
                        type: 'failure'
                    },
                    1800,
                    'bottom',
                    'bottom-right'
                )
            }
        } catch (e) {
            console.log(e)
        } finally {
            setTimeout(() => {
                onForceUpdate()
            }, 2000)
        }
    }

    const onDelete = (item) => {
        rowData.current = item;
        setShowModalDelete(true)
    }

    const onConfirm = () => {
        const params = {
            displaying_id: rowData.current.displaying_id,
            special_mode: 1
        }
        getOrders('DELETE', params, () => {
            setShowModalDelete(false);
            showNotification(
                {
                    message: t('futures:close_order:close_successfully', { value: rowData.current?.displaying_id }),
                    title: `Chúc mừng bạn`,
                    type: 'success'
                },
                1800,
                'bottom',
                'bottom-right'
            )
        });
    }

    const renderOpenPrice = (row) => {
        let text = '';
        switch (row.status) {
            case VndcFutureOrderType.Status.PENDING:
                let bias = null;
                const value = row['price'];
                const openPrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.ask : pairPrice?.bid;
                const closePrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask;
                if (pairPrice?.lastPrice > 0 && value > 0) {
                    let biasValue = biasValue = +Big(value).minus(openPrice);
                    const formatedBias = formatNumber(biasValue, 8, 0, true);
                    bias =
                        biasValue > 0 ? (
                            <span>
                                (<span className="text-mint">+{formatedBias}</span>)
                            </span>
                        ) : (
                            <span>
                                (<span className="text-pink">{formatedBias}</span>)
                            </span>
                        );
                }
                text = row.price ? (formatNumber(row.price, 8) + ' ' + pairPrice?.quoteAsset) : '';;
                return <div className="flex items-center ">
                    <div>{text}<br />{bias}</div>
                    <Edit onClick={() => onOpenModify(row)} className='ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60' />
                </div>;
            case VndcFutureOrderType.Status.ACTIVE:
                text = row.open_price ? formatNumber(row.open_price, 8) : '';
                return <div>{text + ' ' + pairPrice?.quoteAsset}</div>;
            case VndcFutureOrderType.Status.CLOSED:
                text = row.price ? formatNumber(row.close_price, 8) : '';
                return <div>{text + ' ' + pairPrice?.quoteAsset}</div>;
            default:
                return <div>{text + ' ' + pairPrice?.quoteAsset}</div>;
        }
    }

    const onOpenModify = (data) => {
        rowData.current = data;
        setShowModalEdit(true);
    }

    const onConfirmEdit = (params) => {
        getOrders('PUT', params, () => {
            setShowModalEdit(false);
            showNotification(
                {
                    message: 'Modify order successfully',
                    title: 'Chúc mừng bạn',
                    type: 'success'
                },
                1800,
                'bottom',
                'bottom-right'
            )
        });
    }

    const _dataSource = useMemo(() => {
        return !hideOther ? dataSource : dataSource.filter(i => i.symbol === pairConfig?.symbol);
    }, [hideOther, dataSource])

    return (
        <>
            <Modal
                isVisible={showModalDelete}
                onBackdropCb={() => setShowModalDelete(false)}
            >
                <div className="w-full">
                    <div className="text-center text-xl font-bold capitalize">
                        {t('futures:close_order:modal_title', { value: rowData.current?.displaying_id })}
                    </div>
                    <div className="mt-3 text-center text-lg" dangerouslySetInnerHTML={{ __html: t('futures:close_order:confirm_message', { value: rowData.current?.displaying_id }) }} >
                    </div>
                    <div className="text-center text-xs">
                        {t('futures:close_order:future_note')}&nbsp;
                        <a href="https://nami.exchange/fee-schedule" className="text-mint" target="_blank">Fee Schedule</a>
                    </div>
                    <div className="mt-4 w-full flex flex-row items-center justify-center">
                        <Button title={t('common:cancel')} type="default"
                            componentType="button"
                            style={{ width: '48%' }}
                            className="mr-[10px]"
                            onClick={() => setShowModalDelete(false)} />
                        <Button title={t('common:confirm')} type="primary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={onConfirm} />
                    </div>
                </div>
            </Modal>
            {showModalEdit &&
                <FuturesEditSLTPVndc
                    isVisible={showModalEdit}
                    order={rowData.current}
                    onClose={() => setShowModalEdit(false)}
                    status={rowData.current.status}
                    pairPrice={pairPrice}
                    onConfirm={onConfirmEdit}
                />
            }
            <DataTable
                responsive
                fixedHeader
                sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                data={_dataSource}
                columns={columns}
                customStyles={customTableStyles}
            />
        </>
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
