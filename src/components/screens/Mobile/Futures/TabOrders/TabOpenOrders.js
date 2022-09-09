import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TableNoData from 'components/common/table.old/TableNoData';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import OrderItemMobile from './OrderItemMobile';
import { getShareModalData } from './ShareFutureMobile';
import { countDecimals, emitWebViewEvent } from 'redux/actions/utils';
import ModifyOrder from '../ModifyOrder';
import { find } from 'lodash';
import EditSLTPVndcMobile from '../EditSLTPVndcMobile';
import { reFetchOrderListInterval } from 'redux/actions/futures';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';
import CurrencyPopup from 'components/screens/Mobile/Futures/CurrencyPopup';
import CloseOrderModalMobile from '../CloseOrderModalMobile';
import AdjustPositionMargin from '../AdjustPositionMargin';

const INITIAL_STATE = {
    socketStatus: false,
};
const TabOpenOrders = ({
    ordersList,
    pair,
    mode,
    isDark,
    pairConfig,
    onShowDetail,
    tab,
    hideOther,
}) => {

    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const dataFilter = useMemo(() => {
        return hideOther ? ordersList.filter(order => order?.symbol === pair) : ordersList;
    }, [hideOther, ordersList, pair]);
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const rowData = useRef(null);
    const [openCloseOrderModal, setOpenCloseOrderModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [orderEditMarginId, setOrderEditMarginId] = useState();
    const [disabled, setDisabled] = useState(false);
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const [collapse, setCollapse] = useState(null);
    const [visibleModalFees, setVisibleModalFees] = useState(false);
    const [openAddVol, setOpenAddVol] = useState(false)

    const dispatch = useDispatch();

    useEffect(() => {
        setCollapse(null)
    }, [tab])

    const orderEditMargin = useMemo(() => {
        if (!orderEditMarginId) return;
        return find(dataFilter, { displaying_id: orderEditMarginId });
    }, [orderEditMarginId, dataFilter]);

    const onShowModal = (item, key) => {
        rowData.current = item;
        switch (key) {
            case 'delete':
                setOpenCloseOrderModal(!openCloseOrderModal)
                // context.alert.show('warning',
                //     t('futures:close_order:modal_title', { value: item?.displaying_id }),
                //     t('futures:close_order:confirm_message', { value: item?.displaying_id }),
                //     null,
                //     () => {
                //         onConfirmDelete(item);
                //     }
                // );
                break;
            case 'edit':
                setOpenEditModal(!openEditModal);
                break;
            case 'edit-margin':
                setOrderEditMarginId(item.displaying_id);
                break;
            case 'edit-fee':
                setVisibleModalFees(true);
                break;
            case 'add-vol':
                setOpenAddVol(true);
                break;
            default:
                if (!openShareModal) {
                    const shareModalData = getShareModalData({
                        order: rowData.current,
                        pairPrice: marketWatch[rowData.current?.symbol]
                    });
                    emitWebViewEvent(JSON.stringify(shareModalData));
                }
                // setOpenShareModal(!openShareModal)
                break;
        }
    };

    const fetchOrder = async (method = 'DELETE', params, cb) => {
        try {
            const {
                status,
                data,
                message
            } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method },
                params: params,
            });
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data?.orders);
            } else {
                const requestId = data?.requestId && `(${data?.requestId.substring(0, 8)})`;
                context.alert.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`), requestId);
            }
        } catch (e) {
            if (e.message === 'Network Error' || !navigator?.onLine) {
                context.alert.show('error', t('common:failed'), t('error:futures:NETWORK_ERROR'));
            }
        } finally {
            // setOpenCloseModal(false);
            setTimeout(() => {
                setDisabled(false);
            }, 1000);
        }
    };

    const onConfirmDelete = async (item) => {
        const id = item ? item.displaying_id : rowData.current.displaying_id;
        const params = {
            displaying_id: id,
            special_mode: 1
        };
        fetchOrder('DELETE', params, () => {
            context.alert.show('success', t('futures:close_order:modal_title', { value: id }), t('futures:close_order:request_successfully', { value: id }));
            dispatch(reFetchOrderListInterval(1, 10000));
        });
    };

    const onConfirmEdit = (params) => {
        setDisabled(true);
        fetchOrder('PUT', params, () => {
            localStorage.setItem('edited_id', params.displaying_id);
            context.alert.show('success', t('common:success'), t('futures:modify_order_success'));
            setOpenEditModal(false);
        });
    };

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find(rs => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    useEffect(() => {
        if (!publicSocket) {
            setState({
                socketStatus: !!publicSocket,
            });
        } else {
            const _symbols = uniq([...dataFilter?.map(order => order.symbol), pair]);
            const newSymbols = difference(_symbols, state.symbols || []);
            if (!state.socketStatus || newSymbols.length) {
                publicSocket.emit('subscribe:futures:ticker', _symbols);
                setState({
                    socketStatus: !!publicSocket,
                    symbols: _symbols
                });
            }
        }

    }, [dataFilter, pair, publicSocket]);

    useEffect(() => {
        let interval
        interval = setInterval(() => {
            const _symbols = uniq([...dataFilter?.map(order => order.symbol), pair]);
            if (publicSocket && _symbols.length) {
                publicSocket.emit('subscribe:futures:ticker', _symbols);
            }
        }, 10000)
        return () => interval && clearInterval(interval)
    }, [dataFilter, pair, publicSocket])

    const renderListOrder = () => {
        return dataFilter?.map((order, i) => {
            const symbol = allPairConfigs.find(rs => rs.symbol === order.symbol);
            const decimalSymbol = assetConfig.find(rs => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
            const decimalScalePrice = getDecimalPrice(symbol);
            const isVndcFutures = symbol?.quoteAsset === 'VNDC';
            return (
                <OrderItemMobile key={i} order={order} mode={mode}
                    onShowModal={onShowModal} allowButton isDark={isDark} symbol={symbol}
                    onShowDetail={onShowDetail} decimalSymbol={decimalSymbol}
                    decimalScalePrice={decimalScalePrice}
                    tab={tab} isVndcFutures={isVndcFutures}
                    collapse={collapse} setCollapse={setCollapse}
                />
            );
        });
    }

    useEffect(() => {
        if (rowData.current && openCloseOrderModal) {
            rowData.current = ordersList.find(rs => rs.displaying_id === rowData.current?.displaying_id)
        }

    }, [ordersList, rowData.current, openCloseOrderModal])

    if (ordersList.length <= 0) {
        return <TableNoData
            isMobile
            title={t('futures:order_table:no_opening_order')}
            className="h-full min-h-[300px]" />;
    }

    return (
        <div className="px-4 overflow-x-auto" style={{ height: 'calc(100% - 173px)' }}>
            {visibleModalFees && <CurrencyPopup
                visibleModalFees={visibleModalFees}
                setVisibleModalFees={setVisibleModalFees}
                dataRow={rowData.current}
            />
            }
            {openEditModal &&
                <EditSLTPVndcMobile
                    onusMode={true}
                    isVisible={openEditModal}
                    order={rowData.current}
                    onClose={() => !disabled && setOpenEditModal(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirmEdit}
                    pairConfig={pairConfig}
                    pairTicker={marketWatch}
                    isMobile
                    disabled={disabled}
                />
            }
            <div className="min-h-[100px]">
                {renderListOrder()}
            </div>
            {
                orderEditMarginId &&
                <AdjustPositionMargin
                    order={orderEditMargin}
                    pairPrice={marketWatch[orderEditMargin?.symbol]}
                    onClose={() => setOrderEditMarginId()}
                />
            }
            {openAddVol &&
                <ModifyOrder
                    order={rowData.current}
                    pairPrice={marketWatch[rowData.current?.symbol]}
                    onClose={() => setOpenAddVol(false)}
                    pairConfig={pairConfig}
                />
            }
            {openCloseOrderModal &&
                <CloseOrderModalMobile
                    onClose={() => setOpenCloseOrderModal(false)} order={rowData.current}
                    pairPrice={marketWatch[rowData.current?.symbol]}
                    pairConfig={pairConfig}

                />
            }
        </div>
    );
};

export default TabOpenOrders;
