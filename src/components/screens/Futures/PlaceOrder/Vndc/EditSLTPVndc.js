import { useState, useMemo } from 'react';
import Button from 'components/common/Button';
import Modal from 'components/common/ReModal';
import { X } from 'react-feather';
import { formatNumber } from 'redux/actions/utils';
import { VndcFutureOrderType } from './VndcFutureOrderType';
import NumberFormat from 'react-number-format';
import { useTranslation } from 'next-i18next'
import TradingInput from 'components/trade/TradingInput';

const FuturesEditSLTPVndc = ({ isVisible, order, onClose, status, pairPrice, onConfirm, pairConfig }) => {
    const { t } = useTranslation();
    const [data, setData] = useState({
        displaying_id: order?.displaying_id,
        price: status === VndcFutureOrderType.Status.PENDING ? order?.price : status === VndcFutureOrderType.Status.ACTIVE ? order?.open_price : order?.close_price,
        sl: Number(order?.sl),
        tp: Number(order?.tp),
    })

    const getProfitSLTP = (sltp) => {
        const { fee = 0, side, quantity, open_price } = order;
        let total = quantity * (sltp - open_price);
        let profit = side === VndcFutureOrderType.Side.BUY ? total - fee : -total - fee;
        return formatNumber(profit, 0, 0, true);
    }

    const onHandleChange = (key, e) => {
        const value = e.value;
        setData({ ...data, [key]: +value })
    }

    const inputValidator = (type, price) => {
        let isValid = true,
            msg = null

        const priceFilter =
            pairConfig?.filters?.find((o) => o.filterType === 'PRICE_FILTER') ||
            {}
        switch (type) {
            case 'price':
            case 'stop_loss':
            case 'take_profit':
                const _maxPrice = priceFilter?.maxPrice
                const _minPrice = priceFilter?.minPrice
                const _price = type === 'price' ? data.price : type === 'stop_loss' ? data.sl : data.tp

                if (+_price < +_minPrice) {
                    isValid = false
                    msg = `Minium Price is ${_minPrice}`
                }

                if (+_price > +_maxPrice) {
                    isValid = false
                    msg = `Maxium Price is ${_maxPrice}`
                }

                return { isValid, msg }
            default:
                return {}
        }
    }

    const countDecimals = (value) => {
        if (Math.floor(value) === value || !value) return 0;
        return value.toString().split(".")[1]?.length || 0;
    }

    const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');

    const isError = useMemo(() => {
        const not_valid = !inputValidator('price').isValid || !inputValidator('stop_loss').isValid || !inputValidator('take_profit').isValid;
        return not_valid;
    }, [data])

    const classNameError = isError ? '!bg-gray-3 dark:!bg-darkBlue-4 text-gray-1 dark:text-darkBlue-2 cursor-not-allowed' : '';

    return (
        <Modal isVisible={isVisible} containerClassName='w-[390px] p-0 top-[50%]'>
            <div className='px-5 py-4 flex items-center justify-between border-b border-divider dark:border-divider-dark'>
                <span className='font-bold text-[16px]'>
                    {t('futures:tp_sl:modify_tpsl')}
                </span>{' '}
                <X
                    size={20}
                    strokeWidth={1}
                    className='cursor-pointer'
                    onClick={onClose}
                />
            </div>
            <div className='px-5 pt-4 pb-6 text-sm'>
                <div className='mb-3 font-medium flex items-center justify-between'>
                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                        {t('futures:symbol')}
                    </span>
                    <span className='text-dominant'>{order?.symbol} {t('futures:tp_sl:perpetual')} {order?.leverage}x</span>
                </div>
                <div className='mb-3 font-medium flex items-center justify-between'>
                    {!status ?
                        <div className='px-3 flex items-center w-full h-[36px] bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                            {/* <span className='font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap'>
                                {t('futures:order_table:open_price')}
                            </span> */}
                            <TradingInput
                                thousandSeparator
                                type='text'
                                className='flex-grow text-right font-medium h-[21px]'
                                containerClassName='!py-0 !px-0 border-none'
                                value={data.price}
                                label={t('futures:open_price')}
                                validator={inputValidator('price')}
                                decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                                onValueChange={(e) => onHandleChange('price', e)}
                            />
                            {/* <input className='flex-grow px-2 text-right font-medium' onChange={(e) => onHandleChange('price', e)} value={data.price} /> */}
                            <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark pl-2'>
                                {pairPrice?.quoteAsset}
                            </span>
                        </div>
                        :
                        <>
                            <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                {t('futures:order_table:open_price')}
                            </span>
                            <span className=''>{formatNumber(data.price, 2, 0, true) + ' ' + pairPrice?.quoteAsset}</span>
                        </>
                    }
                </div>
                <div className='font-medium flex items-center justify-between'>
                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                        {t('futures:order_table:mark_price')}
                    </span>
                    <span className=''>{formatNumber(pairPrice?.lastPrice, 2, 0, true) + ' ' + pairPrice?.quoteAsset}</span>
                </div>

                <div className='mt-5 flex items-center'>
                    <div className='px-3 flex items-center max-w-[266px] h-[36px] bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        {/* <span className='font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap'>
                            {t('futures:take_profit')}
                        </span> */}
                        <TradingInput
                            thousandSeparator
                            type='text'
                            label={t('futures:take_profit')}
                            className='flex-grow text-right font-medium h-[21px]'
                            containerClassName='!py-0 !px-0 border-none'
                            value={data.tp}
                            validator={inputValidator('take_profit')}
                            decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                            onValueChange={(e) => onHandleChange('tp', e)}
                            allowNegative={false}
                        />
                        {/* <input className='flex-grow px-2 text-right font-medium' onChange={(e) => onHandleChange('tp', e)} value={data.tp} /> */}
                        <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark pl-2'>
                            {pairPrice?.quoteAsset}
                        </span>
                    </div>
                    <div className='relative ml-3 px-2 min-w-[72px] h-[36px] flex items-center justify-center bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        <span className=''>Last</span>
                    </div>
                </div>
                <div className='mt-2 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('futures:tp_sl:when')}&nbsp;
                    <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                        {t('futures:mark_price')}&nbsp;
                    </span>
                    {t('futures:tp_sl:reaches')}&nbsp;
                    <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                        {formatNumber(data.tp, 0, 0, true)}
                    </span>
                    {t('futures:tp_sl:is_will')}&nbsp;
                    <span className='text-dominant'>{getProfitSLTP(data.tp) + ' ' + pairPrice?.quoteAsset}</span>.
                </div>

                <div className='my-4 w-full h-[1px] bg-divider dark:bg-divider-dark' />

                <div className='flex items-center'>
                    <div className='px-3 flex flex-grow items-center max-w-[266px] h-[36px] bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        {/* <span className='font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap'>
                            {t('futures:stop_loss')}
                        </span> */}
                        <TradingInput
                            thousandSeparator
                            type='text'
                            className='flex-grow text-right font-medium h-[21px]'
                            containerClassName='!py-0 !px-0 border-none'
                            value={data.sl}
                            label={t('futures:stop_loss')}
                            validator={inputValidator('stop_loss')}
                            decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                            onValueChange={(e) => onHandleChange('sl', e)}
                            allowNegative={false}
                        />
                        {/* <input className='flex-grow px-2 text-right font-medium' onChange={(e) => onHandleChange('sl', e)} value={data.sl} /> */}
                        <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark pl-2'>
                            {pairPrice?.quoteAsset}
                        </span>
                    </div>
                    <div className='ml-3 px-2 min-w-[72px] h-[36px] flex items-center justify-center bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        <span className=''>Last</span>
                    </div>
                </div>
                <div className='mt-2 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('futures:tp_sl:when')}&nbsp;
                    <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                        {t('futures:mark_price')}&nbsp;
                    </span>
                    {t('futures:tp_sl:reaches')}&nbsp;
                    <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                        {formatNumber(data.sl, 0, 0, true)}
                    </span>
                    {t('futures:tp_sl:is_will')}&nbsp;
                    <span className='text-red'>{getProfitSLTP(data.sl) + ' ' + pairPrice?.quoteAsset}</span>.
                </div>

                <div className='mt-4 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('futures:tp_sl:this_setting')}&nbsp;
                    <span className='font-bold'>{t('futures:tp_sl:take_profit_stop_loss')}</span>&nbsp;
                    {t('futures:tp_sl:automaticcally_cancel')}
                </div>

                <Button
                    title={t('futures:leverage:confirm')}
                    type='primary'
                    className={`mt-5 !h-[36px] ${classNameError}`}
                    componentType='button'
                    disabled={isError}
                    onClick={() => {
                        const params = {
                            ...data,
                            price: Number(data.price),
                            sl: Number(data.sl),
                            tp: Number(data.tp)
                        }
                        onConfirm(params)
                    }}
                />
            </div>
        </Modal>
    )
}

export default FuturesEditSLTPVndc
