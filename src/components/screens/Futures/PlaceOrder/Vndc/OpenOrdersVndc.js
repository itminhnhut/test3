import React, {useMemo, useState, useEffect, useRef} from 'react'
import {formatNumber, formatTime} from 'redux/actions/utils'

import FuturesRecordSymbolItem from '../../TradeRecord/SymbolItem'
import DataTable from 'react-data-table-component'
import Modal from 'components/common/ReModal'
import Button from 'components/common/Button'
import showNotification from 'utils/notificationService'
import {VndcFutureOrderType} from './VndcFutureOrderType'
import OrderProfit from '../../TradeRecord/OrderProfit';
import FuturesEditSLTPVndc from './EditSLTPVndc'
import FuturesTimeFilter2 from "components/screens/Futures/TradeRecord/FuturesTimeFilter2";
import {FilterTradeOrder} from "components/screens/Futures/FilterTradeOrder";
import {ChevronDown, Edit} from 'react-feather'

import {useSelector} from 'react-redux'
import {API_GET_FUTURES_ORDER} from 'redux/actions/apis'
import {ApiStatus, UserSocketEvent} from 'redux/actions/const'

import {useTranslation} from 'next-i18next'
import fetchApi from 'utils/fetch-api'
import Big from "big.js";
import {isArray, isString} from "lodash";


import {customTableStyles} from '../../TradeRecord/index'

const FuturesOpenOrdersVndc = ({pairConfig, onForceUpdate, hideOther, pairPrice, auth}) => {
    const {t} = useTranslation()
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
                    <FuturesRecordSymbolItem symbol={row?.symbol}/>
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
                cell: (row) => <span
                    className={row?.side === VndcFutureOrderType.Side.BUY ? 'text-dominant' : 'text-red'}>{row?.side}</span>,
                sortable: true,
            },
            {
                name: t('futures:order_table:amount'),
                cell: (row) => row?.quantity,
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
                selector: (row) => formatNumber(pairPrice?.lastPrice, 0, 0, true),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'PNL (ROE%)',
                selector: (row) => row?.pnl?.value,
                cell: (row) => <OrderProfit order={row} pairPrice={pairPrice}/>,
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
                        <Edit onClick={() => onOpenModify(row)}
                              className='ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60'/>
                        }
                    </div>
                ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: '',
                cell: (row) => (
                    <div onClick={() => onDelete(row)}
                         className='cursor-pointer hover:opacity-80 px-[28px] py-1 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
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
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [filters, setFilters] = useState({
        timeRange: [],
        symbol: '',
        status: '',
        side: '',
    })

    const symbolOptions = useMemo(() => {
        return allPairConfigs?.filter(e => e.quoteAsset === 'VNDC')?.map(e => ({value: e.symbol}))
    }, [allPairConfigs])

    useEffect(() => {
        getDataSource();
    }, [])

    const getDataSource = () => {
        if (!auth) return;
        const params = {
            status: 0,
        }
        fetchOrder('GET', params, (data) => {
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

    const fetchOrder = async (method = 'GET', params, cb) => {
        try {
            const {status, data, message} = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: {method},
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
        fetchOrder('DELETE', params, () => {
            setShowModalDelete(false);
            showNotification(
                {
                    message: t('futures:close_order:close_successfully', {value: rowData.current?.displaying_id}),
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
                    let biasValue = +Big(value).minus(openPrice);
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
                text = row.price ? (formatNumber(row.price, 8)) : '';
                return <div className="flex items-center ">
                    <div>{text}<br/>{bias}</div>
                    <Edit onClick={() => onOpenModify(row)} className='ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60'/>
                </div>;
            case VndcFutureOrderType.Status.ACTIVE:
                text = row.open_price ? formatNumber(row.open_price, 8) : '';
                return <div>{text}</div>;
            case VndcFutureOrderType.Status.CLOSED:
                text = row.close_price ? formatNumber(row.close_price, 8) : '';
                return <div>{text}</div>;
            default:
                return <div>{text}</div>;
        }
    }

    const onOpenModify = (data) => {
        rowData.current = data;
        setShowModalEdit(true);
    }

    const onConfirmEdit = (params) => {
        fetchOrder('PUT', params, () => {
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
        return dataSource.filter(o => {
            const conditions = []
            if (hideOther) {
                conditions.push(o.symbol === pairConfig?.symbol)
            }
            if (filters.side) {
                conditions.push(o.side === filters.side)
            }
            if (Object.values(VndcFutureOrderType.Status).includes(filters.status)) {
                conditions.push(parseInt(o.status) === filters.status)
            }

            const createdAt = new Date(o.created_at).valueOf()

            if (isArray(filters.timeRange) && filters.timeRange.length > 0) {
                conditions.push(createdAt > filters.timeRange[0].valueOf() && createdAt < filters.timeRange[1].valueOf())
            }

            return conditions.every(e => e)
        });

    }, [hideOther, dataSource, filters])

    if (!auth) return <div
        className="flex items-center justify-center h-full">{t('futures:order_table:login_to_continue')}</div>;
    return (
        <>
            <Modal
                isVisible={showModalDelete}
                onBackdropCb={() => setShowModalDelete(false)}
            >
                <div className="w-[390px]">
                    <div className="text-center text-xl font-bold capitalize">
                        {t('futures:close_order:modal_title', {value: rowData.current?.displaying_id})}
                    </div>
                    <div className="mt-3 text-center text-lg"
                         dangerouslySetInnerHTML={{__html: t('futures:close_order:confirm_message', {value: rowData.current?.displaying_id})}}>
                    </div>
                    <div className="mt-4 w-full flex flex-row items-center justify-center">
                        <Button
                            title={t('common:cancel')} type="default"
                            componentType="button"
                            style={{width: '48%'}}
                            className="mr-[10px]"
                            onClick={() => setShowModalDelete(false)}/>
                        <Button
                            title={t('common:confirm')} type="primary"
                            componentType="button"
                            style={{width: '48%'}}
                            onClick={onConfirm}/>
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
            <div className='flex flex-row items-center'>
                <FuturesTimeFilter2
                    currentTimeRange={filters.timeRange}
                    onChange={(value) => {
                        setFilters({...filters, timeRange: value})
                    }}
                />
                <FilterTradeOrder
                    label='Symbol'
                    options={symbolOptions}
                    value={filters.symbol}
                    onChange={(value) => {
                        setFilters({...filters, symbol: value})
                    }}
                />
                <FilterTradeOrder
                    label='Side'
                    options={[{value: 'Buy'}, {value: 'Sell'}]}
                    value={filters.side}
                    onChange={(value) => {
                        setFilters({...filters, side: value})
                    }}
                />
                <FilterTradeOrder
                    label='Status'
                    options={[
                        {
                            value: VndcFutureOrderType.Status.PENDING,
                            label: 'Pending'
                        },
                        {
                            value: VndcFutureOrderType.Status.ACTIVE,
                            label: 'Opening'
                        }
                    ]}
                    value={filters.status}
                    onChange={(value) => {
                        setFilters({...filters, status: value})
                    }}
                />
                <div
                    onClick={() => {
                        setFilters({
                            timeRange: [],
                            symbol: '',
                            status: '',
                            side: '',
                        })
                    }}
                    className="px-[8px] flex py-[1px] mr-2 text-xs font-medium bg-bgSecondary dark:bg-bgSecondary-dark cursor-pointer hover:opacity-80 rounded-md">
                    Reset
                </div>
            </div>
            <DataTable
                responsive
                fixedHeader
                sortIcon={<ChevronDown size={8} strokeWidth={1.5}/>}
                data={_dataSource}
                columns={columns}
                customStyles={customTableStyles}
            />
        </>
    )
}

export default FuturesOpenOrdersVndc
