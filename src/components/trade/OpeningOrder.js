import SvgCross from 'components/svg/Cross';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import Emitter from 'redux/actions/emitter';
import { tableStyle } from 'src/config/tables';
import { API_GET_OPEN_ORDER } from 'src/redux/actions/apis';
import { ApiStatus, ExchangeOrderEnum, UserSocketEvent } from 'src/redux/actions/const';
import { formatBalance, formatTime } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import showNotification from 'utils/notificationService';
import TableNoData from '../common/table.old/TableNoData';
import TableLoader from '../loader/TableLoader';


const SpotOrderList = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const { toggle } = props;
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const userSocket = useSelector(state => state.socket.userSocket);
    const user = useSelector(state => state.auth.user);

    const { currentPair, filterByCurrentPair, darkMode } = props;

    useEffect(() => {
        if (filterByCurrentPair) {
            const filter = orders.filter(hist => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair);
            setFilteredOrders(filter);
        } else {
            setFilteredOrders(orders);
        }
    }, [orders, currentPair, filterByCurrentPair]);

    const closeOrder = async (displayingId, symbol) => {
        const res = await fetchAPI({
            url: '/api/v3/spot/order',
            options: {
                method: 'DELETE',
            },
            params: {
                displayingId,
                symbol,
            },
        });
        const { status, data } = res;
        let message = '';
        if (status === ApiStatus.SUCCESS) {
            message = t('spot:close_order_success', {
                displayingId, side: data?.side, type: data?.type, token: `${data?.baseAsset}/${data?.quoteAsset}`,
            });
            showNotification({ message, title: 'Success', type: 'success' }, 'bottom', 'bottom-right');
        } else {
            showNotification({ message: t('spot:close_order_failed'), title: 'Failure', type: 'failure' }, 'bottom', 'bottom-right');
        }
    };

    const updateOrder = (data) => {
        if (data?.displayingId) {
            if ([
                ExchangeOrderEnum.Status.NEW,
                ExchangeOrderEnum.Status.PARTIALLY_FILLED,
            ].includes(data?.status)) {
                let _orders = orders || [];
                const index = findIndex(_orders, { displayingId: data?.displayingId });
                if (index < 0) {
                    _orders = [data, ..._orders];
                    setOrders(_orders);
                } else {
                    _orders[index] = data;
                    setOrders(_orders);
                }
            } else {
                let _orders = orders || [];
                if (_orders.length) {
                    _orders = filter(_orders, (o) => { return +o.displayingId !== +data?.displayingId; });
                    setOrders(_orders);
                }
            }
        }
    };
    // Handle update order
    useEffect(() => {
        const event = UserSocketEvent.EXCHANGE_UPDATE_ORDER;
        Emitter.on(event, async (data) => {
            updateOrder(data);
        });

        return function cleanup() {
            Emitter.off(event);
        };
    }, [user, userSocket, orders]);

    useEffect(() => {
        if (userSocket) {
            const event = 'exchange:update_opening_order';
            userSocket.removeListener(event, setOrders);
            userSocket.on(event, setOrders);
        }
        return function cleanup() {
            if (userSocket) {
                const event = 'exchange:update_opening_order';
                userSocket.removeListener(event, setOrders);
            }
        };
    }, [userSocket]);

    const customStyles = {
        ...tableStyle,
        table: {
            style: {
                ...tableStyle.table?.style,
                backgroundColor: darkMode ? '#141523' : '#FFFFFF',
                minHeight: loading ? 0 : '200px',
            },
        },
        headCells: {
            style: {
                ...tableStyle.headCells?.style,
                color: darkMode ? '#DBE3E6' : '#8B8C9B',
                padding: 0,
            },
            activeSortStyle: {
                cursor: 'pointer',
                '&:focus': {
                    outline: 'none',
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover:focus': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover:active': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
            },
            inactiveSortStyle: {
                '&:focus': {
                    outline: 'none',
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover:focus': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover:active': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
            },
        },
        headRow: {
            style: {
                ...tableStyle.headRow?.style,
                borderBottom: 'none !important',
                backgroundColor: darkMode ? '#141523' : '#FFFFFF',
            },
        },
        rows: {
            style: {
                ...tableStyle.rows?.style,
                borderBottom: 'none !important',
                backgroundColor: darkMode ? '#141523' : '#FFFFFF',
                '&:hover': {
                    background: darkMode ? '#212537' : '#F6F9FC',
                },
            },
        },
        cells: {
            style: {
                ...tableStyle.cells?.style,
                color: darkMode ? '#DBE3E6' : '#02083D',
                padding: 0,
                '&:hover': {
                    color: darkMode ? '#DBE3E6' : '#02083D',
                },
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
    };

    const columns = useMemo(() => [
        {
            name: t('common:order_id'),
            selector: 'displayingId',
            ignoreRowClick: true,
            omit: false,
            minWidth: '50px',
        },
        {
            name: t('common:time'),
            selector: 'createdAt',
            ignoreRowClick: true,
            omit: false,
            minWidth: '100px',
            cell: (row) => formatTime(row.createdAt),
        },
        {
            name: t('common:pair'),
            selector: 'symbol',
            ignoreRowClick: true,
            minWidth: '100px',
        },
        {
            name: t('common:order_type'),
            selector: 'type',
            ignoreRowClick: true,
            minWidth: '50px',
        },
        {
            name: `${t('common:buy')}/${t('common:sell')}`,
            selector: 'side',
            ignoreRowClick: true,
            minWidth: '50px',
            conditionalCellStyles: [
                {
                    when: row => row.side === 'SELL',
                    style: {
                        color: '#E5544B !important',
                    },
                },
                {
                    when: row => row.side === 'BUY',
                    style: {
                        color: '#00C8BC !important',
                    },
                }],
        },
        {
            name: t('common:order_price'),
            ignoreRowClick: true,
            right: true,
            cell: (row) => formatBalance(row.price, 6),
            minWidth: '80px',
        },
        {
            name: t('common:open_quantity'),
            ignoreRowClick: true,
            right: true,
            minWidth: '80px',
            cell: (row) => row.quantity,
        },
        {
            name: t('common:filled'),
            minWidth: '80px',
            right: true,
            cell: (row) => {
                return (
                    <span>
                        {formatBalance((row?.executedQty / row?.quantity) * 100, 2)}%
                    </span>
                );
            },
        },
        {
            name: '',
            ignoreRowClick: true,
            right: true,
            minWidth: '40px',
            // omit: !toggle,
            cell: (row) => (
                <span
                    className="p-2 cursor-pointer"
                    onClick={() => closeOrder(row.displayingId, row.symbol)}
                >
                    <SvgCross/>
                </span>
            ),
        },

    ], [toggle]);

    const getOrderList = async () => {
        setLoading(true);
        const { status, data } = await fetchAPI({
            url: API_GET_OPEN_ORDER,
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setOrders(data.orders);
            setLoading(false);
        }
    };

    useEffect(() => {
        // if (user) getOrderList();
        setOrders([
            {
               "price":2440.25,
               "stopPrice":0,
               "executedPrice":0,
               "quantity":1062,
               "executedQty":0,
               "quoteQty":2591545.5,
               "executedQuoteQty":0,
               "useQuoteQty":null,
               "liquiditySymbol":null,
               "liquidityUsdtPrice":0,
               "liquidityTransferPrice":0,
               "liquidityTransferFee":0,
               "displayingId":1311583,
               "baseAsset":"KAI",
               "baseAssetId":84,
               "createdAt":"2021-11-11T10:40:24.141Z",
               "feeMetadata":{
                  "assetId":null,
                  "value":null,
                  "feeRatio":null
               },
               "quoteAsset":"VNDC",
               "quoteAssetId":72,
               "side":"SELL",
               "status":"NEW",
               "symbol":"KAIVNDC",
               "type":"LIMIT",
               "updatedAt":"2021-11-11T10:40:24.141Z",
               "userId":18,
               "metadata":{
                  
               }
            },
            {
               "price":2399.19,
               "stopPrice":0,
               "executedPrice":0,
               "quantity":1139,
               "executedQty":0,
               "quoteQty":2732677.41,
               "executedQuoteQty":0,
               "useQuoteQty":null,
               "liquiditySymbol":null,
               "liquidityUsdtPrice":0,
               "liquidityTransferPrice":0,
               "liquidityTransferFee":0,
               "displayingId":1311582,
               "baseAsset":"KAI",
               "baseAssetId":84,
               "createdAt":"2021-11-11T10:40:24.099Z",
               "feeMetadata":{
                  "assetId":null,
                  "value":null,
                  "feeRatio":null
               },
               "quoteAsset":"VNDC",
               "quoteAssetId":72,
               "side":"BUY",
               "status":"NEW",
               "symbol":"KAIVNDC",
               "type":"LIMIT",
               "updatedAt":"2021-11-11T10:40:24.099Z",
               "userId":18,
               "metadata":{
                  
               }
            },
            {
               "price":2399.19,
               "stopPrice":0,
               "executedPrice":0,
               "quantity":1004,
               "executedQty":0,
               "quoteQty":2408786.7600000002,
               "executedQuoteQty":0,
               "useQuoteQty":null,
               "liquiditySymbol":null,
               "liquidityUsdtPrice":0,
               "liquidityTransferPrice":0,
               "liquidityTransferFee":0,
               "displayingId":1311580,
               "baseAsset":"KAI",
               "baseAssetId":84,
               "createdAt":"2021-11-11T10:35:24.092Z",
               "feeMetadata":{
                  "assetId":null,
                  "value":null,
                  "feeRatio":null
               },
               "quoteAsset":"VNDC",
               "quoteAssetId":72,
               "side":"BUY",
               "status":"NEW",
               "symbol":"KAIVNDC",
               "type":"LIMIT",
               "updatedAt":"2021-11-11T10:35:24.092Z",
               "userId":18,
               "metadata":{
                  
               }
            },
            {
               "price":1090.2,
               "stopPrice":0,
               "executedPrice":0,
               "quantity":4716,
               "executedQty":0,
               "quoteQty":5141383.2,
               "executedQuoteQty":0,
               "useQuoteQty":null,
               "liquiditySymbol":null,
               "liquidityUsdtPrice":0,
               "liquidityTransferPrice":0,
               "liquidityTransferFee":0,
               "displayingId":1311579,
               "baseAsset":"RABBIT",
               "baseAssetId":368,
               "createdAt":"2021-11-11T10:30:25.895Z",
               "feeMetadata":{
                  "assetId":null,
                  "value":null,
                  "feeRatio":null
               },
               "quoteAsset":"VNDC",
               "quoteAssetId":72,
               "side":"SELL",
               "status":"NEW",
               "symbol":"RABBITVNDC",
               "type":"LIMIT",
               "updatedAt":"2021-11-11T10:30:25.895Z",
               "userId":18,
               "metadata":{
                  
               }
            },
            {
               "price":726.8,
               "stopPrice":0,
               "executedPrice":0,
               "quantity":4798,
               "executedQty":0,
               "quoteQty":3487186.4,
               "executedQuoteQty":0,
               "useQuoteQty":null,
               "liquiditySymbol":null,
               "liquidityUsdtPrice":0,
               "liquidityTransferPrice":0,
               "liquidityTransferFee":0,
               "displayingId":1311577,
               "baseAsset":"RABBIT",
               "baseAssetId":368,
               "createdAt":"2021-11-11T10:30:25.811Z",
               "feeMetadata":{
                  "assetId":null,
                  "value":null,
                  "feeRatio":null
               },
               "quoteAsset":"VNDC",
               "quoteAssetId":72,
               "side":"BUY",
               "status":"NEW",
               "symbol":"RABBITVNDC",
               "type":"LIMIT",
               "updatedAt":"2021-11-11T10:30:25.811Z",
               "userId":18,
               "metadata":{
                  
               }
            },
            {
               "price":2399.19,
               "stopPrice":0,
               "executedPrice":0,
               "quantity":1091,
               "executedQty":0,
               "quoteQty":2617516.29,
               "executedQuoteQty":0,
               "useQuoteQty":null,
               "liquiditySymbol":null,
               "liquidityUsdtPrice":0,
               "liquidityTransferPrice":0,
               "liquidityTransferFee":0,
               "displayingId":1311576,
               "baseAsset":"KAI",
               "baseAssetId":84,
               "createdAt":"2021-11-11T10:30:25.772Z",
               "feeMetadata":{
                  "assetId":null,
                  "value":null,
                  "feeRatio":null
               },
               "quoteAsset":"VNDC",
               "quoteAssetId":72,
               "side":"BUY",
               "status":"NEW",
               "symbol":"KAIVNDC",
               "type":"LIMIT",
               "updatedAt":"2021-11-11T10:30:25.772Z",
               "userId":18,
               "metadata":{
                  
               }
            },
            {
               "price":2399.19,
               "stopPrice":0,
               "executedPrice":0,
               "quantity":939,
               "executedQty":0,
               "quoteQty":2252839.41,
               "executedQuoteQty":0,
               "useQuoteQty":null,
               "liquiditySymbol":null,
               "liquidityUsdtPrice":0,
               "liquidityTransferPrice":0,
               "liquidityTransferFee":0,
               "displayingId":1311574,
               "baseAsset":"KAI",
               "baseAssetId":84,
               "createdAt":"2021-11-11T10:25:24.092Z",
               "feeMetadata":{
                  "assetId":null,
                  "value":null,
                  "feeRatio":null
               },
               "quoteAsset":"VNDC",
               "quoteAssetId":72,
               "side":"BUY",
               "status":"NEW",
               "symbol":"KAIVNDC",
               "type":"LIMIT",
               "updatedAt":"2021-11-11T10:25:24.092Z",
               "userId":18,
               "metadata":{
                  
               }
            },
            {
               "price":2399.19,
               "stopPrice":0,
               "executedPrice":0,
               "quantity":1024,
               "executedQty":0,
               "quoteQty":2456770.56,
               "executedQuoteQty":0,
               "useQuoteQty":null,
               "liquiditySymbol":null,
               "liquidityUsdtPrice":0,
               "liquidityTransferPrice":0,
               "liquidityTransferFee":0,
               "displayingId":1311572,
               "baseAsset":"KAI",
               "baseAssetId":84,
               "createdAt":"2021-11-11T10:20:24.093Z",
               "feeMetadata":{
                  "assetId":null,
                  "value":null,
                  "feeRatio":null
               },
               "quoteAsset":"VNDC",
               "quoteAssetId":72,
               "side":"BUY",
               "status":"NEW",
               "symbol":"KAIVNDC",
               "type":"LIMIT",
               "updatedAt":"2021-11-11T10:20:24.093Z",
               "userId":18,
               "metadata":{
                  
               }
            },
            {
               "price":2399.19,
               "stopPrice":0,
               "executedPrice":0,
               "quantity":957,
               "executedQty":0,
               "quoteQty":2296024.83,
               "executedQuoteQty":0,
               "useQuoteQty":null,
               "liquiditySymbol":null,
               "liquidityUsdtPrice":0,
               "liquidityTransferPrice":0,
               "liquidityTransferFee":0,
               "displayingId":1311569,
               "baseAsset":"KAI",
               "baseAssetId":84,
               "createdAt":"2021-11-11T10:15:24.229Z",
               "feeMetadata":{
                  "assetId":null,
                  "value":null,
                  "feeRatio":null
               },
               "quoteAsset":"VNDC",
               "quoteAssetId":72,
               "side":"BUY",
               "status":"NEW",
               "symbol":"KAIVNDC",
               "type":"LIMIT",
               "updatedAt":"2021-11-11T10:15:24.229Z",
               "userId":18,
               "metadata":{
                  
               }
            },
            {
                "price":2399.19,
                "stopPrice":0,
                "executedPrice":0,
                "quantity":957,
                "executedQty":0,
                "quoteQty":2296024.83,
                "executedQuoteQty":0,
                "useQuoteQty":null,
                "liquiditySymbol":null,
                "liquidityUsdtPrice":0,
                "liquidityTransferPrice":0,
                "liquidityTransferFee":0,
                "displayingId":1311569,
                "baseAsset":"KAI",
                "baseAssetId":84,
                "createdAt":"2021-11-11T10:15:24.229Z",
                "feeMetadata":{
                   "assetId":null,
                   "value":null,
                   "feeRatio":null
                },
                "quoteAsset":"VNDC",
                "quoteAssetId":72,
                "side":"BUY",
                "status":"NEW",
                "symbol":"KAIVNDC",
                "type":"LIMIT",
                "updatedAt":"2021-11-11T10:15:24.229Z",
                "userId":18,
                "metadata":{
                   
                }
             },
             {
                "price":2399.19,
                "stopPrice":0,
                "executedPrice":0,
                "quantity":957,
                "executedQty":0,
                "quoteQty":2296024.83,
                "executedQuoteQty":0,
                "useQuoteQty":null,
                "liquiditySymbol":null,
                "liquidityUsdtPrice":0,
                "liquidityTransferPrice":0,
                "liquidityTransferFee":0,
                "displayingId":1311569,
                "baseAsset":"KAI",
                "baseAssetId":84,
                "createdAt":"2021-11-11T10:15:24.229Z",
                "feeMetadata":{
                   "assetId":null,
                   "value":null,
                   "feeRatio":null
                },
                "quoteAsset":"VNDC",
                "quoteAssetId":72,
                "side":"BUY",
                "status":"NEW",
                "symbol":"KAIVNDC",
                "type":"LIMIT",
                "updatedAt":"2021-11-11T10:15:24.229Z",
                "userId":18,
                "metadata":{
                   
                }
             }
])
    }, [user]);

    return (
        <DataTable
            data={filteredOrders}
            columns={columns}
            className="h-full"
            customStyles={customStyles}
            noHeader
            fixedHeader
            fixedHeaderScrollHeight={`${props.orderListWrapperHeight - 100}px`}
            dense
            pagination
            paginationPerPage={30}
            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
            noDataComponent={<TableNoData bgColor={darkMode ? 'bg-dark-1' : '#FFFFFF'} />}
            progressPending={loading}
            progressComponent={<TableLoader height={props.height} />}
        />
    );
};

export default SpotOrderList;
