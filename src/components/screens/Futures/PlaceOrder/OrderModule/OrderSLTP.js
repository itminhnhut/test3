import TradingInput from 'components/trade/TradingInput';
import { useTranslation } from 'next-i18next';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useMemo, useRef, useState } from 'react';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import { AddCircleIcon } from 'components/svg/SvgIcon';
import EditSLTPV2 from 'components/screens/Futures/PlaceOrder/EditOrderV2/EditSLTPV2';
import colors from 'styles/colors';

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
    quoteQty,
    isDark,
    textDescription
}) => {
    const { t } = useTranslation();
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const rowData = useRef(null);
    const _price = type === FuturesOrderTypes.Market ? (VndcFutureOrderType.Side.BUY === side ? ask : bid) : price;

    const canShowChangeTpSL = useMemo(() => {
        const ArrStop = [];
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
        // setShowAlert(true);
    };

    return (
        <div className="space-y-4 mt-4">
            <EditSLTPV2
                isVisible={showEditSLTP}
                order={rowData.current}
                onClose={() => setShowEditSLTP(false)}
                status={rowData.current?.status}
                onConfirm={onConfirm}
                lastPrice={lastPrice}
                decimals={decimals}
            />

            <TradingInput
                label={t('futures:take_profit')}
                clearAble
                allowNegative={false}
                value={orderSlTp.tp}
                decimalScale={decimals.price}
                validator={inputValidator('take_profit')}
                onValueChange={({ value }) => setOrderSlTp({ ...orderSlTp, tp: value })}
                labelClassName="whitespace-nowrap"
                containerClassName="w-full dark:bg-dark-2"
                tailContainerClassName="flex items-center font-medium text-xs select-none"
                renderTail={
                    canShowChangeTpSL && <AddCircleIcon className="cursor-pointer" color={isDark ? colors.gray[1] : colors.gray[7]} onClick={onChangeTpSL} />
                }
                errorTooltip={false}
                textDescription={textDescription('take_profit', inputValidator('take_profit', true))}
            />

            <TradingInput
                containerClassName="w-full dark:bg-dark-2"
                clearAble
                label={t('futures:stop_loss')}
                allowNegative={false}
                value={orderSlTp.sl}
                decimalScale={decimals.price}
                validator={inputValidator('stop_loss')}
                onValueChange={({ value }) => setOrderSlTp({ ...orderSlTp, sl: value })}
                labelClassName="whitespace-nowrap"
                tailContainerClassName="flex items-center font-medium text-xs select-none"
                renderTail={
                    canShowChangeTpSL && <AddCircleIcon className="cursor-pointer" color={isDark ? colors.gray[1] : colors.gray[7]} onClick={onChangeTpSL} />
                }
                errorTooltip={false}
                textDescription={textDescription('stop_loss', inputValidator('stop_loss', true))}
            />
        </div>
    );
};

export default FuturesOrderSLTP;
