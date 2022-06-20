import Div100vh from 'react-div-100vh';
import NumberFormat from 'react-number-format';
import {formatNumber, scrollFocusInput} from 'redux/actions/utils';
import React, {useContext, useMemo, useState} from 'react';
import {useTranslation} from 'next-i18next';

import classNames from 'classnames';
import {X} from 'react-feather';
import {useSelector} from 'react-redux';
import {getProfitVndc, VndcFutureOrderType} from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import axios from 'axios';
import {API_VNDC_FUTURES_CHANGE_MARGIN} from 'redux/actions/apis';
import {DefaultFuturesFee} from 'redux/actions/const';
import {AlertContext} from 'components/common/layouts/LayoutMobile';
import {IconLoading} from 'components/common/Icons';
import WarningCircle from 'components/svg/WarningCircle';
import floor from 'lodash/floor'
import Modal from "components/common/ReModal";

const ADJUST_TYPE = {
    ADD: 'ADD',
    REMOVE: 'REMOVE'
}

const VNDC_ID = 72

const CONFIG_MIN_PROFIT = [
    {leverage: [-Infinity, 1], minMarginRatio: .2},
    {leverage: [1, 5], minMarginRatio: .25},
    {leverage: [5, 10], minMarginRatio: .3},
    {leverage: [10, 15], minMarginRatio: .4},
    {leverage: [15, 25], minMarginRatio: .5},
    {leverage: [25, Infinity], minMarginRatio: null},
]

const calMinProfitAllow = (leverage) => {
    const {minMarginRatio} = CONFIG_MIN_PROFIT.find(c => {
        const [start, end] = c.leverage
        return leverage > start && leverage <= end
    })
    return minMarginRatio
}

const calLiqPrice = (side, quantity, open_price, margin, fee) => {
    const size = (side === VndcFutureOrderType.Side.SELL ? -quantity : quantity)
    const number = (side === VndcFutureOrderType.Side.SELL ? -1 : 1);
    return (size * open_price + fee - margin) / (quantity * (number - DefaultFuturesFee.NamiFrameOnus))
}

const AdjustPositionMargin = ({order, pairPrice, onClose, forceFetchOrder}) => {
    const [adjustType, setAdjustType] = useState(ADJUST_TYPE.ADD)
    const [amount, setAmount] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const _setAdjustType = (type) => {
        setAdjustType(type)
        setAmount('')
    }

    const assetConfig = useSelector((state) => state.utils.assetConfig.find(({id}) => id === VNDC_ID))
    const futuresBalance = useSelector((state) => state.wallet.FUTURES[VNDC_ID]) || {};
    const alertContext = useContext(AlertContext);

    const {available} = useMemo(() => {
        if (!assetConfig || !futuresBalance) return {}
        return {
            available: Math.max(futuresBalance.value, 0) - Math.max(futuresBalance.locked_value, 0)
        }
    }, [assetConfig, futuresBalance])

    const {t} = useTranslation()

    const lastPrice = order?.side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask
    const profit = getProfitVndc(order, lastPrice)

    const {newMargin = 0, newLiqPrice = 0, minMarginRatio, initMargin = 0, maxRemovable = 0} = useMemo(() => {
        if (!order) return {}
        const profit = getProfitVndc(order, lastPrice, true)
        const initMargin = +order.order_value / +order.leverage
        const minMarginRatio = calMinProfitAllow(order.leverage)
        // const maxRemovable = initMargin * (1 - minMarginRatio + Math.min(profit / initMargin, 0)) - (initMargin - order.margin)
        let maxRemovable = order.margin - initMargin * minMarginRatio + Math.min(profit, 0)
        if (!minMarginRatio) {
            maxRemovable = 0
        }

        const newMargin = +order?.margin + (adjustType === ADJUST_TYPE.REMOVE ? -amount : +amount)
        return {
            newMargin,
            newLiqPrice: calLiqPrice(order.side, order.quantity, order.open_price, newMargin, order.fee),
            minMarginRatio,
            initMargin,
            maxRemovable: maxRemovable * .9 // Minus 10% to ensure valid in server
        }
    }, [order, amount, adjustType, lastPrice])

    const percent = formatNumber(((profit / newMargin) * 100), 2, 0, true);

    const error = useMemo(() => {
        if (+amount > available && adjustType === ADJUST_TYPE.ADD) {
            return t('futures:maximum_price') + formatNumber(available, assetConfig?.assetDigit)
        }

    }, [amount, available, assetConfig, adjustType, percent])

    const handleSetMaxAmount = () => {
        switch (adjustType) {
            case ADJUST_TYPE.ADD:
                setAmount(floor(available))
                break;
            case ADJUST_TYPE.REMOVE:
                setAmount(floor(maxRemovable))
                break;
        }
    }

    const errorProfit = useMemo(() => {
        if (adjustType === ADJUST_TYPE.REMOVE) {
            return t('futures:mobile:adjust_margin:temp_future')
        }
        if (adjustType === ADJUST_TYPE.REMOVE) {
            if (minMarginRatio === null) {
                return t('futures:mobile:adjust_margin:not_allow_change_margin')
            } else if (+amount > maxRemovable) {
                return t(`futures:mobile:adjust_margin:max_removable`, {max: formatNumber(maxRemovable, assetConfig?.assetDigit || 0)})
            }
        }
    }, [adjustType, amount, maxRemovable, minMarginRatio, assetConfig])

    const handleConfirm = async () => {
        setSubmitting(true)
        const {data} = await axios.put(API_VNDC_FUTURES_CHANGE_MARGIN, {
            displaying_id: order?.displaying_id,
            margin_change: amount,
            type: adjustType
        }).catch(err => {
            console.error(err)
            return {data: {status: 'UNKNOWN'}}
        })
        setSubmitting(false)

        if (forceFetchOrder) forceFetchOrder()

        if (data.status === 'ok') {
            const message = t(`futures:mobile:adjust_margin:${{
                [ADJUST_TYPE.ADD]: 'add_success',
                [ADJUST_TYPE.REMOVE]: 'remove_success'
            }[adjustType]
            }`)
            alertContext.alert.show('success', t('common:success'), message, null, null, onClose)
        } else {
            alertContext.alert.show('error', t('common:failed'), t(`futures:mobile:adjust_margin:error:${data.status || 'UNKNOWN'}`))
        }
    }

    return (
        <Div100vh
            className={classNames(
                'flex flex-col fixed w-full h-full inset-0 z-20 bg-onus-bgModal2/[0.7]',
                {
                    hidden: !order,
                }
            )}
        >
            <div className='h-full' onClick={onClose}/>
            <div
                className='bg-onus-line w-full rounded-t-2xl pb-10'>
                <div className='flex justify-between items-center px-4 pb-4 pt-11'>
                    <span

                        className='text-lg text-onus-white font-bold'>{t('futures:mobile:adjust_margin:adjust_position_margin')}</span>
                </div>
                <div className='grid grid-cols-2 font-bold'>
                    <div
                        className={
                            classNames(
                                'p-2 text-center',
                                {
                                    'border-b border-[#2B3247] text-onus-textSecondary': adjustType === ADJUST_TYPE.REMOVE,
                                    'border-b-2 border-onus-base text-onus-base': adjustType === ADJUST_TYPE.ADD,
                                }
                            )
                        }
                        onClick={() => _setAdjustType(ADJUST_TYPE.ADD)}
                    >
                        {t('futures:mobile:adjust_margin:add')}
                    </div>
                    <div
                        className={
                            classNames(
                                'p-2 text-center',
                                {
                                    'border-b border-[#2B3247] text-onus-textSecondary': adjustType === ADJUST_TYPE.ADD,
                                    'border-b-2 border-onus-base text-onus-base': adjustType === ADJUST_TYPE.REMOVE,
                                }
                            )
                        }
                        onClick={() => _setAdjustType(ADJUST_TYPE.REMOVE)}
                    >
                        {t('futures:mobile:adjust_margin:remove')}
                    </div>
                </div>
                <div className='px-4 pt-4'>
                    <div>
                        <span className='uppercase text-xs text-onus-textSecondary'>
                            {t('futures:mobile:adjust_margin:amount')}
                        </span>
                    </div>
                    <ErrorToolTip message={!errorProfit ? error : ''}>
                        <div
                            className='flex justify-between items-center pl-4 bg-onus-2 text-sm rounded-md h-11 mb-2 mt-2'>
                            <NumberFormat
                                thousandSeparator
                                allowNegative={false}
                                className='outline-none font-medium flex-1 py-2'
                                value={amount}
                                onValueChange={({value}) => setAmount(value)}
                                decimalScale={assetConfig?.assetDigit}
                                inputMode='decimal'
                                allowedDecimalSeparators={[',', '.']}
                                placeholder={t('futures:mobile:adjust_margin:amount_placeholder')}
                                onFocus={scrollFocusInput}
                            />
                            <div
                                className='flex items-center'
                                onClick={handleSetMaxAmount}
                            >
                                <span className='px-4 py-2 text-onus-base font-semibold'>
                                    {t('futures:mobile:adjust_margin:max')}
                                </span>
                                <div
                                    className='h-full leading-[2.75rem] bg-onus-1 w-16 text-onus-grey font-medium rounded-r-md text-center'>
                                    {assetConfig?.assetCode}
                                </div>
                            </div>
                        </div>
                    </ErrorToolTip>
                    <div className='mt-6 space-y-1'>
                        <div className='text-xs'>
                            <span
                                className='text-onus-textSecondary mr-1'>{t('futures:mobile:adjust_margin:assigned_margin')}</span>
                            <span className='text-onus-white font-medium'>
                                {formatNumber(order?.margin, assetConfig?.assetDigit)}
                                <span className='ml-1'>{assetConfig?.assetCode}</span>
                            </span>
                        </div>
                        <div className='text-xs'>
                            <span
                                className='text-onus-textSecondary mr-1'>{t('futures:mobile:adjust_margin:available')}</span>
                            <span className='text-onus-white font-medium'>
                                {formatNumber(floor(+available, 0), assetConfig?.assetDigit)}
                                <span className='ml-1'>{assetConfig?.assetCode}</span>
                            </span>
                        </div>
                        <div className='text-xs'>
                            <span
                                className='text-onus-textSecondary mr-1'>{t('futures:mobile:adjust_margin:new_liq_price')}</span>
                            <span className='text-onus-white font-medium'>
                                {newLiqPrice > 0 ? formatNumber(newLiqPrice, assetConfig?.assetDigit, 0, true) : '0'}
                                <span className='ml-1'>{assetConfig?.assetCode}</span>
                            </span>
                        </div>
                        <div className='text-xs'>
                            <span
                                className='text-onus-textSecondary mr-1'>{t('futures:mobile:adjust_margin:profit_ratio')}</span>
                            <span className={classNames('font-medium', {
                                'text-onus-green': percent >= 0,
                                'text-onus-red': percent < 0
                            })}>
                                {(percent > 0 ? '+' : '') + percent + '%'}
                            </span>
                        </div>
                    </div>
                    <div className='mt-5 leading-3'>
                        {
                            errorProfit && <div className='flex items-start'>
                                <WarningCircle className='flex-none mr-2'/>
                                <span className='text-xs text-[#FF9F1A]'>{errorProfit}</span>
                            </div>
                        }
                    </div>
                    <div
                        className={classNames('flex justify-center items-center bg-onus-base align-middle h-12 text-onus-white rounded-md font-bold mt-8', {
                            '!bg-onus-1 !text-onus-textSecondary': !!error || !+amount || !!errorProfit
                        })}
                        onClick={() => {
                            if (!error && !errorProfit && !!+amount && !submitting) {
                                handleConfirm()
                            }
                        }}
                    >
                        {
                            submitting
                                ? <IconLoading color='#FFFFFF'/>
                                : <span>{t('futures:mobile:adjust_margin:confirm_btn')}</span>
                        }
                    </div>
                </div>
            </div>
        </Div100vh>
    )
}

export default AdjustPositionMargin

const ErrorToolTip = ({children, message}) => {
    return <div className='relative'>
        <div className={classNames('absolute -top-1 -translate-y-full z-50 flex flex-col items-center', {
            hidden: !message
        })}>
            <div className='px-2 py-1.5 rounded-md bg-gray-3 dark:bg-darkBlue-4 text-xs'>
                {message}
            </div>
            <div
                className='w-[8px] h-[6px] bg-gray-3 dark:bg-darkBlue-4'
                style={{clipPath: 'polygon(50% 100%, 0 0, 100% 0)'}}
            />
        </div>
        {children}
    </div>
}
