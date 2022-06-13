import React, { useMemo, useState, useRef, useContext } from 'react';
import CheckBox from 'components/common/CheckBox'
import { useTranslation } from 'next-i18next'
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import TableNoData from 'components/common/table.old/TableNoData';
// import OrderClose from 'components/screens/Futures/PlaceOrder/Vndc/OrderClose';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'
import fetchApi from 'utils/fetch-api'
import { AlertContext } from 'components/common/layouts/LayoutMobile'
import OrderItemMobile from './OrderItemMobile'
import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc'
import ShareFutureMobile, { getShareModalData } from './ShareFutureMobile';
import { emitWebViewEvent } from 'redux/actions/utils';

const TabOpenOrders = ({ ordersList, pair, isAuth, isDark, pairConfig, onShowDetail }) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const [hideOther, setHideOther] = useState(false)
    const marketWatch = useSelector((state) => state.futures.marketWatch)
    const dataFilter = useMemo(() => {
        return hideOther ? ordersList.filter(order => order?.symbol === pair) : ordersList;
    }, [hideOther, ordersList, pair])
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const rowData = useRef(null);
    const [openCloseModal, setOpenCloseModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);

    const onShowModal = (item, key) => {
        rowData.current = item;
        switch (key) {
            case 'delete':
                context.alert.show('warning',
                    t('futures:close_order:modal_title', { value: item?.displaying_id }),
                    <div dangerouslySetInnerHTML={{ __html: t('futures:close_order:confirm_message', { value: item?.displaying_id }) }}></div>,
                    null,
                    () => {
                        onConfirmDelete(item);
                    }
                )
                // setOpenCloseModal(!openCloseModal);
                break;
            case 'edit':
                setOpenEditModal(!openEditModal);
                break;
            default:

                if (!openShareModal) {
                    const shareModalData = getShareModalData({ order: rowData.current, pairPrice: marketWatch[rowData.current?.symbol] })
                    emitWebViewEvent(JSON.stringify(shareModalData))
                }
                // setOpenShareModal(!openShareModal)
                break;
        }
    }

    const fetchOrder = async (method = 'DELETE', params, cb) => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method },
                params: params,
            })
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data?.orders);
            } else {
                context.alert.show('error', t('commom:failed'), message)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setOpenCloseModal(false);
            setOpenEditModal(false);
        }
    }

    const onConfirmDelete = async (item) => {
        const id = item ? item.displaying_id : rowData.current.displaying_id;
        const params = {
            displaying_id: id,
            special_mode: 1
        }
        fetchOrder('DELETE', params, () => {
            context.alert.show('success', t('futures:close_order:modal_title', { value: id }), t('futures:close_order:request_successfully', { value: id }))
        });
    }

    const onConfirmEdit = (params) => {
        fetchOrder('PUT', params, () => {
            localStorage.setItem('edited_id', params.displaying_id);
            context.alert.show('success', t('common:success'), t('futures:modify_order_success'))
        });
    }

    if (ordersList.length <= 0) return <TableNoData title={t('futures:order_table:no_opening_order')} className="h-full min-h-[300px]" />

    return (
        <div className="px-[16px] pt-[10px] overflow-x-auto" style={{ height: 'calc(100% - 114px)' }}>
            {openEditModal &&
                <FuturesEditSLTPVndc
                    onusMode={true}
                    isVisible={openEditModal}
                    order={rowData.current}
                    onClose={() => setOpenEditModal(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirmEdit}
                    pairConfig={pairConfig}
                    pairTicker={marketWatch}
                    isMobile
                />
            }
            {openShareModal && <ShareFutureMobile
                isVisible={openShareModal} order={rowData.current}
                onClose={() => setOpenShareModal(false)}
                pairPrice={marketWatch[rowData.current?.symbol]}
            />}
            {/* <OrderClose open={openCloseModal} onClose={setOpenCloseModal} data={rowData.current} onConfirm={onConfirmDelete} isMobile /> */}
            <div
                className='flex items-center text-sm font-medium select-none cursor-pointer'
                onClick={() => setHideOther(!hideOther)}
            >
                <CheckBox active={hideOther} />
                <span className='ml-3 whitespace-nowrap text-gray-1 font-medium capitalize dark:text-onus-gray text-xs'>
                    {t('futures:hide_other_symbols')}
                </span>
            </div>
            <div className='min-h-[100px]'>
                {dataFilter?.map((order, i) => {
                    const dataMarketWatch = marketWatch[order?.symbol];
                    const symbol = allPairConfigs.find(rs => rs.symbol === order.symbol);
                    return (
                        <OrderItemMobile key={i} order={order} dataMarketWatch={dataMarketWatch}
                            onShowModal={onShowModal} allowButton isDark={isDark} symbol={symbol}
                            onShowDetail={onShowDetail}
                        />
                    )
                })}
            </div>
        </div>
    );
};


export default TabOpenOrders;
