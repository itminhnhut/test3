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

const OrderVolumeMobileModal = (props) => {
    const { onClose, size, decimal, getMaxSize, pairConfig,
        type, onConfirm, availableAsset, side, pairPrice, price,
        leverage, getValidator
    } = props;
    const { t } = useTranslation();
    const [volume, setVolume] = useState(size)
    const [percent, setPercent] = useState(0);
    const [minSize, setMinSize] = useState(0)

    const classMobile = useMemo(() => {
        const widht = window.innerWidth < 330 ? 'w-[300px]' : '!w-[340px]';
        return widht + ' overflow-x-hidden '
    }, [])

    const maxSize = useMemo(() => {
        const value = getMaxSize(price, type, side, leverage, availableAsset, pairPrice, pairConfig)
        return +Number(value).toFixed(decimal);
    }, [price, type, side, leverage, availableAsset, pairPrice, pairConfig])

    useEffect(() => {
        const lotSize =
            pairConfig?.filters?.find((o) =>
                [
                    FuturesOrderTypes.Market,
                    FuturesOrderTypes.StopMarket,
                ].includes(type)
                    ? o?.filterType === 'MARKET_LOT_SIZE'
                    : o?.filterType === 'LOT_SIZE'
            ) || {}
        setMinSize(+lotSize.minQty)
        setPercent(size * 100 / maxSize);
    }, [])

    const marginAndValue = useMemo(() => {
        const _price = type === FuturesOrderTypes.Market ?
            (VndcFutureOrderType.Side.BUY === side ? pairPrice?.ask : pairPrice?.bid) :
            price;
        const _volume = volume * _price;
        const volumeLength = _volume.toFixed(0).length;
        const margin = _volume / leverage;
        const marginLength = margin.toFixed(0).length;
        return { volume, margin, volumeLength, marginLength }
    }, [pairPrice, side, type, volume])

    const onChangeVolume = (x) => {
        if (!x) {
            setVolume(minSize);
        } else {
            const value = (+maxSize * x / 100).toFixed(decimal);
            setVolume(value);
        }
    }

    useEffect(() => {
        setPercent(volume * 100 / maxSize);
    }, [volume])


    const isError = volume < +minSize || volume > +maxSize
    const initValue = decimal === 0 ? 1 : decimal < 2 ? 0.1 : parseFloat((Number(0).toFixed(decimal - 1) + '1'))
    return (
        <Modal
            isVisible={true}
            onBackdropCb={onClose}
            containerClassName={`select-none ${classMobile}`}
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
                        onClick={() => volume > minSize && setVolume((prevState) => Number(prevState) - initValue)}
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
                />
                <div className='w-5 h-5 flex items-center justify-center rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark'>
                    <Plus
                        size={10}
                        className='text-txtSecondary dark:text-txtSecondary-dark cursor-pointer'
                        onClick={() => volume < maxSize && setVolume((prevState) => Number(prevState) + initValue)}
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
                    onChange={({ x }) => onChangeVolume(x)}
                    dots={4}
                />
            </div>
            <div className="flex flex-wrap">
                <TradingLabel
                    label={t('common:min') + ':'}
                    value={minSize + ' ' + pairConfig.baseAsset}
                    containerClassName='text-xs flex justify-between w-1/2 pb-[15px] pr-[8px]'
                />
                <TradingLabel
                    label={t('common:max') + ':'}
                    value={maxSize + ' ' + pairConfig.baseAsset}
                    containerClassName='text-xs flex justify-between w-1/2 pb-[15px]'
                />
                <TradingLabel
                    label={t('futures:margin') + ':'}
                    value={`${marginAndValue?.marginLength > 7 ? formatCurrency(marginAndValue?.margin) : formatNumber(
                        marginAndValue?.margin,
                        pairConfig?.pricePrecision || 2
                    )} ${pairConfig.quoteAsset}`}
                    containerClassName='text-xs flex justify-between w-1/2 pb-[15px] pr-[8px]'
                />
                <TradingLabel
                    label={t('futures:mobile:available') + ':'}
                    value={formatNumber(availableAsset ?? 0, 0) + ' ' + pairConfig.quoteAsset}
                    containerClassName='text-xs flex justify-between w-1/2 pb-[15px]'
                />
            </div>
            <div className='mt-5 mb-2'>
                <Button
                    title={t('futures:leverage:confirm')}
                    componentType='button'
                    className={`!h-[36px] ${isError ? 'dark:!bg-darkBlue-3 dark:!text-darkBlue-4' : ''}`}
                    type='primary'
                    disabled={isError}
                    onClick={() => onConfirm(+volume)}
                />
            </div>
        </Modal>
    );
};

export default OrderVolumeMobileModal;