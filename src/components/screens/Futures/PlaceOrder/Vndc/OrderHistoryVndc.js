import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Share2 } from 'react-feather';

import DataTable from 'react-data-table-component';
import fetchApi from 'utils/fetch-api';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import Skeletor from 'src/components/common/Skeletor';
import { formatNumber, formatTime, getLoginUrl, getPriceColor, getS3Url, countDecimals } from 'redux/actions/utils';
import { renderCellTable, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import FuturesTimeFilter2 from 'components/screens/Futures/TradeRecord/FuturesTimeFilter2';
import { FilterTradeOrder } from 'components/screens/Futures/FilterTradeOrder';
import { tableStyle } from 'config/tables';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import ShareFuturesOrder from 'components/screens/Futures/ShareFuturesOrder';
import Adjustmentdetails from 'components/screens/Futures/PlaceOrder/Vndc/Adjustmentdetails';
import TableNoData from 'components/common/table.old/TableNoData';
import Link from 'next/link';
import TableV2 from 'components/common/V2/TableV2'
import FuturesRecordSymbolItem from 'components/screens/Futures/TradeRecord/SymbolItem';
import classNames from 'classnames';

const FuturesOrderHistoryVndc = ({ pairPrice, pairConfig, onForceUpdate, hideOther, isAuth, onLogin, pair }) => {
    const { t, i18n: { language } } = useTranslation()
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [shareOrder, setShareOrder] = useState(null)
    const [resetPage, setResetPage] = useState(false);
    const darkMode = useSelector(state => state.user.theme === 'dark');
    const [showDetail, setShowDetail] = useState(false);
    const rowData = useRef(null);


    const columns = useMemo(() => [
        {
            key: 'pair',
            dataIndex: 'symbol',
            title: t('common:pair'),
            align: 'left',
            width: 192,
            render: (row, item) => (
                pairConfig?.pair !== item?.symbol ?
                    <Link href={`/futures/${item?.symbol}`}>
                        <a className='dark:text-white text-darkBlue'>
                            <FuturesRecordSymbolItem symbol={item?.symbol} leverage={item?.leverage} type={item?.type} side={item?.side} />
                        </a>
                    </Link>
                    : <FuturesRecordSymbolItem symbol={item?.symbol} leverage={(item?.leverage)} type={item?.type} side={item?.side} />
            ),
            sortable: true,
        },
        {
            key: 'status',
            title: t('common:status'),
            align: 'right',
            width: 178,
            render: (row) => renderOrderStatus(row?.reason_close),
            sortable: true,
        },
    ], [loading, pair])

    const [filters, setFilters] = useState({
        timeFrom: null,
        timeTo: null,
        symbol: '',
        side: '',
    })

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pageSize: 10
    })

    const symbolOptions = useMemo(() => {
        return allPairConfigs?.map(e => ({ value: e.symbol, label: e.baseAsset + '/' + e.quoteAsset }))
    }, [allPairConfigs])

    useEffect(() => {
        setFilters({ ...filters, symbol: hideOther ? pairConfig?.symbol : '' })
    }, [hideOther])


    useEffect(() => {
        getOrders();
    }, [pagination.page, pagination.pageSize])

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find(rs => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    const renderOrderStatus = (type) => {
        let bgColor
        let textColor
        let content
        switch (type) {
            // lenh hoan tat
            case VndcFutureOrderType.ReasonCloseCode.HIT_SL:
            case VndcFutureOrderType.ReasonCloseCode.HIT_TP:
            case VndcFutureOrderType.ReasonCloseCode.LIQUIDATE: {
                bgColor = 'bg-teal/[0.1]'
                textColor = 'text-teal'
                content = t('futures:adjust_margin.order_completed')
                break;
            }

            // lenh huy
            case VndcFutureOrderType.ReasonCloseCode.PARTIAL_CLOSE:
            case VndcFutureOrderType.ReasonCloseCode.NORMAL: {
                bgColor = 'bg-darkBlue-5/[0.5]'
                textColor = 'text-darkBlue-5'
                content = t('futures:adjust_margin.order_completed')
                break;
            }
        }

        return <div className={classNames('px-4 py-1  text-yellow-100 font-normal text-sm rounded-[80px] text-center', bgColor, textColor)}>{content}</div>
    }

    const getOrders = async () => {
        setLoading(true)
        try {
            const { status, data } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method: 'GET' },
                params: {
                    status: 1,
                    pageSize: pagination.pageSize,
                    page: pagination.page - 1,
                    ...filters,
                    timeFrom: filters.timeFrom?.valueOf(),
                    timeTo: filters.timeTo?.valueOf(),
                },
            })

            if (status === ApiStatus.SUCCESS) {
                data?.orders.map(item => {
                    const symbol = allPairConfigs.find(rs => rs.symbol === item.symbol);
                    const decimalSymbol = assetConfig.find(rs => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
                    const decimalScalePrice = getDecimalPrice(symbol);
                    item['decimalSymbol'] = decimalSymbol;
                    item['decimalScalePrice'] = decimalScalePrice;
                    item['quoteAsset'] = symbol?.quoteAsset;
                    return item;
                })
                setDataSource(data?.orders)
                setPagination({ ...pagination, total: data?.total })
            } else {
                setDataSource([])
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
            onForceUpdate()
            setResetPage(false);
        }
    }

    const cellRenderRevenue = (row) => {
        const isVndc = row?.symbol.indexOf('VNDC') !== -1
        const profit = formatNumber(row?.profit, isVndc ? row?.decimalSymbol : row?.decimalSymbol + 2, 0, true)
        const percent = formatNumber(((row?.profit / row?.margin) * 100), 2, 0, true);
        if (!row?.profit) return '-'
        return <div className='flex flex-row'>
            <div className={getPriceColor(Number(row?.profit))}>
                <div>
                    {profit} {row?.quoteAsset}
                </div>
                <div>
                    ({percent > 0 ? '+' : ''}
                    {percent + '%'})
                </div>
            </div>
            <Share2 size={16} onClick={() => setShareOrder(row)} className='ml-1 cursor-pointer hover:opacity-60' />
        </div>
    }

    const renderReasonClose = (row) => {
        switch (row?.reason_close_code) {
            case 0:
                return t('futures:order_history:normal')
            case 1:
                return t('futures:order_history:hit_sl')
            case 2:
                return t('futures:order_history:hit_tp')
            case 3:
                return t('futures:order_history:liquidate')
            default:
                return '';
        }
    }

    if (!isAuth) return <div className="cursor-pointer flex items-center justify-center h-full">
        <Link href={getLoginUrl('sso', 'login')} locale={false}>
            <a className='w-[200px] bg-dominant !text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'>
                {t('futures:order_table:login_to_continue')}
            </a>
        </Link>
    </div>

    const customStyles = {
        headCells: {
            style: {
                whiteSpace: 'nowrap',
            },
        },
        rows: {
            style: {
                marginBottom: '8px',
            },
        },
        pagination: {
            style: {
                ...tableStyle.pagination?.style,
                color: darkMode ? '#DBE3E6' : '#8B8C9B',
                backgroundColor: darkMode ? '#141523' : '#FFFFFF',
            },
            pageButtonsStyle: {
                color: darkMode ? '#DBE3E6' : '#8B8C9B',
                fill: darkMode ? '#DBE3E6' : '#8B8C9B',
                '&:hover:not(:disabled)': {
                    backgroundColor: darkMode ? '#212738' : '#DBE3E6',
                },
                '&:focus': {
                    outline: 'none',
                    backgroundColor: darkMode ? '#212738' : '#DBE3E6',
                },
                '&:disabled': {
                    cursor: 'unset',
                    color: darkMode ? '#8B8C9B' : '#d1d1d1',
                    fill: darkMode ? '#8B8C9B' : '#d1d1d1',
                },
            },
        },
    }

    const onShowDetail = (row) => {
        rowData.current = row;
        setShowDetail(!showDetail);
    }

    return (
        <>
            {showDetail && <Adjustmentdetails rowData={rowData.current} onClose={onShowDetail} />}
            <ShareFuturesOrder isClosePrice isVisible={!!shareOrder} order={shareOrder} pairPrice={pairPrice} onClose={() => setShareOrder(null)} />
            {/* <DataTable
                responsive
                fixedHeader
                sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                data={loading ? data : dataSource}
                columns={columns}
                customStyles={customStyles}
                pagination
                paginationServer
                paginationTotalRows={pagination.total}
                onChangeRowsPerPage={(pageSize) => {
                    setPagination({ ...pagination, page: 1, pageSize })
                    setResetPage(true);
                }}
                onChangePage={(page) => {
                    if (!loading) setPagination({ ...pagination, page })
                }}
                currentPage={pagination.page}
                noDataComponent={<TableNoData />}
                paginationResetDefaultPage={resetPage}
                paginationComponentOptions={{
                    rowsPerPageText: t('futures:rows_per_page'),
                    rangeSeparatorText: t('common:of'),
                    noRowsPerPage: false,
                    selectAllRowsItem: false,
                    selectAllRowsItemText: t('common:all'),
                }}
            // progressPending={loading}
            // progressComponent={<TableLoader/>}
            /> */}

            <TableV2
                data={loading ? data : dataSource}
                columns={columns}
                scroll={{ x: true }}
                height={'300px'}
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
