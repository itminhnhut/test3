import React, { useContext, useRef, useState } from 'react';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useTranslation } from 'next-i18next';
import { emitWebViewEvent, formatNumber, getSignature, getType } from 'redux/actions/utils';
import { FuturesOrderTypes, FuturesOrderTypes as OrderTypes, FuturesSettings } from 'redux/reducers/futures';
import { getPrice } from 'components/screens/Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc';
import { placeFuturesOrder, reFetchOrderListInterval } from 'redux/actions/futures';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { useDispatch, useSelector } from 'react-redux';
import OrderConfirm from 'components/screens/Nao_futures/Futures/PlaceOrder/OrderConfirm';
import _ from 'lodash';

const OrderButtonMobile = ({
    side,
    price,
    size,
    stopPrice,
    type,
    decimals,
    pairConfig,
    pairPrice,
    leverage,
    sl,
    tp,
    isAuth,
    isError,
    quoteQty,
    decimalSymbol = 0
}) => {
    const context = useContext(AlertContext);
    const [disabled, setDisabled] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth?.user);
    const isBuy = VndcFutureOrderType.Side.BUY === side;
    const _price = getPrice(getType(type), side, price, pairPrice?.ask, pairPrice?.bid, stopPrice);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const rowData = useRef(null);
    const settings = useSelector((state) => state.futures.settings);

    const getTypesLabel = (type) => {
        switch (type) {
            case OrderTypes.Limit:
                return t('trade:order_types.limit');
            case OrderTypes.StopLimit:
                return t('trade:order_types.stop_limit');
            case OrderTypes.Market:
                return t('trade:order_types.market');
            case OrderTypes.StopMarket:
                return t('trade:order_types.stop_market');
            case OrderTypes.TrailingStopMarket:
                return t('trade:order_types.trailing_stop');
            default:
                return '--';
        }
    };

    const handlePlaceOrder = async () => {
        const requestId = Math.floor(Date.now() / 2000);
        setDisabled(true);
        const timestamp = Date.now()
        const signature = getSignature(auth?.code, timestamp)
        const params = {
            product: 2,
            symbol: pairConfig?.symbol,
            type: getType(type),
            side: side,
            quantity: size,
            price: _price,
            leverage,
            sl: sl,
            tp: tp,
            quoteQty,
            useQuoteQty: true,
            requestId,
            signature,
            timestamp
        };
        placeFuturesOrder(params, { alert: context?.alert }, t, () => {
            setTimeout(() => {
                setDisabled(false);
            }, 1000);
            setShowConfirmModal(false);
            dispatch(reFetchOrderListInterval(2, 5000, true));
        });
    };

    const onHandleSave = () => {
        if (!isAuth) {
            emitWebViewEvent('login');
            return;
        }
        if (isError || disabled) return;
        if (settings?.user_setting?.[FuturesSettings.order_confirm] || _.isEmpty(settings)) {
            rowData.current = {
                baseAsset: pairConfig?.baseAsset,
                quoteAsset: pairConfig?.quoteAsset,
                symbol: pairConfig?.symbol,
                type: getType(type),
                side: side,
                quantity: size,
                price: _price,
                leverage,
                sl: sl,
                tp: tp,
                quoteQty
            };
            setShowConfirmModal(true);
        } else {
            handlePlaceOrder();
        }
    };

    const classNameError = disabled || (isAuth && isError) ? 'cursor-not-allowed !bg-gray-12 dark:!bg-dark-2 !text-txtDisabled dark:!text-txtDisabled-dark' : '';
    const title =
        type === FuturesOrderTypes.Limit
            ? t('futures:mobile:limit')
            : type === FuturesOrderTypes.StopMarket
            ? 'stop market'
            : type === FuturesOrderTypes.StopLimit
            ? 'stop limit'
            : '';

    // const isShowConfirm = useMemo(() => {
    //     if (typeof window === 'undefined') return false;
    //     let isShowConfirm = localStorage.getItem('show_order_confirm');
    //     if (isShowConfirm) {
    //         isShowConfirm = JSON.parse(isShowConfirm);
    //         return isShowConfirm.hidden;
    //     }
    //     return false;
    // }, [showConfirmModal]);

    return (
        <>
            {showConfirmModal && (
                <OrderConfirm
                    disabled={disabled}
                    isShowConfirm={false}
                    open={showConfirmModal}
                    data={rowData.current}
                    decimals={decimals}
                    onConfirm={handlePlaceOrder}
                    decimalSymbol={decimalSymbol}
                    onClose={() => !disabled && setShowConfirmModal(false)}
                />
            )}
            <div
                onClick={onHandleSave}
                className={`${
                    isBuy ? 'bg-green-2 active:bg-bgBtnV2-pressed' : 'bg-red-2 active:bg-red-1'
                } text-white text-sm h-[56px] rounded-[6px] flex flex-col items-center justify-center ${classNameError}`}
            >
                <div className="font-semibold text-center">
                    {!isAuth ? t('futures:mobile:login_short') : (isBuy ? t('common:buy') : t('common:sell')) + ' ' + title}
                </div>
                <div className="font-medium break-all text-center">{formatNumber(_price, decimals.decimalScalePrice, 0, true)}</div>
            </div>
        </>
    );
};

export default OrderButtonMobile;
