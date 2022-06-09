import React, { useMemo, useRef, useState, useContext } from 'react';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import TradingInput from '../../../trade/TradingInput';
import { SideComponent, OrderItem } from './TabOrders/OrderItemMobile';
import { useSelector } from 'react-redux'
import { renderCellTable, VndcFutureOrderType, getProfitVndc } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import { formatNumber, formatTime, countDecimals, getS3Url } from 'redux/actions/utils'
import { useTranslation } from 'next-i18next'
import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc';
import Button from 'components/common/Button';
import { AlertContext } from 'components/common/layouts/LayoutMobile'
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus, FuturesOrderEnum } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api'
import ShareFutureMobile from 'components/screens/Mobile/Futures/TabOrders/ShareFutureMobile'


const OrderOpenDetail = ({ order, isDark, pairConfig, decimal, onClose, changeSLTP }) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const status = order?.status;
    const oldOrder = useRef(order);
    const [data, setData] = useState({
        displaying_id: order?.displaying_id,
        price: +(status === VndcFutureOrderType.Status.PENDING ? order?.price : status === VndcFutureOrderType.Status.ACTIVE ? order?.open_price : order?.close_price),
        sl: +order?.sl,
        tp: +order?.tp,
    });
    const marketWatch = useSelector((state) => state.futures.marketWatch)
    const dataMarketWatch = marketWatch[order?.symbol]
    const profit = dataMarketWatch && getProfitVndc(order, dataMarketWatch?.lastPrice)
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const rowData = useRef(null);
    const [loading, setLoading] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);

    const onConfirmSLTP = (e) => {
        setData(e);
        setShowEditSLTP(!showEditSLTP);
    }

    const onOpenModify = () => {
        rowData.current = { ...oldOrder.current, ...data, quoteAsset: pairConfig?.quoteAsset };
        setShowEditSLTP(!showEditSLTP);
    }

    const onActions = (isDiff) => {
        if (!isDiff) {
            context.alert.show('warning',
                t('futures:close_order:modal_title', { value: order?.displaying_id }),
                <div dangerouslySetInnerHTML={{ __html: t('futures:close_order:confirm_message', { value: order?.displaying_id }) }}></div>,
                null,
                () => {
                    const params = {
                        displaying_id: order?.displaying_id,
                        special_mode: 1
                    }
                    fetchOrder('DELETE', params, () => {
                        context.alert.show('success', t('common:success'), t('futures:close_order:request_successfully', { value: order?.displaying_id }))
                        onClose();
                    });
                }
            )
        } else {
            fetchOrder('PUT', data, () => {
                oldOrder.current = { ...oldOrder.current, ...data };
                changeSLTP([oldOrder.current]);
                localStorage.setItem('edited_id', data.displaying_id);
                context.alert.show('success', t('common:success'), t('futures:modify_order_success'))
            });
        }
    }

    const fetchOrder = async (method = 'DELETE', params, cb) => {
        setLoading(true)
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
            setLoading(false)
        }
    }

    const isDiff = useMemo(() => {
        return oldOrder.current?.sl !== data.sl || oldOrder.current?.tp !== data.tp || (status === VndcFutureOrderType.Status.PENDING && oldOrder.current?.price !== data.price)
    }, [data, oldOrder.current])

    return (
        <div className="py-[24px]">
            {showEditSLTP &&
                <FuturesEditSLTPVndc
                    isVisible={showEditSLTP}
                    order={rowData.current}
                    onClose={() => setShowEditSLTP(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirmSLTP}
                    lastPrice={dataMarketWatch?.lastPrice}
                    isMobile
                />
            }
            {openShareModal && <ShareFutureMobile
                isVisible={openShareModal} order={oldOrder.current}
                onClose={() => setOpenShareModal(false)}
                pairPrice={marketWatch[oldOrder.current?.symbol]}
            />}
            <div className="flex items-center justify-between mb-[10px]">
                <div className="flex flex-col" >
                    {/* <SideComponent isDark={isDark} isBuy={order.side === VndcFutureOrderType.Side.BUY}>{renderCellTable('side', order)}</SideComponent> */}
                    <div className="flex items-center">
                        <div className="font-semibold text-sm mr-[10px]">{(pairConfig?.baseAsset ?? '-') + '/' + (pairConfig?.quoteAsset ?? '-')}</div>
                        <div className="text-teal border-teal border-[1px] text-xs px-[5px] rounded-[2px]">{order?.leverage}x</div>
                    </div>
                    <div className={`text-xs font-medium ${order.side === FuturesOrderEnum.Side.BUY ? 'text-teal': 'text-red'}`}>
                        <span>{renderCellTable('side', order)}</span>&nbsp;/&nbsp;
                        <span>{renderCellTable('type', order)}</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="text-xs ">
                        <div className="text-gray-1 dark:text-txtSecondary-dark py-[1px]">{formatTime(order?.created_at, 'yyyy-MM-dd HH:mm:ss')}</div>
                        <div className="text-xs font-medium text-teal py-[1px] float-right">
                            <OrderProfit className="flex" order={order} pairPrice={dataMarketWatch} isTabHistory={false} isMobile />
                        </div>
                    </div>
                    {profit ?
                        <div className="border-[1px] border-teal p-[5px] rounded-[2px] ml-[16px]" onClick={() => setOpenShareModal(true)}>
                            <img src={getS3Url("/images/icon/ic_share.png")} height={16} width={16} />
                        </div>
                        : null
                    }
                </div>
            </div>
            {/* <div className="justify-start w-full flex mb-[10px]">
                <div className="text-gray-1 text-xs dark:text-txtSecondary-dark min-w-[70px]">{t('futures:mobile:pnl')}</div>
                <span className="text-xs font-medium text-teal"><OrderProfit className="flex" isMobile order={order} pairPrice={dataMarketWatch} isTabHistory={false} /></span>
            </div> */}
            <div className="flex flex-wrap gap-x-[10px] w-full">
                <OrderItem label={t('futures:order_table:volume')} value={formatNumber(order?.order_value, 0, 0, true)} />
                <OrderItem label={t('futures:margin')} value={formatNumber(order?.margin, 0, 0, true)} />
                {status === VndcFutureOrderType.Status.PENDING ?
                    <div style={{ width: 'calc(50% - 5px)' }} className="mb-2">
                        <TradingInput
                            thousandSeparator={true}
                            label={'Price'}
                            value={data?.price}
                            allowNegative={false}
                            onValueChange={({ floatValue = '' }) => setData({ ...data, price: floatValue })}
                            decimalScale={decimal}
                            labelClassName='whitespace-nowrap capitalize'
                            containerClassName="h-[36px]"
                            tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                            renderTail={() => (
                                <div className='relative group select-none' onClick={onOpenModify}>
                                    <div className='flex items-center'>
                                        <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                                    </div>
                                </div>
                            )}
                            inputClassName="text-xs !text-center"
                            inputMode="decimal"
                            allowedDecimalSeparators={[',', '.']}
                        />
                    </div>
                    :
                    <OrderItem label={t('futures:order_table:open_price')} value={formatNumber(data?.price, decimal, 0, true)} />
                }
                <OrderItem label={t('futures:tp_sl:mark_price')} value={formatNumber(dataMarketWatch?.lastPrice, decimal, 0, true)} />
            </div>
            <div className="flex gap-x-[10px] w-full">
                <div style={{ width: 'calc(50% - 5px)' }}>
                    <TradingInput
                        thousandSeparator={true}
                        label={'SL'}
                        value={data?.sl}
                        allowNegative={false}
                        onValueChange={({ floatValue = '' }) => setData({ ...data, sl: floatValue })}
                        decimalScale={decimal}
                        labelClassName='whitespace-nowrap capitalize'
                        containerClassName="h-[36px]"
                        tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                        renderTail={() => (
                            <div className='relative group select-none' onClick={onOpenModify}>
                                <div className='flex items-center'>
                                    <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                                </div>
                            </div>
                        )}
                        inputClassName="text-xs !text-center"
                        inputMode="decimal"
                        allowedDecimalSeparators={[',', '.']}
                    />
                </div>
                <div style={{ width: 'calc(50% - 5px)' }}>
                    <TradingInput
                        thousandSeparator={true}
                        label={'TP'}
                        value={data?.tp}
                        allowNegative={false}
                        onValueChange={({ floatValue = '' }) => setData({ ...data, tp: floatValue })}
                        decimalScale={decimal}
                        labelClassName='whitespace-nowrap capitalize'
                        containerClassName="h-[36px]"
                        tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                        renderTail={() => (
                            <div className='relative group select-none' onClick={onOpenModify}>
                                <div className='flex items-center'>
                                    <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                                </div>
                            </div>
                        )}
                        inputClassName="text-xs !text-center"
                        inputMode="decimal"
                        allowedDecimalSeparators={[',', '.']}
                    />
                </div>
            </div>
            <div className="flex gap-x-[10px] w-full mt-5">
                <div style={{ width: 'calc(50% - 5px)' }}>
                    <Button
                        title={t('futures:mobile:back_to_list')}
                        className={`!h-[36px]`}
                        componentType="button"
                        onClick={onClose}
                    />
                </div>
                <div style={{ width: 'calc(50% - 5px)' }}>
                    <Button
                        title={t(`futures:mobile:${isDiff ? 'modify' : 'close_now'}`)}
                        className={`!h-[36px] ${isDiff ? '' : '!bg-red'} !text-white`}
                        componentType="button"
                        type="primary"
                        onClick={() => onActions(isDiff)}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderOpenDetail;
