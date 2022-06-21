import { useEffect, useMemo, useState, useRef } from 'react';
import Button from 'components/common/Button';
import Modal from 'components/common/ReModal';
import { Minus, Plus, X } from 'react-feather';
import Slider from 'components/trade/InputSlider';
import { emitWebViewEvent, formatCurrency, formatNumber, scrollFocusInput } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TradingInput from 'components/trade/TradingInput';
import TradingLabel from 'components/trade/TradingLabel';
import SvgWarning from 'components/svg/SvgWarning';
import colors from 'styles/colors';

const initValue = 100000;
const OrderVolumeMobileModal = (props) => {
    const { onClose, size, decimal, getMaxQuoteQty, pairConfig,
        type, onConfirm, availableAsset, side, pairPrice, price,
        leverage, getValidator, quoteQty
    } = props;
    const onusMode = true
    const { t } = useTranslation();
    const [volume, setVolume] = useState(quoteQty)
    const [percent, setPercent] = useState(0);
    const firstTime = useRef(true);

    const minQuoteQty = useMemo(() => {
        return pairConfig ? pairConfig?.filters.find(item => item.filterType === "MIN_NOTIONAL")?.notional : initValue
    }, [pairConfig])

    const maxQuoteQty = useMemo(() => {
        const _maxQuoteQty = getMaxQuoteQty(price, type, side, leverage, availableAsset, pairPrice, pairConfig, true)
        const max = Math.min(leverage * availableAsset, _maxQuoteQty)
        return +Number(max).toFixed(decimal);
    }, [price, type, side, leverage, availableAsset, pairPrice, pairConfig])

    const marginAndValue = useMemo(() => {
        const volumeLength = Number(volume).toFixed(0).length;
        const margin = volume / leverage;
        const marginLength = margin.toFixed(0).length;
        return { volume, margin, volumeLength, marginLength }
    }, [pairPrice, side, type, volume])

    const arrDot = useMemo(() => {
        const size = 100 / 4;
        const arr = [];
        for (let i = 0; i <= 4; i++) {
            arr.push(i * size)
        }
        return arr
    }, [])

    const onChangeVolume = (x) => {
        if (!x) {
            firstTime.current = true;
            setVolume(minQuoteQty);
        } else {
            const _x = arrDot.reduce((prev, curr) => {
                let i = 0;
                if (Math.abs(curr - x) < 2 || Math.abs(prev - x) < 2) {
                    i = Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
                }
                return i;
            });
            const value = (+maxQuoteQty * _x ? _x : x / 100).toFixed(decimal);
            setVolume(value);
            setPercent(_x ? _x : x);
        }
    }

    useEffect(() => {
        if (firstTime.current) {
            setPercent(volume * 100 / maxQuoteQty);
            firstTime.current = false;
        }
    }, [volume, maxQuoteQty])

    const onRedirect = () => {
        emitWebViewEvent('deposit')
    }

    const available = maxQuoteQty >= minQuoteQty;
    const isError = available && (volume < +minQuoteQty || volume > +maxQuoteQty)
    const changeClass = `w-5 h-5 flex items-center justify-center rounded-md  ${onusMode ? 'hover:bg-onus-bg3 dark:hover:bg-onus-bg3' : 'hover:bg-bgHover dark:hover:bg-bgHover-dark'}`
    return (
        <Modal
            onusMode={true}
            isVisible={true}
            onBackdropCb={onClose}
            onusClassName="!pt-[44px] !pb-[40px]"
        >

            <div className='mb-6 flex items-center justify-between font-bold text-lg'>
                {t('futures:order_table:volume')}
            </div>
            <div className='px-2 mb-12 h-[44px] flex items-center bg-gray-4 dark:bg-onus-bg2 rounded-[4px]'>
                <div className={changeClass}>
                    <Minus
                        size={15}
                        className='text-onus-white cursor-pointer'
                        onClick={() => volume > minQuoteQty && available && setVolume((prevState) => Number(prevState) - initValue)}
                    />
                </div>
                <TradingInput
                    onusMode={true}
                    label=' '
                    value={volume}
                    decimalScale={decimal}
                    allowNegative={false}
                    thousandSeparator={true}
                    containerClassName='px-2.5 flex-grow text-sm font-medium border-none h-[44px] w-[200px] dark:bg-onus-bg2'
                    inputClassName="!text-center"
                    onValueChange={({ value }) => setVolume(value)}
                    validator={getValidator}
                    disabled={!available}
                    autoFocus
                    inputMode="decimal"
                    allowedDecimalSeparators={[',', '.']}
                    onFocus={scrollFocusInput}
                />
                <div className={changeClass}>
                    <Plus
                        size={15}
                        className='text-onus-white cursor-pointer'
                        onClick={() => volume < maxQuoteQty && available && setVolume((prevState) => Number(prevState) + initValue)}
                    />
                </div>
            </div>
            <div className='mb-8'>
                <Slider
                    useLabel
                    positionLabel='top'
                    onusMode
                    labelSuffix='%'
                    x={percent}
                    axis='x'
                    xmax={100}
                    onChange={({ x }) => available && onChangeVolume(x)}
                    bgColorActive={colors.onus.slider}
                    bgColorSlide={colors.onus.slider}
                    dots={4}

                />
            </div>
            <div className="flex flex-col">
                <TradingLabel
                    label={t('common:min') + ':'}
                    value={formatNumber(minQuoteQty, decimal) + ' ' + (pairConfig?.quoteAsset ?? '')}
                    containerClassName='text-xs flex pb-[6px]'
                    valueClassName="text-right"
                />
                <TradingLabel
                    label={t('common:max') + ' (' + leverage + 'x):'}
                    value={formatNumber(maxQuoteQty, decimal) + ' ' + (pairConfig?.quoteAsset ?? '')}
                    containerClassName='text-xs flex pb-[6px]'
                    valueClassName="text-right"
                />
                <TradingLabel
                    label={t('futures:margin') + ' :'}
                    value={`${marginAndValue?.marginLength > 7 ? formatCurrency(marginAndValue?.margin) : formatNumber(
                        marginAndValue?.margin,
                        0
                    )} ${pairConfig?.quoteAsset ?? ''}`}
                    containerClassName='text-xs flex'
                    valueClassName="text-right break-all"
                />
                {/* <TradingLabel
                        label={t('futures:mobile:available') + ':'}
                        value={formatNumber(availableAsset ?? 0, 0)}
                        containerClassName='text-xs flex  pb-[15px]'
                        valueClassName="text-right"
                    /> */}
            </div>
            {!available &&
                <div className='mt-2.5 flex items-center'>
                    <SvgWarning size={12} fill={colors.red2} />
                    <div className='pl-2.5 font-medium text-xs text-red'>
                        {t('futures:mobile:balance_insufficient')}
                    </div>
                </div>
            }
            <div className='mt-8'>
                <Button
                    onusMode={true}
                    title={t(available ? 'futures:leverage:confirm' : 'wallet:deposit')}
                    componentType='button'
                    className={`!h-[48px] !text-[16px] !font-semibold ${isError ? 'dark:!bg-darkBlue-3 dark:!text-darkBlue-4' : ''}`}
                    type='primary'
                    disabled={isError}
                    onClick={() => available ? onConfirm(+volume) : onRedirect()}
                />
            </div>
        </Modal>
    );
};

export default OrderVolumeMobileModal;
