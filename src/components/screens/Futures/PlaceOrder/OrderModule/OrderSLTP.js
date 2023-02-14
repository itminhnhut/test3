import TradingInput from 'components/trade/TradingInput';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useMemo, useRef, useState } from 'react';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import { AddCircleIcon } from 'components/svg/SvgIcon';
import EditSLTPV2 from 'components/screens/Futures/PlaceOrder/EditOrderV2/EditSLTPV2';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';

const FuturesOrderSLTP = ({
    orderSlTp,
    setOrderSlTp,
    decimals,
    side,
    pairConfig,
    price,
    lastPrice,
    ask,
    bid,
    type,
    leverage,
    isAuth,
    inputValidator,
    quoteQty
}) => {
    const useSltp = useSelector((state) => state.futures.preloadedState?.useSltp) || false;

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const rowData = useRef(null);
    const _price = type === FuturesOrderTypes.Market ? (VndcFutureOrderType.Side.BUY === side ? ask : bid) : price;

    const canShowChangeTpSL = useMemo(() => {
        const ArrStop = [FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit];
        return !(!quoteQty || !inputValidator('price', ArrStop.includes(type)).isValid || !inputValidator('quoteQty').isValid || !isAuth);
    }, [isAuth, type, pairConfig, price, side, leverage, quoteQty]);

    const onChangeTpSL = (key) => {
        rowData.current = {
            fee: 0,
            side: side,
            quantity: quoteQty / lastPrice,
            status: 0,
            price: _price,
            quoteAsset: pairConfig.quoteAsset,
            leverage: leverage,
            symbol: pairConfig.symbol,
            ...orderSlTp
        };
        setShowEditSLTP(true);
    };

    const onConfirm = (data) => {
        setOrderSlTp({
            tp: data.tp,
            sl: data.sl
        });
        setShowEditSLTP(false);
        setShowAlert(true);
    };

    return (
        <div className="space-y-4 mt-4">
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
                type="success"
                title={t('common:success')}
                message={t('futures:modify_order_success')}
            />
            {showEditSLTP && (
                <EditSLTPV2
                    isVisible={showEditSLTP}
                    order={rowData.current}
                    onClose={() => setShowEditSLTP(false)}
                    status={rowData.current?.status}
                    onConfirm={onConfirm}
                    lastPrice={lastPrice}
                    decimals={decimals}
                />
            )}

            <TradingInput
                label={t('futures:take_profit')}
                allowNegative={false}
                value={orderSlTp.tp}
                decimalScale={decimals.price}
                validator={inputValidator('take_profit')}
                onValueChange={({ value }) => setOrderSlTp({ ...orderSlTp, tp: value })}
                labelClassName="whitespace-nowrap"
                containerClassName="w-full dark:bg-dark-2"
                tailContainerClassName="flex items-center font-medium text-xs select-none"
                renderTail={() =>
                    canShowChangeTpSL && (
                        <div data-tip="" data-for="tooltipTPSL" className=" flex items-center cursor-pointer" onClick={() => onChangeTpSL('tp')}>
                            <AddCircleIcon />
                        </div>
                    )
                }
            />

            <TradingInput
                containerClassName="w-full dark:bg-dark-2"
                label={t('futures:stop_loss')}
                allowNegative={false}
                value={orderSlTp.sl}
                decimalScale={decimals.price}
                validator={inputValidator('stop_loss')}
                onValueChange={({ value }) => setOrderSlTp({ ...orderSlTp, sl: value })}
                labelClassName="whitespace-nowrap"
                tailContainerClassName="flex items-center font-medium text-xs select-none"
                renderTail={() =>
                    canShowChangeTpSL && (
                        <div data-tip="" data-for="tooltipTPSL" className="flex items-center cursor-pointer" onClick={() => onChangeTpSL('sl')}>
                            <AddCircleIcon />
                        </div>
                    )
                }
            />
        </div>
    );
};

export default FuturesOrderSLTP;
