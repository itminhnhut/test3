import { useEffect, useMemo, useRef, useState } from 'react';
import Button from 'components/common/Button';
import Modal from 'components/common/ReModal';
import { Minus, Plus, X } from 'react-feather';
import Slider from 'components/trade/InputSlider';
import { formatNumber, formatCurrency } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TradingInput from 'components/trade/TradingInput';
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';
import { VndcFutureOrderType } from '../../../Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import TradingLabel from 'components/trade/TradingLabel';
import SvgWarning from 'components/svg/SvgWarning';
import colors from '../../../../../styles/colors'

const OrderVolumeMobileModal = (props) => {
    const { onClose, size, decimal, getMaxSize, pairConfig,
        type, onConfirm, availableAsset, side, pairPrice, price,
        leverage, getValidator, quoteQty
    } = props;
    const { t } = useTranslation();
    const [volume, setVolume] = useState(quoteQty)
    const [percent, setPercent] = useState(0);

    const minQuoteQty = useMemo(() => {
        return pairConfig ? pairConfig?.filters.find(item => item.filterType === "MIN_NOTIONAL")?.notional : 0
    }, [pairConfig])

    const maxQuoteQty = useMemo(() => {
        const value = getMaxSize(price, type, side, leverage, availableAsset, pairPrice, pairConfig, true)
        const max = Math.min(leverage * availableAsset, value)
        return +Number(max).toFixed(decimal);
    }, [price, type, side, leverage, availableAsset, pairPrice, pairConfig])

    const marginAndValue = useMemo(() => {
        const _price = type === FuturesOrderTypes.Market ?
            (VndcFutureOrderType.Side.BUY === side ? pairPrice?.ask : pairPrice?.bid) :
            price;
        const volumeLength = Number(volume).toFixed(0).length;
        const margin = volume / leverage;
        const marginLength = margin.toFixed(0).length;
        return { volume, margin, volumeLength, marginLength }
    }, [pairPrice, side, type, volume])

    const onChangeVolume = (x) => {
        if (!x) {
            setVolume(minQuoteQty);
        } else {
            const value = (+maxQuoteQty * x / 100).toFixed(decimal);
            setVolume(value);
        }
    }

    useEffect(() => {
        setPercent(volume * 100 / maxQuoteQty);
    }, [volume])

    const onRedirect = () => {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage('deposit');
    }

    const available = maxQuoteQty >= minQuoteQty;
    const isError = available && (volume < +minQuoteQty || volume > +maxQuoteQty)
    const initValue = 1000000;
    return (
        <Modal
            isVisible={true}
            onBackdropCb={onClose}
            containerClassName={`select-none w-[95%] overflow-x-hidden`}
        >
            <div className='-mt-1 mb-7 pb-4 flex items-center justify-between font-bold text-sm border-b border-divider dark:border-divider-dark'>
                {t('futures:order_table:volume')}
                <div
                    className='flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer'
                    onClick={onClose}
                >
                    <X size={16} />
                </div>
            </div>

            <div className='px-2 mb-7 h-[36px] flex items-center bg-gray-4 dark:bg-darkBlue-3 rounded-[4px]'>
                <div className='w-5 h-5 flex items-center justify-center rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark'>
                    <Minus
                        size={10}
                        className='text-txtSecondary dark:text-txtSecondary-dark cursor-pointer'
                        onClick={() => volume > maxQuoteQty && available && setVolume((prevState) => Number(prevState) - initValue)}
                    />
                </div>
                <TradingInput
                    label=' '
                    value={volume}
                    decimalScale={decimal}
                    allowNegative={false}
                    thousandSeparator={true}
                    containerClassName='px-2.5 flex-grow text-sm font-medium border-none h-[36px]'
                    inputClassName="!text-center"
                    onValueChange={({ value }) => setVolume(value)}
                    validator={getValidator}
                    disabled={!available}
                    autoFocus
                />
                <div className='w-5 h-5 flex items-center justify-center rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark'>
                    <Plus
                        size={10}
                        className='text-txtSecondary dark:text-txtSecondary-dark cursor-pointer'
                        onClick={() => volume < maxQuoteQty && available && setVolume((prevState) => Number(prevState) + initValue)}
                    />
                </div>
            </div>
            <div className='mb-7'>
                <Slider
                    useLabel
                    labelSuffix='%'
                    x={percent}
                    axis='x'
                    xmax={100}
                    onChange={({ x }) => available && onChangeVolume(x)}
                    dots={4}
                />
            </div>
            <div className="flex flex-wrap">
                <TradingLabel
                    label={t('common:min') + ':'}
                    value={formatNumber(minQuoteQty, decimal)}
                    containerClassName='text-xs flex justify-between w-1/2 pb-[15px] pr-[8px]'
                    valueClassName="text-right"
                />
                <TradingLabel
                    label={t('common:max') + ':'}
                    value={formatNumber(maxQuoteQty, decimal)}
                    containerClassName='text-xs flex justify-between w-1/2 pb-[15px]'
                    valueClassName="text-right"
                />
                <TradingLabel
                    label={t('futures:margin') + ':'}
                    value={`${marginAndValue?.marginLength > 7 ? formatCurrency(marginAndValue?.margin) : formatNumber(
                        marginAndValue?.margin,
                        pairConfig?.pricePrecision || 2
                    )}`}
                    containerClassName='text-xs flex justify-between w-1/2 pb-[15px] pr-[8px]'
                    valueClassName="text-right"
                />
                <TradingLabel
                    label={t('futures:mobile:available') + ':'}
                    value={formatNumber(availableAsset ?? 0, 0)}
                    containerClassName='text-xs flex justify-between w-1/2 pb-[15px]'
                    valueClassName="text-right"
                />
            </div>
            {!available &&
                <div className='mt-2.5 flex items-center'>
                    <SvgWarning size={12} fill={colors.red2} />
                    <div className='pl-2.5 font-medium text-xs text-red'>
                        {t('futures:mobile:balance_insufficient')}
                    </div>
                </div>
            }
            <div className='mt-5 mb-2'>
                <Button
                    title={t(available ? 'futures:leverage:confirm' : 'wallet:deposit')}
                    componentType='button'
                    className={`!h-[36px] ${isError ? 'dark:!bg-darkBlue-3 dark:!text-darkBlue-4' : ''}`}
                    type='primary'
                    disabled={isError}
                    onClick={() => available ? onConfirm(+volume) : onRedirect()}
                />
            </div>
        </Modal>
    );
};

export default OrderVolumeMobileModal;