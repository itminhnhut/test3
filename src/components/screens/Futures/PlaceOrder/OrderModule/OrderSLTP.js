import CheckBox from 'components/common/CheckBox';
import TradingInput from 'components/trade/TradingInput';
import { SET_FUTURES_PRELOADED_FORM } from 'redux/actions/types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { ChevronDown } from 'react-feather';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { getS3Url } from 'redux/actions/utils';
import { useMemo, useRef, useState } from 'react';
import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc';
import Tooltip from 'components/common/Tooltip';
import { FuturesOrderTypes } from 'redux/reducers/futures';

const FuturesOrderSLTP = ({
    isVndcFutures, orderSlTp,
    setOrderSlTp, decimalScalePrice,
    getValidator, side, pairConfig,
    size, price, stopPrice, lastPrice,
    ask, bid, currentType, leverage,
    isAuth
}) => {
    const useSltp =
        useSelector((state) => state.futures.preloadedState?.useSltp) || false

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const rowData = useRef(null);
    const _price = currentType === FuturesOrderTypes.Market ? (VndcFutureOrderType.Side.BUY === side ? ask : bid) :
        price;

    const isError = useMemo(() => {
        const ArrStop = [FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit]
        const not_valid = !size || !getValidator('price', ArrStop.includes(currentType)).isValid || !getValidator('quantity').isValid;
        return not_valid
    }, [price, size, currentType, stopPrice, orderSlTp])

    const isDisabled = !+size || !_price || isError || !isAuth;

    const setSLTP = (status) => {
        dispatch({
            type: SET_FUTURES_PRELOADED_FORM,
            payload: { useSltp: !status },
        })
    }

    const onChangeTpSL = (key) => {
        if (isDisabled) return;
        rowData.current = {
            fee: 0,
            side: side,
            quantity: +Number(String(size).replace(/,/g, '')),
            status: 0,
            price: _price,
            quoteAsset: pairConfig.quoteAsset,
            leverage: leverage,
            symbol: pairConfig.symbol,
            ...orderSlTp
        }
        setShowEditSLTP(true);
    }

    const onConfirm = (data) => {
        setOrderSlTp({
            tp: data.tp,
            sl: data.sl,
        })
        setShowEditSLTP(false);
    }

    const renderError = () => {
        if (!+size) {
            return t('futures:tp_sl:error_qty')
        } else if (!_price) {
            return t('futures:tp_sl:error_price')
        } if (!isAuth) {
            return t('futures:order_table:login_to_continue')
        } else {
            return t('futures:invalid_amount')
        }
    }

    return (
        <>
            {(isDisabled) &&
                <Tooltip id="tooltipTPSL" place="top" effect="solid">
                    {renderError()}
                </Tooltip>
            }

            {showEditSLTP &&
                <FuturesEditSLTPVndc
                    isVisible={showEditSLTP}
                    order={rowData.current}
                    onClose={() => setShowEditSLTP(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirm}
                    lastPrice={lastPrice}
                />
            }

            <TradingInput
                containerClassName='mt-[12px]'
                label={t('futures:take_profit')}
                allowNegative={false}
                value={orderSlTp.tp}
                decimalScale={decimalScalePrice}
                // validator={getValidator('take_profit')}
                onValueChange={({ value }) => setOrderSlTp({ ...orderSlTp, tp: value })}
                labelClassName='whitespace-nowrap capitalize'
                tailContainerClassName='flex items-center font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none ' >
                        <div data-tip="" data-for="tooltipTPSL" className=' flex items-center cursor-pointer' onClick={() => onChangeTpSL('tp')} >
                            <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                        </div>
                    </div>
                )}
            />

            <TradingInput
                containerClassName='mt-[12px]'
                label={t('futures:stop_loss')}
                allowNegative={false}
                value={orderSlTp.sl}
                decimalScale={decimalScalePrice}
                // validator={getValidator('stop_loss')}
                onValueChange={({ value }) => setOrderSlTp({ ...orderSlTp, sl: value })}
                labelClassName='whitespace-nowrap capitalize'
                tailContainerClassName='flex items-center font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none'>
                        <div data-tip="" data-for="tooltipTPSL" className='flex items-center cursor-pointer' onClick={() => onChangeTpSL('sl')} >
                            <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                        </div>
                    </div>
                )}
            />
        </>
    )
}

export default FuturesOrderSLTP
