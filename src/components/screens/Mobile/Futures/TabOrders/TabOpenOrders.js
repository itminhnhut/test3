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

const TabOpenOrders = ({ ordersList, pair, isAuth, isDark }) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const [hideOther, setHideOther] = useState(false)
    const marketWatch = useSelector((state) => state.futures.marketWatch)
    const dataFilter = useMemo(() => {
        return hideOther ? ordersList.filter(order => order?.symbol === pair) : ordersList;
    }, [hideOther, ordersList, pair])

    const [openModalClose, setOpenModalClose] = useState(false);
    const rowData = useRef(null);

    const openModal = (item) => {
        rowData.current = item
        setOpenModalClose(!openModalClose);
    }

    const onConfirm = async () => {
        const params = {
            displaying_id: rowData.current.displaying_id,
            special_mode: 1
        }
        try {
            const { status, data, message } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method: 'DELETE' },
                params: params,
            })
            if (status === ApiStatus.SUCCESS) {
                context.alert.show('success', t('commom:success'), t('futures:close_order:close_successfully', { value: rowData.current?.displaying_id }))
            } else {
                context.alert.show('error', t('commom:failed'), message)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setOpenModalClose(!openModalClose);
        }
    }

    if (ordersList.length <= 0) return <TableNoData />

    return (
        <div className="px-[16px] pt-[10px] overflow-x-auto" style={{ height: 'calc(100% - 114px)' }}>
            <OrderClose open={openModalClose} onClose={openModal} data={rowData.current} onConfirm={onConfirm} isMobile />
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
                            openModal={openModal} isDark={isDark}
                        />
                    )
                })}
            </div>
        </div>
    );
};


export default TabOpenOrders;