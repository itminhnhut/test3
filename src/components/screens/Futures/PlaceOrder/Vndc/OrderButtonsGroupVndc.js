import { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { placeFuturesOrder, fetchFuturesSetting } from 'redux/actions/futures';
import { useTranslation } from 'next-i18next';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { getLoginUrl, formatNumber, TypeTable, getType } from 'src/redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import CheckBox from 'components/common/CheckBox';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { FuturesSettings } from 'redux/reducers/futures';
import { useDispatch, useSelector } from 'react-redux';

export const getPrice = (type, side, price, ask, bid, stopPrice) => {
    if (type === VndcFutureOrderType.Type.MARKET) return VndcFutureOrderType.Side.BUY === side ? ask : bid;
    if (type === VndcFutureOrderType.Type.STOP) return Number(stopPrice);
    return Number(price);
};

const FuturesOrderButtonsGroupVndc = ({
    pairConfig,
    type,
    quoteQty,
    price,
    lastPrice,
    leverage,
    orderSlTp,
    isError,
    ask,
    bid,
    isAuth,
    decimals,
    side,
    isMarket
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.futures.settings);
    const [loading, setLoading] = useState(false);
    const _price = getPrice(getType(type), side, price, ask, bid, price);
    const [showModal, setShowModal] = useState('');
    const [hidden, setHidden] = useState(false);
    const messages = useRef(null);

    const isShowConfirm = useMemo(() => {
        return settings?.user_setting ? settings?.user_setting?.show_place_order_confirm_modal : true;
    }, [settings]);

    const handleParams = (side) => {
        const requestId = Math.floor(Date.now() / 2000);
        const params = {
            symbol: pairConfig?.symbol,
            type: getType(type),
            side: side,
            price: +_price,
            leverage,
            sl: +orderSlTp?.sl,
            tp: +orderSlTp?.tp,
            quoteQty: +quoteQty,
            useQuoteQty: true,
            requestId
        };
        return params;
    };

    const onSave = () => {
        setLoading(true);
        placeFuturesOrder(
            handleParams(side),
            {
                filters: pairConfig?.filters,
                lastPrice,
                isMarket: [FuturesOrderTypes.Market, FuturesOrderTypes.StopMarket].includes(type)
            },
            t,
            (data) => {
                messages.current = data;
                setLoading(false);
                setShowModal('alert');
                setHidden(isShowConfirm);
            }
        );
    };

    const onHandleClick = () => {
        if (!isAuth) {
            window.open(getLoginUrl('sso', 'login'), '_self');
            return;
        }
        if (isError) return;
        if (isShowConfirm) {
            setShowModal('confirm');
            setHidden(false);
        } else {
            onSave();
        }
    };

    const onHandleHidden = () => {
        const params = {
            setting: {
                [FuturesSettings.order_confirm]: hidden
            }
        };
        dispatch(fetchFuturesSetting(params));
        setHidden(!hidden);
    };

    const title =
        type === FuturesOrderTypes.Limit
            ? t('futures:mobile:limit')
            : type === FuturesOrderTypes.StopMarket
            ? 'stop market'
            : type === FuturesOrderTypes.StopLimit
            ? 'stop limit'
            : '';

    const isBuy = VndcFutureOrderType.Side.BUY === side;
    const margin = quoteQty / leverage;

    return (
        <>
            <AlertModalV2
                isVisible={showModal === 'alert'}
                onClose={() => setShowModal('')}
                type={messages.current?.status}
                title={messages.current?.title}
                message={messages.current?.message}
                notes={messages.current?.notes}
                className="max-w-[448px]"
            />
            <ModalV2 loading={loading} className="!max-w-[448px] text-base" isVisible={showModal === 'confirm'} onBackdropCb={() => setShowModal('')}>
                <div className="text-2xl mb-6 font-semibold">{t('futures:preferences:order_confirm')}</div>
                <div className="p-4 mb-6 rounded-md border border-divider dark:border-divider-dark divide-y divide-divider dark:divide-divider-dark space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:mobile:leverage_v2')}</span>
                        <div className="font-semibold space-x-1">
                            <span>
                                {VndcFutureOrderType.Side.BUY === side ? 'Long' : 'Short'} {pairConfig?.baseAsset}/{pairConfig?.quoteAsset}
                            </span>
                            <span className="text-teal">{leverage}x</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:type')}</span>
                        <span className="font-semibold">
                            <TypeTable type="type" data={{ type: type }} />
                        </span>
                    </div>
                    {!isMarket && (
                        <div className="flex items-center justify-between pt-3">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:price')}</span>
                            <span className="font-semibold">{formatNumber(price, decimals.price)}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between pt-3">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:margin')}</span>
                        <span className="font-semibold">
                            {formatNumber(margin, decimals.symbol)} {pairConfig?.quoteAsset}
                        </span>
                    </div>
                    {orderSlTp.sl && (
                        <div className="flex items-center justify-between pt-3">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:stop_loss')}</span>
                            <span className="font-semibold text-red">{formatNumber(orderSlTp.sl, decimals.price)}</span>
                        </div>
                    )}
                    {orderSlTp.tp && (
                        <div className="flex items-center justify-between pt-3">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:take_profit')}</span>
                            <span className="font-semibold text-teal">{formatNumber(orderSlTp.tp, decimals.price)}</span>
                        </div>
                    )}
                </div>
                <CheckBox
                    onChange={onHandleHidden}
                    isV3
                    active={hidden}
                    className="h-full"
                    labelClassName="!text-base"
                    label={t('futures:mobile:not_show_this_message')}
                />
                <ButtonV2 disabled={loading} onClick={onSave} loading={loading} className="mt-10">
                    {t('common:confirm')}
                </ButtonV2>
            </ModalV2>
            <div className="!mt-8">
                {!isAuth ? (
                    <>
                        <a href={getLoginUrl('sso', 'register')}>
                            <ButtonV2>{t('common:sign_up')}</ButtonV2>
                        </a>
                        <a href={getLoginUrl('sso')}>
                            <ButtonV2 className="mt-3" variants="secondary">
                                {t('common:sign_in')}
                            </ButtonV2>
                        </a>
                    </>
                ) : (
                    <ButtonV2
                        onClick={() => onHandleClick(isBuy ? VndcFutureOrderType.Side.BUY : VndcFutureOrderType.Side.SELL)}
                        disabled={isError}
                        className={`flex flex-col !h-[60px]`}
                        variants={isBuy ? 'primary' : 'red'}
                    >
                        <span>{(isBuy ? t('common:buy') : t('common:sell')) + ' ' + title}</span>
                        <span className="text-xs">{formatNumber(_price, decimals.price)}</span>
                    </ButtonV2>
                )}
            </div>
        </>
    );
};

export default FuturesOrderButtonsGroupVndc;
