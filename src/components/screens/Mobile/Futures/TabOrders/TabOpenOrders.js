import React, { useMemo, useState, useRef, useContext } from 'react';
import CheckBox from 'components/common/CheckBox'
import { useTranslation } from 'next-i18next'
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import TableNoData from 'components/common/table.old/TableNoData';
import OrderClose from 'components/screens/Futures/PlaceOrder/Vndc/OrderClose';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'
import fetchApi from 'utils/fetch-api'
import { AlertContext } from 'components/common/layouts/LayoutMobile'
import OrderItemMobile from './OrderItemMobile'
import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc'

const TabOpenOrders = ({ ordersList, pair, isAuth, isDark, pairConfig }) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const [hideOther, setHideOther] = useState(false)
    const marketWatch = useSelector((state) => state.futures.marketWatch)
    const dataFilter = useMemo(() => {
        return hideOther ? ordersList.filter(order => order?.symbol === pair) : ordersList;
    }, [hideOther, ordersList, pair])

    const [openModalClose, setOpenModalClose] = useState(false);
    const rowData = useRef(null);
    const [showModalEdit, setShowModalEdit] = useState(false);

    const openModal = (item) => {
        rowData.current = item
        setOpenModalClose(!openModalClose);
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
            setOpenModalClose(false);
            setShowModalEdit(false);
        }
    }

    const onConfirmDelete = async () => {
        const params = {
            displaying_id: rowData.current.displaying_id,
            special_mode: 1
        }
        fetchOrder('DELETE', params, () => {
            context.alert.show('success', t('commom:success'), t('futures:close_order:close_successfully', { value: rowData.current?.displaying_id }))
        });
    }

    const onShowEdit = (item) => {
        rowData.current = item;
        setShowModalEdit(!showModalEdit);
    }

    const onConfirmEdit = (params) => {
        fetchOrder('PUT', params, () => {
            localStorage.setItem('edited_id', params.displaying_id);
            context.alert.show('success', t('commom:success'), t('futures:modify_order_success'))
        });
    }

    if (ordersList.length <= 0) return <TableNoData className="h-full" />

    return (
        <div className="px-[16px] pt-[10px] overflow-x-auto" style={{ height: 'calc(100% - 114px)' }}>
            {showModalEdit &&
                <FuturesEditSLTPVndc
                    isVisible={showModalEdit}
                    order={rowData.current}
                    onClose={() => setShowModalEdit(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirmEdit}
                    pairConfig={pairConfig}
                    pairTicker={marketWatch}
                    isMobile
                />
            }
            <OrderClose open={openModalClose} onClose={openModal} data={rowData.current} onConfirm={onConfirmDelete} isMobile />
            <div
                className='flex items-center text-sm font-medium select-none cursor-pointer'
                onClick={() => setHideOther(!hideOther)}
            >
                <CheckBox active={hideOther} />{' '}
                <span className='ml-1 whitespace-nowrap text-gray font-medium capitalize dark:text-txtSecondary-dark'>
                    {t('futures:hide_other_symbols')}
                </span>
            </div>
            <div>
                {dataFilter?.map((order, i) => {
                    const dataMarketWatch = marketWatch[order?.symbol];
                    return (
                        <OrderItemMobile key={i} order={order} dataMarketWatch={dataMarketWatch}
                            openModal={openModal} isDark={isDark} onShowEdit={onShowEdit}
                        />
                    )
                })}
            </div>
        </div>
    );
};


export default TabOpenOrders;